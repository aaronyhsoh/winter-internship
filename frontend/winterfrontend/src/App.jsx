
import './App.css';
import { Route, Routes } from 'react-router-dom';
import AllBondsPage from './pages/AllBonds';
import NewBondPage from './pages/NewBond';
import TransferBondPage from './pages/TransferBond';
import Homepage from './pages/Homepage';
import Navigation from './components/Navigation';

function App() {
  return (
  <>
    <Navigation />
    <Routes>
      <Route path="/all-bonds" element={<AllBondsPage />} />
      <Route path="/new-bond" element={<NewBondPage />} />
      <Route path="/transfer-bond" element={<TransferBondPage />} />
      <Route path="/" element={<Homepage />} />
    </Routes>
  </>
  );
}

export default App;
