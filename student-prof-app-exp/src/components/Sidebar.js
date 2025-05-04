import React from 'react';
import { Button } from 'react-bootstrap';

const Sidebar = ({ setView, profile }) => {
  return (
    <div className="bg-light p-3" style={{ height: '100vh' }}>
      <h5>Menu ({profile})</h5>
      {profile === 'student' && (
        <Button variant="primary" className="mb-2" onClick={() => setView('form')}>
          Remplir Formulaire
        </Button>
      )}
      {profile === 'prof' && (
        <Button variant="success" onClick={() => setView('list')}>
          Voir Étudiants
        </Button>
      )}
    </div>
  );
};

export default Sidebar;
