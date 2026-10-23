import json
import logging
import os
import re
import sqlite3
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from difflib import SequenceMatcher
from email.utils import parsedate_to_datetime
from threading import Lock

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
OSRM_URL = "https://router.project-osrm.org/route/v1/driving"
USER_AGENT = os.getenv("TRIPEASE_MAP_USER_AGENT", "TripEaseTravelPlanner/1.0")
REQUEST_TIMEOUT = max(5, int(os.getenv("TRIPEASE_MAP_TIMEOUT_SECONDS", "12")))
NOMINATIM_DELAY_SECONDS = max(1.0, float(os.getenv("TRIPEASE_NOMINATIM_DELAY_SECONDS", "1.1")))
NOMINATIM_BACKOFF_SECONDS = max(30, int(os.getenv("TRIPEASE_NOMINATIM_BACKOFF_SECONDS", "60")))
NETWORK_ERROR_COOLDOWN_SECONDS = max(5, int(os.getenv("TRIPEASE_MAP_ERROR_COOLDOWN_SECONDS", "10")))
GEOCODE_CACHE_TTL_SECONDS = 30 * 24 * 60 * 60
GEOCODE_CACHE_DB_PATH = os.getenv(
    "TRIPEASE_GEOCODE_CACHE_FILE",
    os.path.join(tempfile.gettempdir(), "tripease-geocode-cache.sqlite3"),
)

logger = logging.getLogger(__name__)
_request_lock = Lock()
_cache_lock = Lock()
_last_nominatim_request = 0.0
_nominatim_backoff_until = 0.0
_geocode_cache = {}
_transient_failure_until = {}
_GEOCODE_CACHE_SCHEMA_READY = False


class GeocodingTemporarilyUnavailable(RuntimeError):
    """Raised when Nominatim should not be contacted again yet."""

