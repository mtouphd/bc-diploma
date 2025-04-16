import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EnseignantAccueil.css";

const EnseignantAccueil = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [view, setView] = useState("promotion");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [grade, setGrade] = useState("Maître Assistant B");
  const [experience, setExperience] = useState("");
  const [encadrements, setEncadrements] = useState(0);
  const [publications, setPublications] = useState(0);
  const [seminaires, setSeminaires] = useState(0);
  const [memoiresEncadrement, setMemoiresEncadrement] = useState([]);
  const [memoiresPublication, setMemoiresPublication] = useState([]);
  const [statutPromotion, setStatutPromotion] = useState(localStorage.getItem("statutPromotion") || "non soumis");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
    }
  }, [navigate]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
    toast.info(`Mode ${darkMode ? "clair" : "sombre"} activé`);
  };

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const handleFileChange = (e, setter, maxFiles) => {
    const files = Array.from(e.target.files);
    if (files.length !== maxFiles) {
      alert(`Vous devez télécharger exactement ${maxFiles} fichiers.`);
      return;
    }
    setter(files);
  };

  const isFormValid = () => {
    return (
      experience > 0 &&
      encadrements > 0 &&
      publications > 0 &&
      seminaires > 0 &&
      memoiresEncadrement.length === encadrements &&
      memoiresPublication.length === publications
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    toast.success("Déconnexion réussie");
  };

  return (
    <div className="container">
      <ToastContainer />
      <div className="header">
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          <FiMoreVertical size={24} />
        </div>
        {menuOpen && (
          <div className="dropdown-menu">
            <button onClick={() => toast.info("Notifications")}>🔔 Notifications</button>
            <button onClick={handleLogout}>🚪 Déconnexion</button>
          </div>
        )}
        <button onClick={toggleDarkMode} className="dark-mode-toggle">
          {darkMode ? "Mode Clair" : "Mode Sombre"}
        </button>
      </div>

      <div className="menu-lateral">
        <h2>Système de Promotion</h2>
        <button className={view === "promotion" ? "active" : ""} onClick={() => setView("promotion")}>
          📄 Demande de Promotion
        </button>
        <button className={view === "statut" ? "active" : ""} onClick={() => setView("statut")}>
          📊 Voir mon statut
        </button>
        <button className={view === "etudiants" ? "active" : ""} onClick={() => setView("etudiants")}>
          🎓 Voir la liste des étudiants
        </button>
      </div>

      <div className="contenu">
        <div className="contenu-box">
          <div className="canvas-container">
            <Canvas>
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <Box position={[-1.2, 0, 0]}>
                <meshStandardMaterial attach="material" color="orange" />
              </Box>
              <Box position={[1.2, 0, 0]}>
                <meshStandardMaterial attach="material" color="blue" />
              </Box>
              <OrbitControls />
            </Canvas>
          </div>
          {view === "promotion" ? (
            <>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h2>Soumettre une demande de promotion</h2>
              </motion.div>

              <form className="formulaire">
                <div className="form-group">
                  <label>Grade :</label>
                  <select value={grade} onChange={(e) => setGrade(e.target.value)}>
                    <option value="Maître Assistant B">Maître Assistant B</option>
                    <option value="Maître Assistant A">Maître Assistant A</option>
                    <option value="Professeur">Professeur</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Années d'expérience :</label>
                  <input
                    type="number"
                    value={experience}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (val > 0 && val < 50) setExperience(val);
                    }}
                  />
                </div>

                <div className="form-group">
                  <label>Nombre d'encadrements :</label>
                  <input
                    type="number"
                    value={encadrements}
                    onChange={(e) => setEncadrements(parseInt(e.target.value, 10) || 0)}
                  />
                  <input type="file" multiple onChange={(e) => handleFileChange(e, setMemoiresEncadrement, encadrements)} />
                </div>

                <div className="form-group">
                  <label>Nombre de publications :</label>
                  <input
                    type="number"
                    value={publications}
                    onChange={(e) => setPublications(parseInt(e.target.value, 10) || 0)}
                  />
                  <input type="file" multiple onChange={(e) => handleFileChange(e, setMemoiresPublication, publications)} />
                </div>

                <div className="form-group">
                  <label>Nombre de séminaires pédagogiques :</label>
                  <input
                    type="number"
                    value={seminaires}
                    onChange={(e) => setSeminaires(parseInt(e.target.value, 10) || 0)}
                  />
                </div>

                <button type="submit" disabled={!isFormValid()} className={isFormValid() ? "valide" : "desactive"}>
                  Soumettre
                </button>
              </form>
            </>
          ) : view === "statut" ? (
            <>
              <h2>État de la demande</h2>
              <p>
                Statut :{" "}
                {statutPromotion === "non soumis" ? (
                  <span className="statut-non-soumis">Vous n'avez pas encore soumis une demande</span>
                ) : (
                  <span className="statut-attente">En attente</span>
                )}
              </p>
            </>
          ) : (
            <>
              <h2>Liste des étudiants</h2>
              <p>⚡ Fonctionnalité à implémenter pour examiner les étudiants.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnseignantAccueil;