import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import GamePage from './pages/gamePageCurrent';
import GamePageHOF from './pages/gamePageHOF';
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
          <Route path="/gameHOF" element={<GamePageHOF />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;