# Aliases help geocoding understand activity names that are descriptions,
# rather than the official name of a mapped place.
ALIASES = {
    "goa": {
        # Activity descriptions need a concrete, named map point. These are
        # itinerary defaults, not a claim that every traveller selected them.
        "beach visit": "Calangute Beach",
        "water sports": "Baga Beach",
        "fort aguada and sinquerim visit": "Fort Aguada",
        "fontainhas heritage walk": "Fontainhas, Panaji",
        "basilica of bom jesus visit": "Basilica of Bom Jesus",
        "spice plantation experience": "Tropical Spice Plantation",
        "dudhsagar falls excursion": "Dudhsagar Falls",
        "anjuna and vagator coastal visit": "Anjuna Beach",
    },
    "manali": {
        "solang valley adventure": "Solang Valley",
        "solang valley excursion": "Solang Valley",
        "rohtang pass tour": "Rohtang Pass",
        "hadimba devi temple visit": "Hidimba Devi Temple",
        "old manali heritage and cafe walk": "Old Manali",
        "vashisht temple and village visit": "Vashisht Temple",
        "jogini waterfall hike": "Jogini Waterfall",
        "sissu valley excursion": "Sissu",
    },
    "jaipur": {
        "amber fort visit": "Amber Fort",
        "city palace tour": "City Palace Jaipur",
        "city palace museum visit": "City Palace Jaipur",
        "hawa mahal visit": "Hawa Mahal",
        "jantar mantar observatory visit": "Jantar Mantar Jaipur",
        "nahargarh fort visit": "Nahargarh Fort",
        "albert hall museum visit": "Albert Hall Museum",
    },
    "rishikesh": {
        "river rafting": "rafting in Rishikesh",
        "ganga aarti": "Triveni Ghat Rishikesh",
        "triveni ghat visit": "Triveni Ghat Rishikesh",
        "beatles ashram visit": "The Beatles Ashram",
        "neer garh waterfall walk": "Neer Garh Waterfall",
        "parmarth niketan visit": "Parmarth Niketan",
        "rajaji national park excursion": "Rajaji National Park",
    },
    "munnar": {
        "tea garden tour": "Munnar tea plantations",
        "eravikulam national park": "Eravikulam National Park",
        "eravikulam national park visit": "Eravikulam National Park",
        "munnar tea museum visit": "Tata Tea Museum Munnar",
        "mattupetty dam and lake visit": "Mattupetty Dam",
        "top station scenic excursion": "Top Station Munnar",
        "kundala lake visit": "Kundala Lake",
        "pothamedu viewpoint walk": "Pothamedu View Point",
    },
    "udaipur": {
        "city palace visit": "City Palace Udaipur",
        "udaipur city palace visit": "City Palace Udaipur",
        "lake pichola boat ride": "Lake Pichola",
        "jagdish temple visit": "Jagdish Temple Udaipur",
        "saheliyon ki bari visit": "Saheliyon Ki Bari",
        "bagore ki haveli museum visit": "Bagore Ki Haveli",
        "sajjangarh monsoon palace excursion": "Monsoon Palace Udaipur",
    },
    "varanasi": {
        "ganga boat ride": "Dashashwamedh Ghat Varanasi",
        "temple tour": "Kashi Vishwanath Temple",
        "kashi vishwanath temple visit": "Kashi Vishwanath Temple",
        "dashashwamedh ghat evening ceremony": "Dashashwamedh Ghat",
        "assi ghat sunrise visit": "Assi Ghat",
        "sarnath archaeological site visit": "Sarnath",
        "bharat kala bhavan museum visit": "Bharat Kala Bhavan",
    },
    "shimla": {
        "mall road walk": "Mall Road Shimla",
        "shimla ridge and mall road walk": "The Ridge Shimla",
        "jakhu temple visit": "Jakhu Temple",
        "viceregal lodge visit": "Viceregal Lodge Shimla",
        "kufri excursion": "Kufri",
        "kufri scenic excursion": "Kufri",
        "annandale heritage area visit": "Annandale Shimla",
        "chadwick falls walk": "Chadwick Falls",
    },
    "andaman islands": {
        "cellular jail history visit": "Cellular Jail Port Blair",
        "radhanagar beach visit": "Radhanagar Beach",
        "elephant beach snorkelling trip": "Elephant Beach Havelock",
        "ross island heritage visit": "Ross Island Andaman",
        "chidiya tapu nature visit": "Chidiya Tapu",
        "baratang limestone cave excursion": "Baratang Limestone Caves",
        "scuba diving": "scuba diving Havelock Island",
        "island beach tour": "beaches near Port Blair",
    },
    "ladakh": {
        "pangong lake tour": "Pangong Tso",
        "mountain trek": "Leh Ladakh trekking",
        "leh palace and old town walk": "Leh Palace",
        "shanti stupa visit": "Shanti Stupa Leh",
        "hall of fame museum visit": "Hall of Fame Leh",
        "thiksey monastery visit": "Thiksey Monastery",
        "hemis monastery visit": "Hemis Monastery",
        "shey palace and monastery visit": "Shey Palace",
        "spituk monastery visit": "Spituk Monastery",
        "stok palace and museum visit": "Stok Palace",
        "leh market and handicraft walk": "Leh Main Market",
        "magnetic hill and indus-zanskar confluence": "Magnetic Hill Ladakh",
        "magnetic hill and confluence excursion": "Magnetic Hill Ladakh",
        "gurudwara pathar sahib visit": "Gurudwara Pathar Sahib",
        "alchi monastery day excursion": "Alchi Monastery",
        "lamayuru monastery and moonland excursion": "Lamayuru Monastery",
        "nubra valley scenic excursion": "Nubra Valley",
        "diskit monastery and maitreya statue visit": "Diskit Monastery",
        "turtuk village cultural excursion": "Turtuk",
        "tso moriri lake excursion": "Tso Moriri",
    },
    "delhi": {
        "park and nature visit": "Lodhi Garden Delhi",
        "red fort visit": "Red Fort Delhi",
        "qutub minar complex visit": "Qutub Minar",
        "humayun's tomb visit": "Humayun's Tomb",
        "national museum visit": "National Museum New Delhi",
        "lodhi garden walk": "Lodhi Garden",
        "akshardham temple visit": "Akshardham Delhi",
    },
    "mumbai": {
        "gateway of india and colaba walk": "Gateway of India",
        "elephanta caves excursion": "Elephanta Caves",
        "chhatrapati shivaji maharaj museum visit": "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
        "marine drive evening walk": "Marine Drive Mumbai",
        "sanjay gandhi national park visit": "Sanjay Gandhi National Park",
        "bandra heritage and seafront walk": "Bandra Bandstand",
    },
    "kolkata": {
        "victoria memorial visit": "Victoria Memorial",
        "indian museum visit": "Indian Museum Kolkata",
        "prinsep ghat riverside walk": "Prinsep Ghat",
        "kumartuli artisan quarter walk": "Kumartuli",
        "dakshineswar kali temple visit": "Dakshineswar Kali Temple",
        "howrah bridge and flower market walk": "Howrah Bridge",
    },
    "agra": {
        "taj mahal visit": "Taj Mahal",
        "agra fort visit": "Agra Fort",
        "itimad-ud-daulah tomb visit": "Tomb of I'timad-ud-Daulah",
        "mehtab bagh sunset visit": "Mehtab Bagh",
        "akbar's tomb at sikandra visit": "Akbar's Tomb Sikandra",
    },
    "amritsar": {
        "golden temple visit": "Golden Temple Amritsar",
        "jallianwala bagh history visit": "Jallianwala Bagh",
        "partition museum visit": "Partition Museum Amritsar",
        "gobindgarh fort visit": "Gobindgarh Fort",
        "wagah border ceremony excursion": "Attari Wagah Border",
        "durgiana temple visit": "Durgiana Temple",
    },
    "coorg": {
        "abbey falls visit": "Abbey Falls Madikeri",
        "raja's seat sunset visit": "Raja's Seat Madikeri",
        "coffee plantation guided visit": "coffee plantation Madikeri",
        "namdroling monastery visit": "Namdroling Monastery",
        "talakaveri scenic excursion": "Talakaveri",
        "mandalpatti viewpoint excursion": "Mandalpatti View Point",
    },
    "ooty": {
        "government botanical gardens visit": "Government Botanical Garden Ooty",
        "doddabetta peak visit": "Doddabetta Peak",
        "ooty lake visit": "Ooty Lake",
        "nilgiri mountain railway ride": "Nilgiri Mountain Railway Ooty",
        "government rose garden visit": "Government Rose Garden Ooty",
        "pykara falls and lake excursion": "Pykara Falls",
    },
    "alappuzha": {
        "alappuzha backwater boat excursion": "Alappuzha backwaters",
        "alappuzha beach visit": "Alappuzha Beach",
        "krishnapuram palace visit": "Krishnapuram Palace",
        "marari beach visit": "Marari Beach",
        "pathiramanal island boat excursion": "Pathiramanal Island",
        "coir heritage experience": "International Coir Museum Alappuzha",
    },
    "pushkar": {
        "brahma temple visit": "Brahma Temple Pushkar",
        "pushkar lake and ghats walk": "Pushkar Lake",
        "savitri temple hill visit": "Savitri Mata Temple Pushkar",
        "pushkar bazaar and craft walk": "Pushkar Main Market",
        "pushkar camel fairground area visit": "Pushkar Mela Ground",
        "ajmer heritage excursion": "Ajmer Sharif Dargah",
    },
    "darjeeling": {
        "tiger hill sunrise excursion": "Tiger Hill Darjeeling",
        "batasia loop visit": "Batasia Loop",
        "himalayan mountaineering institute visit": "Himalayan Mountaineering Institute",
        "padmaja naidu himalayan zoological park visit": "Padmaja Naidu Himalayan Zoological Park",
        "tea garden visit": "Happy Valley Tea Estate",
        "peace pagoda visit": "Japanese Peace Pagoda Darjeeling",
        "darjeeling himalayan railway ride": "Darjeeling Himalayan Railway",
    },
}

