function Wishlist() {
  return (
    <section className="page-section">
      <div className="container">
        <div className="page-header">
          <span>YOUR SAVED PLACES</span>
          <h1>Wishlist</h1>
          <p>Keep track of the destinations you want to visit.</p>
        </div>

        <div className="empty-state">
          <div>❤️</div>
          <h2>Your wishlist is empty</h2>
          <p>
            Save destinations you love and they'll appear here.
          </p>

          <a href="#explore" className="btn btn-primary">
            Explore Destinations
          </a>
        </div>
      </div>
    </section>
  );
}

export default Wishlist;