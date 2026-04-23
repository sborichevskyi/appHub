import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { Profile } from './pages/Profile/Profile';
import { SignUp } from './pages/SignUp/SignUp';
import { Jobs } from './pages/Jobs/Jobs';
import App from './App';
import { Provider } from 'react-redux'
import { store } from './redux/store';
import { Applications } from './pages/Applications/Applications';
import { JobDetails } from './pages/JobDetails/JobDetails';
import { Activate } from './pages/Activate/Activate';

function Root() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/auth/activate" element={<Activate />} />
            <Route path="home" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  )
}

export default Root;