DESTINATION_SEARCH_NAMES = {
    "andaman islands": "Port Blair, Andaman and Nicobar Islands",
    # Goa is a state-sized destination; do not constrain every search to Panaji.
    "goa": "Goa, India",
    "manali": "Manali, Himachal Pradesh",
    "jaipur": "Jaipur, Rajasthan",
    "rishikesh": "Rishikesh, Uttarakhand",
    "munnar": "Munnar, Kerala",
    "udaipur": "Udaipur, Rajasthan",
    "varanasi": "Varanasi, Uttar Pradesh",
    "shimla": "Shimla, Himachal Pradesh",
    "ladakh": "Leh, Ladakh",
    "delhi": "New Delhi, Delhi",
    "mumbai": "Mumbai, Maharashtra",
    "kolkata": "Kolkata, West Bengal",
    "agra": "Agra, Uttar Pradesh",
    "amritsar": "Amritsar, Punjab",
    "coorg": "Madikeri, Karnataka",
    "ooty": "Ooty, Tamil Nadu",
    "alappuzha": "Alappuzha, Kerala",
    "pushkar": "Pushkar, Rajasthan",
    "darjeeling": "Darjeeling, West Bengal",
}


def _clean_name(value):
    value = str(value or "").lower().replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def _get_json(url, timeout=REQUEST_TIMEOUT):
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "application/json",
        },
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def _retry_after_seconds(error):
    """Read Retry-After as seconds or an HTTP date; fall back conservatively."""
    value = (getattr(error, "headers", None) or {}).get("Retry-After")
    if value:
        try:
            return max(1.0, float(value.strip()))
        except (TypeError, ValueError):
            try:
                retry_at = parsedate_to_datetime(value)
                if retry_at.tzinfo is None:
                    retry_at = retry_at.replace(tzinfo=timezone.utc)
                return max(1.0, (retry_at - datetime.now(timezone.utc)).total_seconds())
            except (TypeError, ValueError, OverflowError):
                pass
    return float(NOMINATIM_BACKOFF_SECONDS)


