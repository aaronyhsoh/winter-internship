import React from 'react';
import { useHistory } from 'react-router-dom';

import CreateBondForm from '../components/bonds/CreateBondForm';

function CreateBondPage() {
  const history = useHistory();

  function createBondHandler(createBondData) {
    fetch(
      'https://frontend-9868d-default-rtdb.firebaseio.com/bonds.json',
      {
        method: 'POST',
        body: JSON.stringify(createBondData),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then(() => {
      history.replace('/');
    });
  }

  return (
    <section>
      <h1>Create Bond</h1>
      <CreateBondForm onCreateBond={createBondHandler} />
    </section>
  );
}

export default CreateBondPage;