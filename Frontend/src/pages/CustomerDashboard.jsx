import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Clock } from 'lucide-react';

const CustomerDashboard = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'CUSTOMER') {
      navigate('/admin-dashboard');
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/api/auth/user/${parsedUser.loginId}`);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user details", err);
        setUser(parsedUser); // fallback
      }
    };
    fetchProfile();
    
    // Fetch live customer tracking
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/api/orders/customer/${parsedUser.loginId}`);
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch customer orders.", err);
      }
    };
    fetchOrders();
  }, [navigate]);

  const handleRating = async (orderId, ratingValue) => {
    try {
      await axios.put(`http://localhost:8081/api/orders/customer/${orderId}/rating`, { rating: ratingValue });
      setOrders(orders.map(o => (o.oId || o.oid) === orderId ? { ...o, rating: ratingValue } : o));
    } catch (err) {
      console.error("Failed to submit rating", err);
      alert("Failed to submit rating");
    }
  };

  const StarRating = ({ orderId, currentRating, status }) => {
    // Only allow rating if completed
    const canRate = !currentRating && status === 'Completed';
    return (
      <div style={{display: 'flex', gap: '2px'}}>
        {[1, 2, 3, 4, 5].map(star => (
          <span 
            key={star} 
            onClick={() => canRate && handleRating(orderId, star)}
            style={{
              cursor: canRate ? 'pointer' : 'default',
              color: star <= (currentRating || 0) ? '#f1c40f' : '#e0e0e0',
              fontSize: '1.2rem',
              transition: 'color 0.2s'
            }}
            title={canRate ? "Click to rate" : currentRating ? "Rated" : "Complete order to rate"}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (!user) return <div style={{textAlign:'center', padding:'3rem'}}>Loading...</div>;

  return (
    <div style={{padding: '2rem 5%', maxWidth: '1200px', margin: '0 auto'}}>
      <h2 style={{fontSize: '2.5rem', marginBottom: '1.5rem', color: '#6C5CE7'}}>Welcome, {user.name || user.loginId}!</h2>
      <div style={{background:'white', padding:'2rem', borderRadius:'20px', boxShadow:'0 10px 30px rgba(0,0,0,0.1)'}}>
        <h3 style={{marginBottom: '1rem', borderBottom:'1px solid #ddd', paddingBottom:'0.5rem'}}>Your Profile</h3>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', color: '#333'}}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Address:</strong> {user.address}</p>
        </div>
        
        <h3 style={{marginTop:'2rem', marginBottom:'1rem', borderBottom:'1px solid #ddd', paddingBottom:'0.5rem'}}>Order History</h3>
        
        {orders.length === 0 ? (
           <p style={{color:'#888'}}>You have no recent orders.</p>
        ) : (
           <div style={{overflowX: 'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse', minWidth: '800px'}}>
              <thead>
                <tr style={{background:'#f8f9fa', textAlign:'left'}}>
                  <th style={{padding:'1rem', borderBottom:'2px solid #dee2e6'}}>Order ID</th>
                  <th style={{padding:'1rem', borderBottom:'2px solid #dee2e6', width: '250px'}}>Items</th>
                  <th style={{padding:'1rem', borderBottom:'2px solid #dee2e6'}}>Delivery Address</th>
                  <th style={{padding:'1rem', borderBottom:'2px solid #dee2e6'}}>Date</th>
                  <th style={{padding:'1rem', borderBottom:'2px solid #dee2e6'}}>Amount</th>
                  <th style={{padding:'1rem', borderBottom:'2px solid #dee2e6'}}>Status</th>
                  <th style={{padding:'1rem', borderBottom:'2px solid #dee2e6'}}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.oId || order.oid} style={{borderBottom:'1px solid #eee', verticalAlign: 'top'}}>
                    <td style={{padding:'1rem'}}>#{order.oId || order.oid}</td>
                    <td style={{padding:'1rem'}}>
                       {order.items && order.items.length > 0 ? (
                         <div style={{display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
                           {order.items.map((item, idx) => (
                             <div key={idx} style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                               <img src={item.toyImage} alt={item.toyName} style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '5px'}}/>
                               <div style={{fontSize: '0.85rem'}}>
                                 <div style={{fontWeight: 'bold', color: '#2d3436'}}>{item.toyName}</div>
                                 <div style={{color: '#636e72', fontSize: '0.75rem'}}>ID: {item.toyId}</div>
                                 <div style={{color: '#636e72'}}>Qty: {item.quantity}</div>
                               </div>
                             </div>
                           ))}
                         </div>
                       ) : (
                         <span style={{color: '#999', fontSize: '0.9rem'}}>No details available</span>
                       )}
                    </td>
                    <td style={{padding:'1rem', fontSize: '0.9rem', color: '#555'}}>{order.customer?.address || user.address}</td>
                    <td style={{padding:'1rem', fontSize: '0.9rem'}}>{new Date(order.date).toLocaleDateString()}</td>
                    <td style={{padding:'1rem', fontWeight:'bold', color:'#333'}}>Rs. {order.amount.toFixed(2)}</td>
                    <td style={{padding:'1rem'}}>
                      <div style={{display:'flex', alignItems:'center', gap:'0.4rem', fontWeight:'bold', fontSize:'0.9rem', color: order.status === 'Pending' ? '#e17055' : order.status === 'Accepted' ? '#0984e3' : order.status === 'Completed' ? '#00b894' : '#d63031'}}>
                         {order.status === 'Pending' ? <Clock size={16} /> : order.status === 'Completed' ? <CheckCircle size={16} /> : ''}
                         {order.status}
                      </div>
                    </td>
                    <td style={{padding:'1rem'}}>
                       <StarRating orderId={order.oId || order.oid} currentRating={order.rating} status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <button onClick={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }} className="btn-primary" style={{marginTop:'2rem', background:'#ff7675'}}>Logout</button>
    </div>
  );
};

export default CustomerDashboard;