def _nominatim_search(query):
    """Search Nominatim with process-wide request spacing and backoff.

    The lock covers both spacing and the network call so concurrent requests in
    this process cannot start together. A 429 opens a cooldown instead of being
    retried repeatedly. Transient network failures also pause additional calls.
    """
    global _last_nominatim_request, _nominatim_backoff_until

    params = urllib.parse.urlencode({
        "q": query,
        "format": "jsonv2",
        "limit": 8,
        "addressdetails": 1,
        "countrycodes": "in",
    })
    url = f"{NOMINATIM_URL}?{params}"

    with _request_lock:
        now = time.monotonic()
        if now < _nominatim_backoff_until:
            remaining = max(1, int(_nominatim_backoff_until - now))
            raise GeocodingTemporarilyUnavailable(
                f"Nominatim cooldown active ({remaining}s remaining)"
            )

        wait = NOMINATIM_DELAY_SECONDS - (now - _last_nominatim_request)
        if wait > 0:
            time.sleep(wait)
        _last_nominatim_request = time.monotonic()

        try:
            return _get_json(url, timeout=REQUEST_TIMEOUT)
        except urllib.error.HTTPError as exc:
            if exc.code == 429:
                cooldown = _retry_after_seconds(exc)
                _nominatim_backoff_until = time.monotonic() + cooldown
                logger.warning(
                    "Nominatim returned HTTP 429; pausing geocoding for %.0f seconds.",
                    cooldown,
                )
                raise GeocodingTemporarilyUnavailable(
                    f"Nominatim rate-limited this application for about {int(cooldown)}s"
                ) from exc
            if exc.code in (500, 502, 503, 504):
                _nominatim_backoff_until = time.monotonic() + NETWORK_ERROR_COOLDOWN_SECONDS
                raise GeocodingTemporarilyUnavailable(
                    f"Nominatim returned HTTP {exc.code}; temporary cooldown enabled"
                ) from exc
            raise
        except (urllib.error.URLError, TimeoutError, OSError) as exc:
            _nominatim_backoff_until = time.monotonic() + NETWORK_ERROR_COOLDOWN_SECONDS
            logger.warning(
                "Nominatim network request failed; pausing geocoding for %s seconds: %s",
                NETWORK_ERROR_COOLDOWN_SECONDS,
                exc,
            )
            raise GeocodingTemporarilyUnavailable(
                "Nominatim is temporarily unreachable"
            ) from exc


