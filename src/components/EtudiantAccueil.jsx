import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMoreVertical, FiBell, FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";
import "./EtudiantAccueil.css";

const EtudiantAccueil = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState("accueil"); // Changed default view
  const navigate = useNavigate();
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [statutDemande, setStatutDemande] = useState(localStorage.getItem("statutDemande") || "non soumis");
  const [filiere, setFiliere] = useState("");
  const [lieuNaissance, setLieuNaissance] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [files, setFiles] = useState([]);
  const [moyennes, setMoyennes] = useState([]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
    }
  }, [navigate]);

  const handleTextChange = (e, setState) => {
    const value = e.target.value;
    if (/^[A-Za-zÀ-ÿ\s'-]*$/.test(value)) {
      setState(value);
    }
  };

  const handleFileChange = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles(uploadedFiles);
    setMoyennes(new Array(uploadedFiles.length).fill(""));
  };

  const handleMoyenneChange = (index, value) => {
    if (!isNaN(value) && value >= 0 && value <= 20) {
      const updatedMoyennes = [...moyennes];
      updatedMoyennes[index] = value;
      setMoyennes(updatedMoyennes);
    }
  };

  const isFormValid = () => {
    return (
      filiere.trim() !== "" &&
      lieuNaissance.trim() !== "" &&
      dateNaissance.trim() !== "" &&
      files.length > 0 &&
      moyennes.every((moy) => moy !== "" && moy >= 0 && moy <= 20)
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      const user = JSON.parse(localStorage.getItem("user"));
      const demandes = JSON.parse(localStorage.getItem("demandes")) || [];
      
      const nouvelleDemande = {
        id: Date.now(),
        etudiant: {
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          filiere,
          lieuNaissance,
          dateNaissance,
          moyennes,
        },
        fichiers: files.map((file) => file.name),
        statut: "En attente",
      };
      
      demandes.push(nouvelleDemande);
      localStorage.setItem("demandes", JSON.stringify(demandes));
      setStatutDemande("en attente");
      localStorage.setItem("statutDemande", "en attente");
      alert("Votre demande a été soumise avec succès !");
    }
  };

  return (
    <div className="container">
      {/* Header avec message de bienvenue */}
      <div className="welcome-header">
        <div className="welcome-message">
          Bienvenue au portail étudiant
        </div>
        <div className="actions">
  <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
    <FiMoreVertical size={24} />
  </div>
  {menuOpen && (
    <div className="dropdown-menu">
      <button onClick={() => alert("Notifications")}>
        <FiBell size={18} />
        Notifications
      </button>
      <button onClick={handleLogout}>
        <FiLogOut size={18} />
        Déconnexion
      </button>
    </div>
  )}
</div>
      </div>

      {/* Menu latéral */}
      <div className="menu-lateral">
        <h2>Système de Diplômes</h2>
        <button 
          className={view === "accueil" ? "active" : ""} 
          onClick={() => setView("accueil")}
        >
          Accueil
        </button>
        <button 
          className={view === "demande" ? "active" : ""} 
          onClick={() => setView("demande")}
        >
          Soumettre une demande
        </button>
        <button 
          className={view === "statut" ? "active" : ""} 
          onClick={() => setView("statut")}
        >
          Voir mon statut
        </button>
      </div>

      {/* Contenu dynamique */}
      <div className="contenu">
        <div className="contenu-box">
          {view === "accueil" ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2>Tableau de bord</h2>
              <p>Bienvenue sur votre espace étudiant</p>
            </motion.div>
          ) : view === "demande" ? (
            // Existing demande content
            <>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h2>Soumettre une demande</h2>
              </motion.div>
              <form onSubmit={handleSubmit} className="formulaire">
                {/* ...existing form content... */}
                <div className="form-group">
                  <label>Filière :</label>
                  <input type="text" value={filiere} onChange={(e) => handleTextChange(e, setFiliere)} />
                </div>

                <div className="form-group">
                  <label>Lieu de naissance :</label>
                  <input type="text" value={lieuNaissance} onChange={(e) => handleTextChange(e, setLieuNaissance)} />
                </div>

                <div className="form-group">
                  <label>Date de naissance :</label>
                  <input type="date" value={dateNaissance} onChange={(e) => setDateNaissance(e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Document PDF :</label>
                  <input type="file" multiple accept=".pdf" onChange={handleFileChange} />
                </div>

                {files.length > 0 && (
                  <div className="form-group">
                    <h3>Fichiers sélectionnés :</h3>
                    <ul>
                      {files.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>

                    <h3>Moyennes des années :</h3>
                    {files.map((_, index) => (
                      <div key={index} className="moyenne-group">
                        <label>Moyenne {index + 1}ᵉ année :</label>
                        <input
                          type="number"
                          value={moyennes[index] || ""}
                          onChange={(e) => handleMoyenneChange(index, e.target.value)}
                          min="0"
                          max="20"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!isFormValid()}
                  className={isFormValid() ? "valide" : "desactive"}
                >
                  Soumettre
                </button>
              </form>
            </>
          ) : (
            <>
              <h2>État de la demande</h2>
              <p>
                Statut : {statutDemande === "non soumis" ? (
                  <span className="statut-non-soumis">Vous n'avez pas encore soumis une demande</span>
                ) : (
                  <span className="statut-attente">En attente</span>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EtudiantAccueil;