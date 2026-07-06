import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, CheckCircle } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Try to safely grab state from the explicit cart redirect router data
  const totalAmount = location.state?.total || 0;
  
  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate('/login');
    }
    
    if (totalAmount <= 0 && !success) {
      alert('Cart is empty or invalid transfer!');
      navigate('/cart');
    }
  }, [navigate, totalAmount, success]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate secure payment gateway spinning 
    setTimeout(async () => {
       try {
         const userStr = localStorage.getItem('user');
         let loginId = 'Unknown';
         if(userStr) loginId = JSON.parse(userStr).loginId;

         const cartStr = localStorage.getItem('cart');
         const cartItems = cartStr ? JSON.parse(cartStr) : [];

         const orderData = {
           amount: totalAmount,
           customer: {
             loginId: loginId
           },
           items: cartItems.map(item => ({
             toyId: item.tId || item.tid,
             toyName: item.name,
             toyImage: item.toyImage || item.image,
             quantity: item.quantity
           }))
         };

         await axios.post('http://localhost:8081/api/orders/checkout', orderData);
         
         // Clear the cart on successful payment completion
         localStorage.removeItem('cart');
         
         setSuccess(true);
         setLoading(false);
         
         setTimeout(() => {
           navigate('/customer-dashboard');
         }, 3000);

       } catch (err) {
         setLoading(false);
         const backendError = err.response?.data?.message || err.response?.data?.error || err.message;
         alert("Payment failed: " + backendError);
       }
    }, 1500);
  };

  if (success) {
    return (
      <div style={{display:'flex', justifyContent:'center', alignItems:'center', minHeight:'70vh'}}>
         <div style={{textAlign:'center', background:'white', padding:'4rem', borderRadius:'20px', boxShadow:'0 10px 30px rgba(0,0,0,0.1)'}}>
            <CheckCircle size={80} color="#00b894" style={{marginBottom:'1.5rem'}} />
            <h2 style={{fontSize:'2rem', color:'#2d3436'}}>Payment Successful!</h2>
            <p style={{marginTop:'1rem', color:'#636e72'}}>Thank you for your order. Redirecting to dashboard...</p>
         </div>
      </div>
    );
  }

  return (
    <div style={{padding: '3rem 5%', maxWidth: '600px', margin: '0 auto'}}>
      <h2 style={{fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center'}}>Secure Checkout</h2>
      
      <div style={{background:'white', padding:'3rem', borderRadius:'20px', boxShadow:'0 10px 30px rgba(0,0,0,0.1)'}}>
         <div style={{display:'flex', justifyContent:'space-between', borderBottom:'2px solid #f1f2f6', paddingBottom:'1.5rem', marginBottom:'2rem'}}>
            <h3 style={{color:'#6C5CE7'}}>Total Amount</h3>
            <h3 style={{color:'#2d3436'}}>Rs. {totalAmount.toFixed(2)}</h3>
         </div>
         
         <div style={{textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:'1.5rem'}}>
            <h4 style={{color:'#333', fontSize:'1.2rem'}}>Scan the QR Code to Pay with PhonePe / Razorpay</h4>
            
            {/* Note: This is an automatically generated stand-in using the user's exact cart amount. If they wish to place a static generic one, they can optionally swap the image src with '/phonepe.jpg' in the public folder */}
            <div style={{padding:'1rem', background:'white', border:'3px dashed #6C5CE7', borderRadius:'15px', display:'inline-block'}}>
               <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=razorpay@phonepe&am=${totalAmount}&cu=INR`} alt="PhonePe QR Code" style={{width:'250px', height:'250px'}} />
            </div>

            <p style={{color:'#636e72', fontSize:'0.95rem', maxWidth:'300px'}}>Open your PhonePe or UPI app, scan the code, and confirm the exact amount securely.</p>
            
            <button onClick={handlePayment} disabled={loading} style={{
                background: loading ? '#ccc' : '#00b894',
                color: 'white', border: 'none', padding: '1.2rem', width: '100%',
                borderRadius: '10px', fontSize: '1.2rem', fontWeight: 'bold', 
                cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1rem',
                transition: 'background 0.3s ease', display: 'flex', justifyContent: 'center', gap: '0.8rem'
              }}>
                {loading ? 'Verifying Transaction...' : `I've Paid Rs. ${totalAmount.toFixed(2)}`}
            </button>
         </div>
      </div>
    </div>
  );
};

export default Payment;
