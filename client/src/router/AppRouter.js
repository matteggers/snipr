import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavMenu from '../components/Navbar.js'; // Your navbar
import HomePage from '../pages/home-page';
import TodayPage from '../pages/today';
import LikedPage from '../pages/liked';
import DislikedPage from '../pages/disliked';
import ReadLaterPage from '../pages/read-later';

function AppRouter() {
  return (
    <Router>
      <NavMenu />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/today" element={<TodayPage />} />
        <Route path="/liked" element={<LikedPage />} />
        <Route path="/disliked" element={<DislikedPage />} />
        <Route path="/read_later" element={<ReadLaterPage />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;