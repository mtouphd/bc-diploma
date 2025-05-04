import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const StudentForm = () => {
  const [formData, setFormData] = useState({ nom: '', prenom: '', email: '' });
  const [pdfFile, setPdfFile] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pdfFile) return alert("Veuillez ajouter un fichier PDF");

    const reader = new FileReader();
    reader.onload = () => {
      const stored = JSON.parse(localStorage.getItem('etudiants')) || [];
      stored.push({
        ...formData,
        pdfData: reader.result, // base64
      });
      localStorage.setItem('etudiants', JSON.stringify(stored));
      setSuccess(true);
      setFormData({ nom: '', prenom: '', email: '' });
      setPdfFile(null);
    };
    reader.readAsDataURL(pdfFile);
  };

  return (
    <Form className="p-4" onSubmit={handleSubmit}>
      <h4>Formulaire Étudiant</h4>
      {success && <Alert variant="success">Informations enregistrées !</Alert>}
      <Form.Group className="mb-3">
        <Form.Label>Nom</Form.Label>
        <Form.Control name="nom" value={formData.nom} onChange={handleChange} required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Prénom</Form.Label>
        <Form.Control name="prenom" value={formData.prenom} onChange={handleChange} required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control name="email" value={formData.email} onChange={handleChange} required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Document PDF</Form.Label>
        <Form.Control type="file" accept="application/pdf" onChange={handleFile} required />
      </Form.Group>
      <Button type="submit">Soumettre</Button>
    </Form>
  );
};

export default StudentForm;
