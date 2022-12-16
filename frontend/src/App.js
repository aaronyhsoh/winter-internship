import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AllBondsPage from './pages/AllBonds';
import CreateBondPage from './pages/CreateBond';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Layout className="App">
      <Routes>
        <Route path="/" element={<AllBondsPage />} />
        <Route path="/create-bond" element={<CreateBondPage />} />
      </Routes>
    </Layout>
  );
}

export default App;