def _ensure_persistent_cache_schema(connection):
    connection.execute(
        """CREATE TABLE IF NOT EXISTS geocode_cache (
               cache_key TEXT PRIMARY KEY,
               payload TEXT NOT NULL,
               created_at REAL NOT NULL
           )"""
    )


def _persistent_cache_key(cache_key):
    return json.dumps(list(cache_key), ensure_ascii=True, separators=(",", ":"))


def _persistent_cache_get(cache_key):
    """Read a successful cached place; failures never poison this cache."""
    global _GEOCODE_CACHE_SCHEMA_READY
    try:
        with _cache_lock:
            cache_dir = os.path.dirname(os.path.abspath(GEOCODE_CACHE_DB_PATH))
            os.makedirs(cache_dir, exist_ok=True)
            with sqlite3.connect(GEOCODE_CACHE_DB_PATH, timeout=2) as connection:
                _ensure_persistent_cache_schema(connection)
                row = connection.execute(
                    "SELECT payload, created_at FROM geocode_cache WHERE cache_key = ?",
                    (_persistent_cache_key(cache_key),),
                ).fetchone()
                _GEOCODE_CACHE_SCHEMA_READY = True
                if not row:
                    return None
                payload, created_at = row
                if time.time() - float(created_at) > GEOCODE_CACHE_TTL_SECONDS:
                    connection.execute(
                        "DELETE FROM geocode_cache WHERE cache_key = ?",
                        (_persistent_cache_key(cache_key),),
                    )
                    return None
                value = json.loads(payload)
                return value if isinstance(value, dict) else None
    except (OSError, sqlite3.Error, ValueError, TypeError) as exc:
        logger.debug("Persistent geocoding cache unavailable: %s", exc)
        return None


def _persistent_cache_put(cache_key, place):
    """Persist only successful matches, for reuse across API calls/restarts."""
    try:
        with _cache_lock:
            cache_dir = os.path.dirname(os.path.abspath(GEOCODE_CACHE_DB_PATH))
            os.makedirs(cache_dir, exist_ok=True)
            with sqlite3.connect(GEOCODE_CACHE_DB_PATH, timeout=2) as connection:
                _ensure_persistent_cache_schema(connection)
                connection.execute(
                    "INSERT OR REPLACE INTO geocode_cache (cache_key, payload, created_at) VALUES (?, ?, ?)",
                    (
                        _persistent_cache_key(cache_key),
                        json.dumps(place, ensure_ascii=True),
                        time.time(),
                    ),
                )
    except (OSError, sqlite3.Error, ValueError, TypeError) as exc:
        # Caching is an optimization; it must never fail itinerary generation.
        logger.debug("Could not persist geocoding result: %s", exc)


def _candidate_score(item, search_name, destination_name):
    wanted = _clean_name(search_name)
    official = _clean_name(item.get("name"))
    display = _clean_name(item.get("display_name"))

    if not wanted or not official:
        return 0.0

    # Exact official-name match is strongest.
    if official == wanted:
        score = 1.0
    elif wanted in display:
        score = 0.94
    elif official in wanted and len(official) >= 5:
        score = 0.90
    else:
        score = SequenceMatcher(None, wanted, official).ratio()

    # Location context is only a small tie-breaker.
    if _clean_name(destination_name) in display:
        score += 0.02

    return min(score, 1.0)

