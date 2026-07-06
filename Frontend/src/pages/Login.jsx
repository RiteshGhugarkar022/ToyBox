import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8081/api/auth/login', { loginId, password });
      localStorage.setItem('token', res.data);
      // For demo, just decode manually if it's a real jwt, or set a mock user
      localStorage.setItem('user', JSON.stringify({ role: loginId === 'admin' ? 'ADMIN' : 'CUSTOMER', loginId }));
      navigate(loginId === 'admin' ? '/admin-dashboard' : '/customer-dashboard');
    } catch (err) {
      alert("Invalid credentials!");
    }
  };

  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', minHeight:'80vh', padding: '2rem 0'}}>
      <div style={{background:'white', padding:'3rem', borderRadius:'20px', boxShadow:'0 10px 30px rgba(0,0,0,0.1)', width:'100%', maxWidth:'400px'}}>
        <h2 style={{fontSize:'2rem', marginBottom:'2rem', textAlign:'center', color:'#6C5CE7'}}>Welcome Back</h2>
        <form onSubmit={handleLogin} style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
          <div>
            <label style={{display:'block', marginBottom:'0.5rem', fontWeight:'500'}}>Login ID</label>
            <input type="text" value={loginId} onChange={e => setLoginId(e.target.value)} required style={{width:'100%', padding:'0.8rem', borderRadius:'10px', border:'1px solid #ddd', outline:'none'}} />
          </div>
          <div>
            <label style={{display:'block', marginBottom:'0.5rem', fontWeight:'500'}}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{width:'100%', padding:'0.8rem', borderRadius:'10px', border:'1px solid #ddd', outline:'none'}} />
          </div>
          <button type="submit" className="btn-primary" style={{marginTop:'1rem'}}>Login</button>
        </form>
        <p style={{marginTop:'1.5rem', textAlign:'center'}}>
          Don't have an account? <Link to="/register" style={{color:'#00CEC9'}}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
