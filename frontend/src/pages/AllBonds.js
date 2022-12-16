import React from 'react';
import { useState, useEffect } from 'react';

import BondList from '../components/bonds/BondList';

function AllBondsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedMeetups, setLoadedMeetups] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetch(
      'https://frontend-9868d-default-rtdb.firebaseio.com/bonds.json'
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const bonds = [];

        for (const key in data) {
          const bond = {
            id: key,
            ...data[key]
          };

          bonds.push(bond);
        }

        setIsLoading(false);
        setLoadedMeetups(bonds);
      });
  }, []);

  if (isLoading) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section>
      <h1>All Bonds</h1>
      <BondList meetups={loadedMeetups} />
    </section>
  );
}

export default AllBondsPage;