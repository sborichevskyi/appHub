import './Header.scss'
import { Button } from '../Button/Button';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useNavigate, Link, useLocation, NavLink } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';

export const Header: React.FC = () => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation();
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (err) {
      console.error(err)
    }
    dispatch(logout())
    setIsOpen(false);
    navigate('/home')
  }

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setIsOpen(false);
    });
  }, [location.pathname]);

  return (
    <header className={`header ${isOpen ? 'header--menu-open' : ''}`}>
  <Link to="/" className="header__logo" >
    <h1>AppHub</h1>
  </Link>

   <button
    className="header__burger"
    aria-expanded={isOpen}
    aria-label={isOpen ? 'Close menu' : 'Open menu'}
    onClick={() => setIsOpen(!isOpen)}
  >
    <span className="header__burger-line" />
    <span className="header__burger-line" />
    <span className="header__burger-line" />
  </button>

  <div
    className="header__overlay"
    onClick={() => setIsOpen(false)}
    aria-hidden
  />

  <nav
    id="main-navigation"
    className="header__nav"
  >
    <ul className="header__list">
      <li><NavLink to="/">Home</NavLink></li>
      <li><NavLink to="/profile">Profile</NavLink></li>
      <li><NavLink to="/jobs">Jobs</NavLink></li>
      <li><NavLink to="/applications">Applications</NavLink></li>
    </ul>

    <div className="header__buttons">
      {isAuthenticated ? (
        <Button variant='primary' size="sm" onClick={handleLogout}>Logout</Button>
      ) : (
        <>
          <Button as="link" to="/login" variant="ghost" size="sm">Login</Button>
          <Button as="link" to="/signup" variant="primary" size="sm">Sign Up</Button>
        </>
      )}

    </div>
  </nav>
</header>
  );
};