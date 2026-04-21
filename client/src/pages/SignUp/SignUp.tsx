import { useAppDispatch } from "../../redux/hooks";
import { Button } from "../../components/Button/Button";
import { useState } from "react";
import { setCredentials } from "../../features/auth/authSlice";
import { useSignupMutation } from "../../features/auth/authApi";
import "./SignUp.scss";
import { Loader } from "../../components/Loader/Loader";

export const SignUp: React.FC = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signup, { isLoading, error, isSuccess }] = useSignupMutation();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();;
    try {
      const response = await signup({ name, email, password }).unwrap();
      dispatch(setCredentials({ user: response.user, token: response.accessToken }));
      } catch (err) {
        console.error('Sign-up failed', err);
      }
  };

  if (isLoading) {
    return (
      <Loader />
    );
  }

  if (isSuccess) {
    return (
      <div className="signup-container">
        <h1>Check your email</h1>
        <p>
          We have sent a confirmation link to <b>{email}</b>.
        </p>
        <p>Please verify your email to activate your account.</p>
      </div>
    );
  }

  return (
    <>
      <div className="signup-container">
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input 
            type="text"
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit" variant="primary" size="md" disabled={isLoading}>{isLoading ? 'Signing up...' : 'Sign Up'}</Button>
          {error && <p style={{ color: 'red' }}>Sign-up failed</p>}
        </form>
        <p>Already have an acount? <a href="/login">Log in</a></p>
      </div>
    </>
  );
};