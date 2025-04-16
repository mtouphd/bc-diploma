import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context";

const EtudiantDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [info, setInfo] = useState({
    filiere: user.filiere || "",
    niveau: user.niveau || "",
    dateNaissance: "",
    lieuNaissance: "",
    moyenneGenerale: "",
  });
  const [diplome, setDiplome] = useState(null);
  const [statutDiplome, setStatutDiplome] = useState("En attente"); // Ajout du statut du diplôme
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Charger les notifications de l'étudiant depuis le backend
    fetch(`/api/notifications/${user.id}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Erreur chargement notifications:", err));

    // Charger le statut du diplôme depuis le backend
    fetch(`/api/diplomes/${user.id}`)
      .then((res) => res.json())
      .then((data) => setStatutDiplome(data.statut || "En attente"))
      .catch((err) => console.error("Erreur chargement statut diplôme:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "moyenneGenerale" && isNaN(value)) return;
    if ((name === "filiere" || name === "lieuNaissance") && /\d/.test(value)) return;
    setInfo({ ...info, [name]: value });
  };

  const handleDiplomeUpload = (e) => {
    setDiplome(e.target.files[0]);
  };

  const handleSoumission = async () => {
    if (!diplome) {
      alert("Veuillez sélectionner un diplôme avant de soumettre.");
      return;
    }

    const formData = new FormData();
    formData.append("file", diplome);
    formData.append("etudiantId", user.id);
    formData.append("info", JSON.stringify(info));

    try {
      const response = await fetch("/api/diplomes", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStatutDiplome("En attente");
        alert("Diplôme soumis avec succès !");
      } else {
        alert("Erreur lors de la soumission du diplôme.");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      alert("Une erreur est survenue.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-3xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-center mb-6">Bienvenue, {user.nom} !</h2>

      <p className="text-lg font-semibold text-center text-gray-700 mb-4">
        Statut du diplôme : <span className={`font-bold ${statutDiplome === "Validé" ? "text-green-500" : statutDiplome === "Refusé" ? "text-red-500" : "text-orange-500"}`}>
          {statutDiplome}
        </span>
      </p>

      <label className="block font-semibold text-lg">Filière :</label>
      <input type="text" name="filiere" value={info.filiere} onChange={handleChange} className="p-2 border rounded w-full" />

      <label className="block font-semibold text-lg mt-4">Niveau :</label>
      <select name="niveau" value={info.niveau} onChange={handleChange} className="p-2 border rounded w-full">
        <option value="Licence">Licence</option>
        <option value="Master 1">Master 1</option>
        <option value="Master 2">Master 2</option>
        <option value="Doctorat">Doctorat</option>
      </select>

      <label className="block font-semibold text-lg mt-4">Date de naissance :</label>
      <input type="date" name="dateNaissance" value={info.dateNaissance} onChange={handleChange} className="p-2 border rounded w-full" />

      <label className="block font-semibold text-lg mt-4">Lieu de naissance :</label>
      <input type="text" name="lieuNaissance" value={info.lieuNaissance} onChange={handleChange} className="p-2 border rounded w-full" />

      <label className="block font-semibold text-lg mt-4">Moyenne Générale :</label>
      <input type="text" name="moyenneGenerale" value={info.moyenneGenerale} onChange={handleChange} className="p-2 border rounded w-full" />

      <label className="block font-semibold text-lg mt-4">Soumettre un diplôme :</label>
      <input type="file" accept=".pdf" onChange={handleDiplomeUpload} className="p-2 border rounded w-full" />
      {diplome && <p className="text-green-600 mt-2">{diplome.name} sélectionné</p>}

      <div className="flex flex-col gap-4 mt-6">
        <button onClick={handleSoumission} className="p-3 bg-blue-500 text-white rounded-lg w-full hover:bg-blue-600 transition">
          Soumettre mon diplôme
        </button>
        <button onClick={() => setShowNotifications(!showNotifications)} className="p-3 bg-gray-500 text-white rounded-lg w-full hover:bg-gray-600 transition">
          Mes notifications
        </button>
        <button onClick={logout} className="p-3 bg-red-500 text-white rounded-lg w-full hover:bg-red-600 transition">
          Se Déconnecter
        </button>
      </div>

      {showNotifications && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold">Notifications :</h3>
          {notifications.length > 0 ? (
            <ul className="list-disc pl-6 text-gray-700">
              {notifications.map((notif, index) => <li key={index}>{notif}</li>)}
            </ul>
          ) : (
            <p>Aucune notification</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EtudiantDashboard;
