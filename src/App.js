import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import GamePage from './pages/gamePage';
import LoginPage from './pages/loginPage';
import SignUp from './pages/signUp';

const App = () => {
  return (
    <div className='app-wrapper'>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;