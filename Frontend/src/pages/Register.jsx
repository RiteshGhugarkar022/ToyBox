import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [loginId, setLoginId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!loginId || loginId.trim().length < 3) {
      tempErrors.loginId = "Login ID must be at least 3 characters long.";
      isValid = false;
    }
    
    if (!name || name.trim().length < 2) {
      tempErrors.name = "Name must be at least 2 characters long.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      tempErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!password || password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }

    if (!address || address.trim().length < 5) {
      tempErrors.address = "Address must be at least 5 characters long.";
      isValid = false;
    }

    const phoneRegex = /^\d{10}$/; 
    if (!phone || !phoneRegex.test(phone.trim())) {
      tempErrors.phone = "Phone number must be exactly 10 digits.";
      isValid = false;
    }

    if (!gender) {
      tempErrors.gender = "Please select a gender.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await axios.post('http://localhost:8081/api/auth/register', { loginId, name, email, password, address, phone, gender });
      alert("Registration successful! Please login.");
      navigate('/login');
    } catch (err) {
      alert("Registration Failed! Make sure details are correct and login id/email are unique.");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '2rem 0' }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', color: '#00CEC9' }}>Create Account</h2>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.2rem', fontWeight: '500' }}>Login ID</label>
            <input type="text" value={loginId} onChange={e => setLoginId(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid #ddd' }} />
            {errors.loginId && <span style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.2rem', display: 'block' }}>{errors.loginId}</span>}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.2rem', fontWeight: '500' }}>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid #ddd' }} />
            {errors.name && <span style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.2rem', display: 'block' }}>{errors.name}</span>}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.2rem', fontWeight: '500' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid #ddd' }} />
            {errors.email && <span style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.2rem', display: 'block' }}>{errors.email}</span>}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.2rem', fontWeight: '500' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid #ddd' }} />
            {errors.password && <span style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.2rem', display: 'block' }}>{errors.password}</span>}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.2rem', fontWeight: '500' }}>Address</label>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid #ddd' }} />
            {errors.address && <span style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.2rem', display: 'block' }}>{errors.address}</span>}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.2rem', fontWeight: '500' }}>Phone</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid #ddd' }} />
            {errors.phone && <span style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.2rem', display: 'block' }}>{errors.phone}</span>}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.2rem', fontWeight: '500' }}>Gender</label>
            <select value={gender} onChange={e => setGender(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid #ddd' }}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Transgender</option>
            </select>
            {errors.gender && <span style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.2rem', display: 'block' }}>{errors.gender}</span>}
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', background: '#00CEC9' }}>Register</button>
        </form>
        <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: '#6C5CE7' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
