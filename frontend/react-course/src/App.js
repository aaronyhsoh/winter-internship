import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AllMeetupsPage from './pages/AllMeetups';
import NewMeetupPage from './pages/NewMeetup';
import FavoritesPage from './pages/Favorites';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Layout className="App">
      <Routes>
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/" element={<AllMeetupsPage />} />
        <Route path="/new-meetup" element={<NewMeetupPage />} />
      </Routes>
    </Layout>
  );
}

// function App() {
//   return (
//     <div>
//       <Route path="/" element={<AllMeetupspage />} />
//       <Route path='/new-meetup'>
//         <NewMeetupPage />
//       </Route>
//       <Route path='/favorites'>
//         <FavoritesPage />
//       </Route>
//     </div>
//   );
// }

export default App;