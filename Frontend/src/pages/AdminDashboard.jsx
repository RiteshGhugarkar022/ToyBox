import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Edit2, Trash2, CheckCircle, XCircle, Search } from 'lucide-react';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('toys'); // 'toys' or 'orders'
  const [toys, setToys] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingToy, setEditingToy] = useState(null);

  // Form states for Toy
  const [toyForm, setToyForm] = useState({ name: '', price: '', description: '', ratings: '', stock: '', category: '', toyImage: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'ADMIN') {
      navigate('/customer-dashboard');
      return;
    }
    setUser(parsedUser);
    fetchToys();
    fetchOrders();
  }, [navigate]);

  const fetchToys = async () => {
    try {
      const res = await axios.get('http://localhost:8081/api/toys');
      setToys(res.data);
    } catch (err) { console.error("Failed to fetch toys", err); }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:8081/api/orders/admin');
      setOrders(res.data);
    } catch (err) { console.error("Failed to fetch orders", err); }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setToyForm({ ...toyForm, toyImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToySubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...toyForm,
        price: parseFloat(toyForm.price) || 0,
        stock: parseInt(toyForm.stock, 10) || 0,
        ratings: parseFloat(toyForm.ratings) || 0
      };
      
      if (editingToy) {
        await axios.put(`http://localhost:8081/api/toys/admin/${editingToy.tid || editingToy.tId}`, payload);
      } else {
        await axios.post('http://localhost:8081/api/toys/admin', payload);
      }
      setEditingToy(null);
      setToyForm({ name: '', price: '', description: '', ratings: '', stock: '', category: '', toyImage: '' });
      fetchToys();
    } catch (err) { alert("Failed to save toy: " + err.message); }
  };

  const handleEditToy = (toy) => {
    setEditingToy(toy);
    setToyForm({
      name: toy.name, price: toy.price, description: toy.description, 
      ratings: toy.ratings, stock: toy.stock, category: toy.category, 
      toyImage: toy.toyImage || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteToy = async (id) => {
    if (window.confirm('Are you sure you want to delete this toy?')) {
      try {
        await axios.delete(`http://localhost:8081/api/toys/admin/${id}`);
        fetchToys();
      } catch (err) { alert("Failed to delete toy: " + err.message); }
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      if(!id) {
        alert("Invalid Order ID!");
        return;
      }
      await axios.put(`http://localhost:8081/api/orders/admin/${id}/status`, { status });
      fetchOrders();
    } catch (err) { alert("Failed to update status: " + err.message); }
  };

  if (!user) return <div style={{textAlign:'center', padding:'3rem'}}>Loading...</div>;

  return (
    <div style={{padding: '2rem 5%', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '2rem'}}>
        <h2 style={{fontSize: '2.5rem', color: '#e84393'}}>Admin Dashboard</h2>
        <button onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }} className="btn-primary" style={{background:'red'}}>Logout</button>
      </div>
      
      <div style={{display:'flex', gap:'1rem', marginBottom:'2rem'}}>
        <button className="btn-primary" style={{background: activeTab === 'toys' ? '#6C5CE7' : '#ccc', color: activeTab === 'toys' ? 'white' : '#333'}} onClick={() => setActiveTab('toys')}>Manage Toys</button>
        <button className="btn-primary" style={{background: activeTab === 'orders' ? '#00b894' : '#ccc', color: activeTab === 'orders' ? 'white' : '#333'}} onClick={() => setActiveTab('orders')}>Manage Orders</button>
      </div>

      {activeTab === 'toys' && (
        <div>
          <div style={{background:'white', padding:'2rem', borderRadius:'20px', boxShadow:'0 10px 30px rgba(0,0,0,0.1)', marginBottom:'2rem'}}>
            <h3 style={{color:'#6C5CE7', marginBottom:'1rem'}}>{editingToy ? 'Edit Toy' : 'Add New Toy'}</h3>
            <form onSubmit={handleToySubmit} style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
              <input placeholder="Name" value={toyForm.name} onChange={e=>setToyForm({...toyForm, name: e.target.value})} required style={{padding:'0.8rem', borderRadius:'5px', border:'1px solid #ccc'}} />
              <input placeholder="Price" type="number" step="0.01" value={toyForm.price} onChange={e=>setToyForm({...toyForm, price: e.target.value})} required style={{padding:'0.8rem', borderRadius:'5px', border:'1px solid #ccc'}} />
              <input placeholder="Category" value={toyForm.category} onChange={e=>setToyForm({...toyForm, category: e.target.value})} required style={{padding:'0.8rem', borderRadius:'5px', border:'1px solid #ccc'}} />
              <input placeholder="Stock" type="number" value={toyForm.stock} onChange={e=>setToyForm({...toyForm, stock: e.target.value})} required style={{padding:'0.8rem', borderRadius:'5px', border:'1px solid #ccc'}} />
              <input placeholder="Ratings (0-5)" type="number" step="0.1" value={toyForm.ratings} onChange={e=>setToyForm({...toyForm, ratings: e.target.value})} style={{padding:'0.8rem', borderRadius:'5px', border:'1px solid #ccc'}} />
              
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <label style={{fontSize: '0.9rem', marginBottom: '0.2rem', color: '#555'}}>Upload Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{padding:'0.5rem', borderRadius:'5px', border:'1px solid #ccc'}} />
              </div>
              
              <textarea placeholder="Description" value={toyForm.description} onChange={e=>setToyForm({...toyForm, description: e.target.value})} required style={{padding:'0.8rem', borderRadius:'5px', border:'1px solid #ccc', gridColumn:'span 2', minHeight:'100px'}} />
              
              {toyForm.toyImage && (
                 <div style={{gridColumn:'span 2', textAlign:'center'}}>
                   <p style={{fontSize:'0.9rem', color:'#888', marginBottom:'0.5rem'}}>Image Preview</p>
                   <img src={toyForm.toyImage} alt="Preview" style={{maxHeight:'150px', borderRadius:'10px'}} />
                 </div>
              )}

              <div style={{gridColumn:'span 2', display:'flex', gap:'1rem'}}>
                <button type="submit" className="btn-primary" style={{background:'#6C5CE7'}}>{editingToy ? 'Update Toy' : 'Create Toy'}</button>
                {editingToy && <button type="button" onClick={() => {setEditingToy(null); setToyForm({name:'', price:'', description:'', ratings:'', stock:'', category:'', toyImage:''})}} className="btn-primary" style={{background:'#e0e0e0', color:'#333'}}>Cancel Editing</button>}
              </div>
            </form>
          </div>

          <div style={{background:'white', padding:'2rem', borderRadius:'20px', boxShadow:'0 10px 30px rgba(0,0,0,0.1)'}}>
            <h3 style={{marginBottom:'1rem'}}>Inventory ({toys.length})</h3>
            <div style={{overflowX: 'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{background:'#f8f9fa', textAlign:'left'}}>
                    <th style={{padding:'1rem', borderBottom:'2px solid #dee2e6'}}>ID</th>
                    <th style={{padding:'1rem', borderBottom:'2px solid #dee2e6'}}>Image</th>
                    <th style={{padding:'1rem', borderBottom:'2px solid #dee2e6'}}>Name</th>
                    <th style={{padding:'1rem', borderBottom:'2px solid #dee2e6'}}>Price</th>
                    <th style={{padding:'1rem', borderBottom:'2px solid #dee2e6'}}>Stock</th>
                    <th style={{padding:'1rem', borderBottom:'2px solid #dee2e6'}}>Category</th>
                    <th style={{padding:'1rem', borderBottom:'2px solid #dee2e6'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {toys.map(toy => {
                    const toyId = toy.tid || toy.tId;
                    return (
                    <tr key={toyId} style={{borderBottom:'1px solid #eee'}}>
                      <td style={{padding:'1rem'}}>{toyId}</td>
                      <td style={{padding:'1rem'}}>
                        {toy.toyImage && <img src={toy.toyImage} alt={toy.name} style={{width:'40px', height:'40px', objectFit:'cover', borderRadius:'5px'}} />}
                      </td>
                      <td style={{padding:'1rem'}}>{toy.name}</td>
                      <td style={{padding:'1rem'}}>Rs. {toy.price}</td>
                      <td style={{padding:'1rem'}}>{toy.stock}</td>
                      <td style={{padding:'1rem'}}>{toy.category}</td>
                      <td style={{padding:'1rem', display:'flex', gap:'0.8rem'}}>
                        <button onClick={() => handleEditToy(toy)} style={{background:'none', border:'none', color:'#0984e3', cursor:'pointer'}} title="Edit"><Edit2 size={20} /></button>
                        <button onClick={() => handleDeleteToy(toyId)} style={{background:'none', border:'none', color:'#d63031', cursor:'pointer'}} title="Delete"><Trash2 size={20} /></button>
                      </td>
                    </tr>
                    );
                  })}
                  {toys.length === 0 && (
                    <tr><td colSpan="7" style={{padding:'1rem', textAlign:'center', color:'#888'}}>No toys available. Add some above!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div style={{background:'white', padding:'2rem', borderRadius:'20px', boxShadow:'0 10px 30px rgba(0,0,0,0.1)'}}>
          <h3 style={{marginBottom:'1rem', color:'#00b894'}}>Customer Orders ({orders.length})</h3>
          <div style={{overflowX: 'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse'}}>
              <thead>
                <tr style={{background:'#f8f9fa', textAlign:'left'}}>
                  <th style={{padding:'1rem', borderBottom:'2px solid #dee2e6'}}>Order ID</th>
                  <th style={{padding:'1rem', borderBottom:'2px solid #dee2e6'}}>Customer</th>
                  <th style={{padding:'1rem', borderBottom:'2px solid #dee2e6', width: '250px'}}>Items</th>
                  <th style={{padding:'1rem', borderBottom:'2px solid #dee2e6'}}>Delivery Address</th>
                  <th style={{padding:'1rem', borderBottom:'2px solid #dee2e6'}}>Date</th>
                  <th style={{padding:'1rem', borderBottom:'2px solid #dee2e6'}}>Amount</th>
                  <th style={{padding:'1rem', borderBottom:'2px solid #dee2e6'}}>Status</th>
                  <th style={{padding:'1rem', borderBottom:'2px solid #dee2e6'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const orderId = order.oid || order.oId;
                  return (
                  <tr key={orderId} style={{borderBottom:'1px solid #eee'}}>
                    <td style={{padding:'1rem'}}>{orderId}</td>
                    <td style={{padding:'1rem'}}>{order.customer?.loginId || 'Unknown'}</td>
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
                    <td style={{padding:'1rem', fontSize: '0.9rem', color: '#555'}}>{order.customer?.address || 'N/A'}</td>
                    <td style={{padding:'1rem'}}>{new Date(order.date).toLocaleDateString()}</td>
                    <td style={{padding:'1rem'}}>Rs. {order.amount.toFixed(2)}</td>
                    <td style={{padding:'1rem', fontWeight:'bold', color: order.status==='Pending'?'#e17055':order.status==='Accepted'?'#0984e3':order.status==='Completed'?'#00b894':'#d63031'}}>{order.status}</td>
                    <td style={{padding:'1rem', display:'flex', gap:'0.5rem', flexWrap:'wrap'}}>
                      {order.status === 'Pending' && (
                        <>
                          <button onClick={() => handleUpdateOrderStatus(orderId, 'Accepted')} style={{background:'#0984e3', color:'white', border:'none', padding:'0.4rem 0.8rem', borderRadius:'5px', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.3rem'}} title="Accept Order"><CheckCircle size={14}/> Accept</button>
                          <button onClick={() => handleUpdateOrderStatus(orderId, 'Rejected')} style={{background:'#d63031', color:'white', border:'none', padding:'0.4rem 0.8rem', borderRadius:'5px', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.3rem'}} title="Reject Order"><XCircle size={14}/> Reject</button>
                        </>
                      )}
                      {order.status === 'Accepted' && (
                        <button onClick={() => handleUpdateOrderStatus(orderId, 'Completed')} style={{background:'#00b894', color:'white', border:'none', padding:'0.4rem 0.8rem', borderRadius:'5px', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.3rem'}} title="Mark as Completed"><CheckCircle size={14}/> Complete</button>
                      )}
                    </td>
                  </tr>
                  );
                })}
                {orders.length === 0 && (
                  <tr><td colSpan="8" style={{padding:'1rem', textAlign:'center', color:'#888'}}>No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
