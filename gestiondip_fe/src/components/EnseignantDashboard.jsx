import { useState, useContext } from "react"; 
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context"; 

const EnseignantDashboard = () => {
  const [grade, setGrade] = useState("Maître Assistant B");
  const [experience, setExperience] = useState("");
  const [encadrements, setEncadrements] = useState(0);
  const [publications, setPublications] = useState(0);
  const [seminaires, setSeminaires] = useState("");
  const [memoiresEncadrement, setMemoiresEncadrement] = useState([]); 
  const [memoiresPublication, setMemoiresPublication] = useState([]); 

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  // Mise à jour du nombre d'encadrements et initialisation de la liste des mémoires
  const handleEncadrementsChange = (e) => {
    const value = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
    setEncadrements(value);
    setMemoiresEncadrement(new Array(value).fill(null)); // Crée un tableau vide basé sur la valeur
  };

  // Mise à jour du nombre de publications et initialisation de la liste des fichiers
  const handlePublicationsChange = (e) => {
    const value = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
    setPublications(value);
    setMemoiresPublication(new Array(value).fill(null)); 
  };

  // Gérer l'upload de plusieurs fichiers pour les encadrements
  const handleEncadrementFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMemoiresEncadrement(files);
  };

  // Gérer l'upload de plusieurs fichiers pour les publications
  const handlePublicationFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMemoiresPublication(files);
  };

  const handleSave = () => {
    const enseignantData = { 
      grade, 
      experience, 
      encadrements, 
      publications, 
      seminaires, 
      memoiresEncadrement, 
      memoiresPublication 
    };
    localStorage.setItem("enseignantData", JSON.stringify(enseignantData));
    alert("Informations enregistrées avec succès !");
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("enseignantData");
    navigate("/");
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-3xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-center mb-6">Enseignant</h2>

      {/* Sélection du Grade */}
      <div className="mb-4">
        <label className="block font-semibold text-lg">Grade :</label>
        <select value={grade} onChange={(e) => setGrade(e.target.value)} className="p-2 border rounded w-full">
          <option value="Maître Assistant B">Maître Assistant B</option>
          <option value="Maître Assistant A">Maître Assistant A</option>
          <option value="Professeur">Professeur</option>
        </select>
      </div>

      {/* Années d'expérience */}
      <div className="mb-4">
        <label className="block font-semibold text-lg">Années d'expérience :</label>
        <input type="number" value={experience} onChange={(e) => setExperience(e.target.value)}
          className="p-2 border rounded w-full" placeholder="Ex : 5 ans" />
      </div>

      {/* Nombre d'encadrements de doctorants */}
      <div className="mb-4">
        <label className="block font-semibold text-lg">Nombre d'encadrements de doctorants :</label>
        <input type="number" value={encadrements} onChange={handleEncadrementsChange}
          className="p-2 border rounded w-full" placeholder="Ex : 3 doctorants" />
      </div>

      {/* Téléchargement de mémoires en fonction des encadrements */}
      <div className="mb-4">
        <label className="block font-semibold text-lg">Télécharger les mémoires des doctorants :</label>
        <input type="file" accept=".pdf" multiple onChange={handleEncadrementFileChange} className="p-2 border rounded w-full" />
        
        {memoiresEncadrement.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-semibold">Fichiers sélectionnés :</p>
            <ul className="text-sm text-green-600">
              {memoiresEncadrement.map((file, index) => file && <li key={index}>{file.name}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* Nombre de publications scientifiques */}
      <div className="mb-4">
        <label className="block font-semibold text-lg">Nombre de publications scientifiques :</label>
        <input type="number" value={publications} onChange={handlePublicationsChange}
          className="p-2 border rounded w-full" placeholder="Ex : 8 publications" />
      </div>

      {/* Téléchargement de fichiers en fonction des publications */}
      <div className="mb-4">
        <label className="block font-semibold text-lg">Télécharger les fichiers liés aux publications :</label>
        <input type="file" accept=".pdf" multiple onChange={handlePublicationFileChange} className="p-2 border rounded w-full" />
        
        {memoiresPublication.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-semibold">Fichiers sélectionnés :</p>
            <ul className="text-sm text-green-600">
              {memoiresPublication.map((file, index) => file && <li key={index}>{file.name}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* Nombre de journées et séminaires pédagogiques */}
      <div className="mb-4">
        <label className="block font-semibold text-lg">Nombre de journées et séminaires pédagogiques :</label>
        <input type="number" value={seminaires} onChange={(e) => setSeminaires(e.target.value)}
          className="p-2 border rounded w-full" placeholder="Ex : 4 séminaires" />
      </div>

      {/* Boutons */}
      <div className="flex flex-col gap-4 mt-6">
        <button onClick={handleSave} className="p-3 bg-green-500 text-white rounded-lg w-full hover:bg-green-600 transition">
          Enregistrer les informations
        </button>
        <button onClick={handleLogout} className="p-3 bg-red-500 text-white rounded-lg w-full hover:bg-red-600 transition">
          Se Déconnecter
        </button>
      </div>
    </div>
  );
};

export default EnseignantDashboard;
