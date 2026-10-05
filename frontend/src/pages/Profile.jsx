function Profile() {
  return (
    <section className="page-section">
      <div className="container">
        <div className="page-header">
          <span>ACCOUNT</span>
          <h1>My Profile</h1>
          <p>Manage your TripEase profile and preferences.</p>
        </div>

        <div className="profile-card">
          <div className="avatar">V</div>

          <div>
            <h2>Travel Explorer</h2>
            <p>traveller@tripease.com</p>
          </div>

          <button className="btn btn-secondary">Edit Profile</button>
        </div>

        <div className="detail-grid">
          <div className="detail-box">
            <span>🧳</span>
            <h3>Trips</h3>
            <p>0 planned</p>
          </div>

          <div className="detail-box">
            <span>❤️</span>
            <h3>Wishlist</h3>
            <p>0 saved</p>
          </div>

          <div className="detail-box">
            <span>🌎</span>
            <h3>Destinations</h3>
            <p>0 visited</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;