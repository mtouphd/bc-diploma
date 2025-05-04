import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import PdfViewer from './PdfViewer';

const ProfDashboard = () => {
  const [etudiants, setEtudiants] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('etudiants')) || [];
    setEtudiants(stored);
  }, []);

  return (
    <div className="p-4">
      <h4>Liste des étudiants</h4>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Voir PDF</th>
          </tr>
        </thead>
        <tbody>
          {etudiants.map((et, idx) => (
            <tr key={idx}>
              <td>{et.nom}</td>
              <td>{et.prenom}</td>
              <td>{et.email}</td>
              <td>
                <Button onClick={() => setSelectedPdf(et.pdfData)}>Voir PDF</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {selectedPdf && <PdfViewer base64Pdf={selectedPdf} />}
    </div>
  );
};

export default ProfDashboard;
