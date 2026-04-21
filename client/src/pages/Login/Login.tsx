import { useState } from "react";
import { Button } from "../../components/Button/Button";
import { useAppDispatch } from "../../redux/hooks";
import { useLoginMutation } from "../../features/auth/authApi";
import { setCredentials } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import { Loader } from "../../components/Loader/Loader";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await login({ email, password }).unwrap();
      dispatch(setCredentials({ user: response.user, token: response.accessToken }));
      navigate('/home', { replace: true });
    } catch (err) {
      console.error('Login failed', err);
    }
  }

  if (isLoading) {
    return (
      <Loader />
    )
  }

  return (
    <>
      <div className="login-container">
        <h1>Login<br />into your account</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="primary" size="md" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</Button>
          {error && <p style={{ color: 'red' }}>Login failed</p>}
        </form>
        <p>Don't have an acount? <a href="/signup">Sign Up</a></p>
      </div>
    </>
  );
};