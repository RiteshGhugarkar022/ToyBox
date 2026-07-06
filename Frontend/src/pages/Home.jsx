import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Discover the Magic of Play</h1>
          <p>Explore our curated collection of premium toys, handpicked by AI to bring joy and learning to every child.</p>
          <Link to="/products" className="btn-primary">Shop Now</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