def _find_places(destination_name, activities):
    """Return only confidently matched places; uncertain results stay unmatched."""
    found = {}
    destination_key = _clean_name(destination_name)
    aliases = ALIASES.get(destination_key, {})
    search_area = DESTINATION_SEARCH_NAMES.get(
        destination_key,
        f"{destination_name}, India",
    )

    for activity in activities:
        name = str(activity.get("activity_name") or "").strip()
        if not name or name.lower().startswith("flexible / rest day"):
            continue

        key = _clean_name(name)
        cache_key = (destination_key, key)

        now = time.monotonic()
        if _transient_failure_until.get(cache_key, 0.0) > now:
            continue
        _transient_failure_until.pop(cache_key, None)

        if cache_key in _geocode_cache:
            cached = _geocode_cache[cache_key]
            if cached:
                found.setdefault(key, []).append(dict(cached))
            continue

        cached = _persistent_cache_get(cache_key)
        if cached:
            _geocode_cache[cache_key] = dict(cached)
            found.setdefault(key, []).append(dict(cached))
            continue

        search_name = aliases.get(key)
        if not search_name:
            search_name = re.sub(
                r"\s+(visit|experience|walk|tour|excursion|trip|ride|hike)$",
                "",
                name,
                flags=re.IGNORECASE,
            ).strip()

        if not search_name:
            _geocode_cache[cache_key] = None
            continue

        queries = [
            f"{search_name}, {search_area}",
            f"{search_name}, {destination_name}, India",
        ]

        results = []
        try:
            for query in dict.fromkeys(queries):
                results = _nominatim_search(query)
                if results:
                    break
        except GeocodingTemporarilyUnavailable as exc:
            # Do not cache a transient failure as a permanent no-match. Skip the
            # remaining duplicate activity lookups during the active cooldown.
            retry_at = max(
                time.monotonic() + NETWORK_ERROR_COOLDOWN_SECONDS,
                _nominatim_backoff_until,
            )
            _transient_failure_until[cache_key] = retry_at
            logger.debug("Skipping temporary geocoding failure for %r: %s", name, exc)
            continue
        except Exception as exc:
            logger.warning(
                "Geocoding failed for %r in %s: %s",
                name,
                destination_name,
                exc,
            )
            # Keep a short cooldown for this activity, but let it retry later.
            _transient_failure_until[cache_key] = time.monotonic() + NETWORK_ERROR_COOLDOWN_SECONDS
            continue

        if not results:
            logger.info(
                "No geocoding results for %r; tried queries: %s",
                name,
                queries,
            )
            _geocode_cache[cache_key] = None
            continue

        ranked = sorted(
            results,
            key=lambda item: _candidate_score(item, search_name, destination_name),
            reverse=True,
        )
        best = ranked[0]
        best_score = _candidate_score(best, search_name, destination_name)
        second_score = (
            _candidate_score(ranked[1], search_name, destination_name)
            if len(ranked) > 1 else 0
        )

        # Conservative matching: don't attach a vaguely similar place.
        if best_score < 0.72 or (
                      best_score < 0.90
                      and len(ranked) > 1
                      and best_score - second_score < 0.04
                      ):
            logger.info(
                "No confident map match for %r in %s (best score %.2f)",
                name, destination_name, best_score,
            )
            _geocode_cache[cache_key] = None
            continue

        try:
            lat = float(best["lat"])
            lon = float(best["lon"])
            if not (-90 <= lat <= 90 and -180 <= lon <= 180):
                raise ValueError("Coordinates out of range")
        except (KeyError, TypeError, ValueError):
            _geocode_cache[cache_key] = None
            continue

        address_data = best.get("address") or {}
        address = best.get("display_name")
        place = {
            "name": best.get("name") or search_name,
            "latitude": lat,
            "longitude": lon,
            "address": address,
            "opening_hours": None,
            "osm_type": best.get("osm_type"),
            "osm_id": best.get("osm_id"),
            "match_confidence": round(best_score, 3),
            "map_url": (
                f"https://www.openstreetmap.org/{best['osm_type']}/{best['osm_id']}"
                if best.get("osm_type") and best.get("osm_id") else None
            ),
        }
        _geocode_cache[cache_key] = dict(place)
        _persistent_cache_put(cache_key, place)
        found.setdefault(key, []).append(place)

    return found


