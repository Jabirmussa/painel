'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [form, setForm] = useState({
    name: '',
    status: 'Disponível',
    restaurantId: 'demo',
    price: '',
    image: null,
    description: ''
  });

  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(setMenu);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!form.image) {
      toast.error('Por favor, selecione uma imagem!');
      return;
    }
  
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('status', form.status);
    formData.append('restaurantId', form.restaurantId);
    formData.append('image', form.image);
    formData.append('description', form.description);
  
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        body: formData
      });
  
      if (!res.ok) throw new Error('Erro no envio');
  
      toast.success('Item cadastrado com sucesso!');
      setForm({
        name: '',
        status: 'Disponível',
        restaurantId: 'demo',
        price: '',
        image: null,
        description: ''
      });
  
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error('Falha ao cadastrar o item!');
    }
  };
  

  return (
    <main style={{
      minHeight: '100vh',
      background: '#f9fafb',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px', color: '#333' }}>Painel Menu</h1>

      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        <input
          name="name"
          placeholder="Nome do prato"
          value={form.name}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="price"
          placeholder="Preço"
          value={form.price}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="description"
          placeholder="Descrição" 
          value={form.description}
          onChange={handleChange}
          style={inputStyle}
        />
        <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
          <option>Disponível</option>
          <option>Esgotado</option>
          <option>Em preparo</option>
        </select>
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
          style={{ ...inputStyle, padding: '8px' }}
        />
        <button type="submit" style={buttonStyle}>Cadastrar</button>
      </form>

      <h2 style={{ marginTop: '50px', marginBottom: '20px', color: '#555' }}>Menu Atual</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        width: '100%',
        maxWidth: '1000px'
      }}>
        {menu.map(item => (
          <div key={item._id} style={{
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            padding: '15px',
            textAlign: 'center'
          }}>
            <img src={item.image} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
            <h3 style={{ margin: '10px 0', color: '#333' }}>{item.name}</h3>
            <p style={{ color: '#777' }}>{item.status} - {item.price}</p>
            <p style={{ color: '#777' }}>{item.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

const inputStyle = {
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontSize: '1rem',
  color: '#333',
  background: '#f9f9f9'
};

const buttonStyle = {
  padding: '12px',
  background: '#4f46e5',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: '0.3s'
};
