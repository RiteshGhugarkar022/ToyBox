import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import axios from 'axios';

const Cart = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate('/login');
    }
  }, [navigate]);

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    navigate('/payment', { state: { total } });
  };

  if (cartItems.length === 0) {
    return (
      <div style={{textAlign: 'center', padding: '5rem'}}>
        <h2>Your Cart is Empty</h2>
        <Link to="/products" className="btn-primary" style={{marginTop:'1rem'}}>Shop Now</Link>
      </div>
    );
  }

  return (
    <div style={{padding: '2rem 5%', maxWidth: '1000px', margin: '0 auto'}}>
      <h2 style={{fontSize: '2.5rem', marginBottom: '1.5rem'}}>Shopping Cart</h2>
      
      <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
        {cartItems.map(item => (
          <div key={item.tId} style={{display:'flex', alignItems:'center', background:'white', padding:'1rem', borderRadius:'10px', boxShadow:'0 5px 15px rgba(0,0,0,0.05)'}}>
            <img src={item.toyImage || item.image} alt={item.name} style={{width:'100px', height:'100px', objectFit:'cover', borderRadius:'10px', marginRight:'1.5rem'}} />
            <div style={{flex: 1}}>
              <h3 style={{fontSize:'1.2rem', marginBottom:'0.5rem'}}>{item.name}</h3>
              <p style={{color:'#6C5CE7', fontWeight:'bold'}}>Rs. {item.price}</p>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
              <span>Qty: {item.quantity}</span>
              <button style={{background:'none', border:'none', color:'red', cursor:'pointer'}} onClick={() => {
                const updated = cartItems.filter(i => (i.tId || i.tid) !== (item.tId || item.tid));
                setCartItems(updated);
                localStorage.setItem('cart', JSON.stringify(updated));
              }}>
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
        
        <div style={{background:'white', padding:'2rem', borderRadius:'10px', boxShadow:'0 5px 15px rgba(0,0,0,0.05)', marginTop:'2rem', textAlign:'right'}}>
          <h3 style={{fontSize:'1.5rem', marginBottom:'1rem'}}>Total: <span style={{color:'#6C5CE7'}}>Rs. {total.toFixed(2)}</span></h3>
          <button className="btn-primary" onClick={handleCheckout}>Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
