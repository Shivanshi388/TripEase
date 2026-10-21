import { useEffect, useState } from "react";
import authService from "../services/authService";
import "./Login.css";

function VerifyEmail() {
  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
    const token = params.get("token");
    if (!token) {
      setError(true);
      setMessage("This verification link is missing its token. Request a new verification email.");
      return;
    }
    let active = true;
    authService.verifyEmail(token)
      .then(result => {
        if (active) setMessage(result?.message || "Email verified successfully. You can now log in.");
      })
      .catch(err => {
        if (active) {
          setError(true);
          setMessage(err?.message || "This verification link is invalid or expired. Request a new one.");
        }
      });
    return () => { active = false; };
  }, []);

  return (
    <main className="trip-login">
      <section className="trip-login-panel" style={{ flex: 1 }}>
        <div className="trip-login-card">
          <div className="trip-login-icon">✉</div>
          <h2>Email verification</h2>
          <p role={error ? "alert" : "status"}>{message}</p>
          {error && <p><a href="#login">Go to login to resend verification</a></p>}
          {!error && message !== "Verifying your email..." && <p><a href="#login">Continue to login</a></p>}
        </div>
      </section>
    </main>
  );
}

export default VerifyEmail;