'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { QRCodeCanvas } from 'qrcode.react';


export default function AdminPage() {
 
  const fakeRestaurants = [
    { id: 'demo', name: 'Demo Restaurante', tables: 3 },
    { id: 'rest01', name: 'Restaurante 01', tables: 4 },
    { id: 'rest02', name: 'Restaurante 02', tables: 2 },
  ];

  const [menu, setMenu] = useState([]);
  const [restaurants, setRestaurants] = useState(fakeRestaurants);
  const [selectedRestaurant, setSelectedRestaurant] = useState(fakeRestaurants[0].id);
  const [editingId, setEditingId] = useState(null);

 const [form, setForm] = useState({
    name: '',
    status: 'Pratos',
    restaurantId: selectedRestaurant,
    price: '',
    image: null,
    description: '',
    time: ''
  });
  
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

  const formData = new FormData();
  formData.append('name', form.name);
  formData.append('price', form.price);
  formData.append('status', form.status);
  formData.append('restaurantId', form.restaurantId);
  formData.append('description', form.description);
  formData.append('time', form.time);

  if (form.image) {
    formData.append('image', form.image);
  }

  try {
    const url = editingId ? '/api/menu' : '/api/menu';
    const method = editingId ? 'PUT' : 'POST';

    if (editingId) {
      formData.append('id', editingId);
    }

    const res = await fetch(url, {
      method,
      body: formData
    });

    if (!res.ok) throw new Error('Erro no envio');

    toast.success(editingId ? 'Item atualizado com sucesso!' : 'Item cadastrado com sucesso!');

    setForm({
      name: '',
      status: 'Pratos',
      restaurantId: 'demo',
      price: '',
      image: null,
      description: '',
      time: ''
    });
    setEditingId(null); 

    window.location.reload();
  } catch (err) {
    console.error(err);
    toast.error(editingId ? 'Falha ao atualizar o item!' : 'Falha ao cadastrar o item!');
  }
};


const handleEdit = (item) => {
  setForm({
    name: item.name,
    status: item.status,
    restaurantId: item.restaurantId,
    price: item.price,
    image: null,
    description: item.description,
    time: item.time
  });
  setEditingId(item._id); 
};


  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      try {
        const res = await fetch(`/api/menu`, {
          method: 'DELETE',
          body: JSON.stringify({ id }),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) throw new Error('Erro ao excluir item');

        toast.success('Item excluído com sucesso!');
        window.location.reload();
      } catch (err) {
        console.error(err);
        toast.error('Falha ao excluir o item!');
      }
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
      <div className='principal-painel' >
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
          <label>
            Selecione Restaurante:
            <select name="restaurantId" value={form.restaurantId} onChange={handleChange} style={inputStyle}>
              {restaurants.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </label>

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
            name="time"
            placeholder="Tempo de preparo"
            value={form.time}
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
            {/* <option>Disponível</option> */}
            {/* <option>Esgotado</option> */}
            {/* <option>Em preparo</option> */}
            <option>Pratos</option>
            <option>Bebidas</option>
            <option>Pizzas</option>
            <option>Sugestões</option>
            <option>Prato do dia</option>
          </select>
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleChange}
            style={{ ...inputStyle, padding: '8px' }}
          />
          <button type="submit" style={buttonStyle}>
            {editingId ? 'Atualizar' : 'Cadastrar'}
          </button>

        </form>
      </div>

      <div className='menus'>
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
              <p style={{ color: '#777' }}>{item.time}</p>
              <button onClick={() => handleEdit(item)} style={{ ...buttonStyle, marginTop: '10px' }}>Editar</button>
              <button onClick={() => handleDelete(item._id)} style={{ ...buttonStyle, marginTop: '10px', background: '#e3342f' }}>Excluir</button>
            </div>
          ))}
        </div>
      </div>

      <div className='qr-codes'>
          <h2 style={{ marginTop: '50px', color: '#000' }}>QR Codes das Mesas</h2>

          {restaurants.map(rest => {
            const hasMenu = menu.some(item => item.restaurantId === rest.id);

            if (!hasMenu) return null;

            return (
              <div key={rest.id} style={{ marginBottom: '30px' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '15px', color: '#000' }}>
                  QR Codes - <strong>{rest.name}</strong>
                </h3>

                <div style={{
                  display: 'flex',
                  gap: '20px',
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}>
                  {Array.from({ length: rest.tables }).map((_, index) => (
                    <div key={index} style={{ textAlign: 'center' }}>
                      <QRCodeCanvas 
                        value={`https://painel-orcin.vercel.app/${rest.id}`} 
                        size={160} 
                        bgColor="#FFFFFF" 
                        fgColor="#000000" 
                        level="H"
                      />
                      <p style={{ marginTop: '8px', color: '#000' }}>Mesa {index + 1}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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
