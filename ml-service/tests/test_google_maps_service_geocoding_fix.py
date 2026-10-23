import time
import urllib.error

import pytest

from app.services import google_maps_service as maps


def test_goa_generic_activities_use_named_map_points():
    assert maps.ALIASES["goa"]["beach visit"] == "Calangute Beach"
    assert maps.ALIASES["goa"]["water sports"] == "Baga Beach"
    assert maps.DESTINATION_SEARCH_NAMES["goa"] == "Goa, India"


def test_retry_after_seconds_is_respected():
    error = urllib.error.HTTPError(
        "https://example.test", 429, "Too Many Requests", {"Retry-After": "25"}, None
    )
    assert maps._retry_after_seconds(error) == 25.0


def test_nominatim_429_opens_backoff_and_avoids_repeated_network_call(monkeypatch):
    monkeypatch.setattr(maps, "_nominatim_backoff_until", 0.0)
    monkeypatch.setattr(maps, "_last_nominatim_request", 0.0)
    calls = []

    def rate_limited(url, timeout=None):
        calls.append(url)
        raise urllib.error.HTTPError(
            url, 429, "Too Many Requests", {"Retry-After": "30"}, None
        )

    monkeypatch.setattr(maps, "_get_json", rate_limited)

    with pytest.raises(maps.GeocodingTemporarilyUnavailable):
        maps._nominatim_search("Calangute Beach, Goa, India")

    assert len(calls) == 1
    assert maps._nominatim_backoff_until > time.monotonic()
    with pytest.raises(maps.GeocodingTemporarilyUnavailable):
        maps._nominatim_search("Baga Beach, Goa, India")
    assert len(calls) == 1


def test_successful_persistent_cache_round_trip(monkeypatch, tmp_path):
    monkeypatch.setattr(maps, "GEOCODE_CACHE_DB_PATH", str(tmp_path / "cache.sqlite3"))
    cache_key = ("goa", "calangute beach")
    place = {
        "name": "Calangute Beach",
        "latitude": 15.544,
        "longitude": 73.755,
        "address": "Calangute, Goa, India",
        "opening_hours": None,
        "osm_type": "way",
        "osm_id": 123,
        "match_confidence": 1.0,
        "map_url": "https://www.openstreetmap.org/way/123",
    }

    maps._persistent_cache_put(cache_key, place)
    assert maps._persistent_cache_get(cache_key) == place


def test_transient_geocoding_error_does_not_poison_permanent_cache(monkeypatch, tmp_path):
    monkeypatch.setattr(maps, "GEOCODE_CACHE_DB_PATH", str(tmp_path / "transient.sqlite3"))
    cache_key = ("goa", "water sports")
    maps._geocode_cache.pop(cache_key, None)
    maps._transient_failure_until.pop(cache_key, None)
    monkeypatch.setattr(
        maps,
        "_nominatim_search",
        lambda query: (_ for _ in ()).throw(
            maps.GeocodingTemporarilyUnavailable("cooldown")
        ),
    )

    result = maps._find_places("Goa", [{"activity_name": "Water Sports"}])

    assert "water sports" not in result
    assert cache_key not in maps._geocode_cache
    assert maps._transient_failure_until[cache_key] > time.monotonic()
    maps._transient_failure_until.pop(cache_key, None)