def _route_day(places):
    """Route consecutive mapped stops using OSRM; never fabricate route distances."""
    if len(places) < 2:
        return {
            "status": "single_stop" if places else "no_mapped_stops",
            "distance_km": 0.0 if places else None,
            "duration_minutes": 0 if places else None,
            "geometry": None,
            "notice": "At least two mapped stops are required to calculate a route.",
        }

    coordinates = ";".join(
        f"{place['longitude']},{place['latitude']}" for place in places
    )
    url = f"{OSRM_URL}/{coordinates}?" + urllib.parse.urlencode({
        "overview": "simplified",
        "geometries": "geojson",
        "steps": "false",
    })

    try:
        data = _get_json(url)
        routes = data.get("routes") or []
        if data.get("code") != "Ok" or not routes:
            raise RuntimeError(f"OSRM returned code {data.get('code', 'unknown')}")

        route = routes[0]
        return {
            "status": "routed",
            "distance_km": round(float(route["distance"]) / 1000, 2),
            "duration_minutes": round(float(route["duration"]) / 60),
            "geometry": route.get("geometry"),
            "notice": "OSRM public routing estimate; no live traffic data.",
        }
    except Exception as exc:
        logger.warning("OSRM route request failed: %s", exc)
        return {
            "status": "routing_unavailable",
            "distance_km": None,
            "duration_minutes": None,
            "geometry": None,
            "notice": (
                "The route service did not return a route. "
                "Distance and duration are unavailable, not zero."
            ),
            "error": str(exc)[:250],
        }


def enrich_itinerary_with_maps(daily_plans, destination_name, travel_date=None):
    """Enrich a generated itinerary with mapped places and best-effort daily routes."""
    all_activities = [
        activity
        for day in daily_plans
        for activity in (day.get("activities") or [])
    ]
    places_by_activity = _find_places(destination_name, all_activities)

    total_requested = 0
    total_matched = 0
    routes_calculated = 0
    days_with_single_stop = 0
    days_without_mapped_stops = 0
    day_summaries = []

    for day in daily_plans:
        day_places = []
        for activity in day.get("activities") or []:
            name = str(activity.get("activity_name") or "")
            if name.lower().startswith("flexible / rest day"):
                activity["map_match"] = {
                    "status": "not_applicable",
                    "reason": "Flexible/rest day has no specific attraction.",
                }
                continue

            total_requested += 1
            matches = places_by_activity.get(_clean_name(name), [])
            if matches:
                place = matches[0]
                total_matched += 1
                activity["map_match"] = {
                    "status": "matched",
                    "place": place,
                }
                day_places.append(place)
            else:
                activity["map_match"] = {
                    "status": "not_found",
                    "place": None,
                    "notice": "No confident OpenStreetMap match was found.",
                }

        # Deduplicate consecutive stops with identical coordinates.
        unique_places = []
        seen = set()
        for place in day_places:
            coord = (round(place["latitude"], 6), round(place["longitude"], 6))
            if coord not in seen:
                seen.add(coord)
                unique_places.append(place)

        route = _route_day(unique_places)
        if route["status"] == "routed":
            routes_calculated += 1
        elif route["status"] == "single_stop":
            days_with_single_stop += 1
        elif route["status"] == "no_mapped_stops":
            days_without_mapped_stops += 1

        day["mapped_places"] = unique_places
        day["map_route"] = route
        day_summaries.append({
            "day": day.get("day"),
            "mapped_stops": len(unique_places),
            "route_status": route["status"],
            "distance_km": route["distance_km"],
            "duration_minutes": route["duration_minutes"],
        })

    if total_matched == total_requested and routes_calculated == len(daily_plans):
        status = "complete"
    elif total_matched > 0 or routes_calculated > 0:
        status = "partial"
    else:
        status = "unavailable"

    return {
        "provider": "OpenStreetMap Nominatim + OSRM",
        "status": status,
        "travel_date": str(travel_date) if travel_date else None,
        "places_requested": total_requested,
        "places_matched": total_matched,
        "places_unmatched": total_requested - total_matched,
        "routes_calculated": routes_calculated,
        "days_with_single_stop": days_with_single_stop,
        "days_without_mapped_stops": days_without_mapped_stops,
        "daily_routes": day_summaries,
        "notice": (
            "Map data can be incomplete. Opening hours are not verified. "
            "Routes are best-effort estimates from public OSRM routing and "
            "do not include live traffic. Unmatched places and route failures "
            "do not prevent itinerary generation."
        ),
    }
