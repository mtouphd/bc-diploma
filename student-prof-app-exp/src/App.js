import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import StudentForm from './components/StudentForm';
import ProfDashboard from './components/ProfDashboard';
import { Container, Row, Col } from 'react-bootstrap';

const App = () => {
  const [profile, setProfile] = useState(null); // 'student' or 'prof'
  const [view, setView] = useState(null); // 'form' or 'list'

  if (!profile) {
    return (
      <div className="text-center mt-5">
        <h2>Choisissez votre profil</h2>
        <button className="btn btn-primary m-2" onClick={() => setProfile('student')}>
          Étudiant
        </button>
        <button className="btn btn-success m-2" onClick={() => setProfile('prof')}>
          Enseignant
        </button>
      </div>
    );
  }

  return (
    <Container fluid>
      <Row>
        <Col md={2}>
          <Sidebar setView={setView} profile={profile} />
        </Col>
        <Col md={10}>
          {profile === 'student' && view === 'form' && <StudentForm />}
          {profile === 'prof' && view === 'list' && <ProfDashboard />}
        </Col>
      </Row>
    </Container>
  );
};

export default App;
