import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../api/auth';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError('Ошибка регистрации. Попробуйте снова.');
      console.error(err);
    }
  };

  return (
    <div className="auth-container" data-easytag="id1-src/components/Auth/Register.jsx" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Создать аккаунт</h2>
        <p style={{ textAlign: 'center', color: '#606770', marginBottom: '1.5rem' }}>Быстро и легко.</p>
        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            name="username"
            placeholder="Имя пользователя"
            value={formData.username}
            onChange={handleChange}
            required
            style={{ padding: '10px 14px', borderRadius: '5px', border: '1px solid #ccd0d5', fontSize: '16px', backgroundColor: '#f5f6f7' }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={{ padding: '10px 14px', borderRadius: '5px', border: '1px solid #ccd0d5', fontSize: '16px', backgroundColor: '#f5f6f7' }}
          />
          <input
            type="password"
            name="password"
            placeholder="Новый пароль"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ padding: '10px 14px', borderRadius: '5px', border: '1px solid #ccd0d5', fontSize: '16px', backgroundColor: '#f5f6f7' }}
          />
          <p style={{ fontSize: '11px', color: '#777' }}>
            Нажимая кнопку «Регистрация», вы принимаете наши Условия и Политику использования данных.
          </p>
          <button 
            type="submit"
            style={{ backgroundColor: '#00a400', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '18px', fontWeight: 'bold', width: '50%', margin: '0 auto' }}
          >
            Регистрация
          </button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link to="/login" style={{ color: '#1877f2', fontSize: '14px' }}>Уже есть аккаунт?</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
