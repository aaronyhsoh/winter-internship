
import './App.css';
import { Route, Routes } from 'react-router-dom';
import AllBondsPage from './pages/AllBonds';
import NewBondPage from './pages/NewBond';
import Navigation from './components/Navigation';

function App() {
  return (
  <>
    <Navigation />
    <Routes>
      <Route path="/" element={<AllBondsPage />} />
      <Route path="/new-bond" element={<NewBondPage />} />
    </Routes>
  </>
  );
}

export default App;
