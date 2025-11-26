import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout, getCurrentUser } from '../../api/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data);
      } catch (error) {
        // If not logged in, redirect to login page if strictly protected, 
        // but Navbar implies being logged in usually.
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const getNavLinkClass = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navbar" data-easytag="id1-react/src/components/Layout/Navbar.jsx">
      <div className="navbar-start">
        <Link to="/" className="logo">
          facebook
        </Link>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Поиск Facebook"
        />
      </div>

      <div className="navbar-center">
        <Link to="/" className={getNavLinkClass('/')}>
          Главная
        </Link>
        {user && (
          <Link 
            to={`/profile/${user.id}`} 
            className={getNavLinkClass(`/profile/${user.id}`)}
          >
            Профиль
          </Link>
        )}
      </div>

      <div className="navbar-end">
        <Link to="/settings" className={getNavLinkClass('/settings')}>
          Настройки
        </Link>
        <button onClick={handleLogout} className="logout-btn">
          Выйти
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
