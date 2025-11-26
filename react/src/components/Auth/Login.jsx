import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/auth';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
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
      await login(formData);
      navigate('/');
    } catch (err) {
      setError('Ошибка входа. Проверьте данные.');
      console.error(err);
    }
  };

  return (
    <div className="auth-container" data-easytag="id1-src/components/Auth/Login.jsx" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1877f2' }}>Вход</h2>
        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            name="username"
            placeholder="Имя пользователя"
            value={formData.username}
            onChange={handleChange}
            required
            style={{ padding: '14px 16px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '17px' }}
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ padding: '14px 16px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '17px' }}
          />
          <button 
            type="submit"
            style={{ backgroundColor: '#1877f2', color: 'white', border: 'none', borderRadius: '6px', padding: '10px', fontSize: '20px', fontWeight: 'bold', marginTop: '10px' }}
          >
            Войти
          </button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid #dadde1', paddingTop: '1.5rem' }}>
            <Link to="/register" style={{ backgroundColor: '#42b72a', color: 'white', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', textDecoration: 'none' }}>Создать новый аккаунт</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
