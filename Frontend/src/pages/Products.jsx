import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [toys, setToys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // This will connect to the Spring Boot backend
    axios.get('http://localhost:8081/api/toys')
      .then(res => {
        setToys(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching toys:", err);
        // Fallback mock data for visual demonstration
        setToys([
          { tId: 1, name: 'AI Robot Dog', price: 149.99, description: 'Smart companion robot.', category: 'Electronics', stock: 10, toyImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=500&q=60' },
          { tId: 2, name: 'Classic Wooden Blocks', price: 120.00, description: 'Set of 50 colorful wooden blocks for creative building.', category: 'Educational', stock: 50, toyImage: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80' },
          { tId: 3, name: 'Remote Control Car', price: 150.00, description: 'High speed remote control car with rechargeable battery.', category: 'Vehicles', stock: 30, toyImage: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&q=80' },
          { tId: 4, name: 'Plush Teddy Bear', price: 110.00, description: 'Ultra soft and cuddly medium sized brown teddy bear.', category: 'Soft Toys', stock: 200, toyImage: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=400&q=80' },
          { tId: 5, name: 'Lego Spaceship Set', price: 350.00, description: '500-piece spaceship building kit with two astronaut mini-figures.', category: 'Building', stock: 30, toyImage: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=400&q=80' },
          { tId: 6, name: 'Barbie Dreamhouse', price: 250.00, description: 'Three-story dreamhouse with elevator and slide.', category: 'Dolls', stock: 15, toyImage: 'https://images.unsplash.com/photo-1606774673822-0bedeacc4568?w=400&q=80' },
          { tId: 7, name: 'Magnetic Tiles Kit', price: 180.00, description: '100-piece magnetic building tiles for 3D construction.', category: 'Educational', stock: 40, toyImage: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&q=80' },
          { tId: 8, name: 'Dinosaur Figures Pack', price: 130.00, description: 'A pack of 12 realistic miniature dinosaur figures.', category: 'Action', stock: 70, toyImage: 'https://images.unsplash.com/photo-1569858241517-8e100f91ce4f?w=400&q=80' },
          { tId: 9, name: 'Vintage Model Train', price: 450.00, description: 'A beautifully detailed vintage model train set with track.', category: 'Collectibles', stock: 25, toyImage: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&q=80' },
          { tId: 10, name: 'Toy Kitchen Appliance Set', price: 210.00, description: 'Coffee maker, toaster, and blender playset with sound effects.', category: 'Roleplay', stock: 50, toyImage: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80' }
        ]);
        setLoading(false);
      });
  }, []);

  const addToCart = (toy) => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = currentCart.find(t => (t.tId || t.tid) === (toy.tId || toy.tid));
    if(existing) {
       existing.quantity += 1;
    } else {
       currentCart.push({...toy, quantity: 1});
    }
    localStorage.setItem('cart', JSON.stringify(currentCart));
    navigate('/cart');
  };

  if (loading) {
    return <div style={{textAlign: 'center', padding: '5rem'}}>Loading magical toys...</div>;
  }

  const filteredToys = Array.isArray(toys) ? toys.filter(toy => 
    toy.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (toy.category && toy.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (toy.description && toy.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  return (
    <div className="products-page" style={{padding: '2rem 5%'}}>
      <h2 style={{fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center'}}>All Toys</h2>
      
      <div style={{display: 'flex', justifyContent: 'center', marginBottom: '2.5rem'}}>
        <input 
          type="text" 
          placeholder="Search for toys by name, category, or description..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{padding: '1rem 1.5rem', width: '100%', maxWidth: '600px', borderRadius: '30px', border: '2px solid #00b894', fontSize: '1.1rem', outline: 'none', boxShadow: '0 4px 6px rgba(0,184,148,0.1)'}}
        />
      </div>

      <div className="products-grid">
        {filteredToys.map(toy => (
          <div className="product-card" key={toy.tId || toy.tid}>
            <img src={toy.toyImage || toy.image || 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=500&q=60'} alt={toy.name} className="product-img" />
            <div className="product-info">
              <h3 className="product-title">{toy.name}</h3>
              <p className="product-price">Rs. {toy.price}</p>
              <p style={{color: '#636e72', marginBottom: '1rem', flex: 1}}>{toy.description}</p>
              <button className="btn-primary" style={{width: '100%', padding: '0.8rem', background: '#00b894'}} onClick={() => addToCart(toy)}>Order / Add to Cart</button>
            </div>
          </div>
        ))}
        {filteredToys.length === 0 && Array.isArray(toys) && toys.length > 0 && <p style={{textAlign: 'center', width: '100%', gridColumn: '1 / -1', fontSize: '1.2rem', color: '#636e72'}}>No toys found matching "{searchTerm}".</p>}
        {!Array.isArray(toys) && <p style={{textAlign: 'center', color: 'red'}}>Error: Toys data is invalid.</p>}
      </div>
    </div>
  );
};

export default Products;
