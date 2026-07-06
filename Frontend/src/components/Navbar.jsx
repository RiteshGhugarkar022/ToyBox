import { Link } from 'react-router-dom';
import { ShoppingCart, PackageOpen, User } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Basic polling or just check once for simplicity
    const interval = setInterval(() => {
      const u = localStorage.getItem('user');
      setUser(u ? JSON.parse(u) : null);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <PackageOpen size={32} />
        ToyBox AI
      </Link>
      <div className="nav-links">
        <Link to="/products" className="nav-link">Toys</Link>
        <Link to={user ? "/cart" : "/login"} className="nav-link" style={{display:'flex', alignItems:'center', gap:'5px'}}>
          <ShoppingCart size={20} /> Cart
        </Link>
        {user ? (
          <Link to={user.role === 'ADMIN' ? '/admin-dashboard' : '/customer-dashboard'} className="nav-link" style={{display:'flex', alignItems:'center', gap:'5px', color:'#00CEC9', fontWeight:'bold'}}>
            <User size={20} /> {user.loginId}
          </Link>
        ) : (
          <Link to="/login" className="nav-link" style={{display:'flex', alignItems:'center', gap:'5px'}}>
            <User size={20} /> Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
