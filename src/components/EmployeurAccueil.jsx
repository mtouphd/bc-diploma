import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EmployeurAccueil.css";

const EmployeurAccueil = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [view, setView] = useState("dashboard"); // Vue par défaut
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user || JSON.parse(user).role !== "employeur") {
      navigate("/"); // Rediriger si l'utilisateur n'est pas un employeur
    }
  }, [navigate]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
    toast.info(`Mode ${darkMode ? "clair" : "sombre"} activé`);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    toast.success("Déconnexion réussie");
  };

  const handleAccessDatabase = () => {
    setView("database");
    toast.info("Accès à la base de données !");
    // l'endroit ou vous pouvez ajouter la logique pour accder a la base de donne
  };

  const handleAccessBlockchain = () => {
    setView("blockchain");
    toast.info("Accès à la blockchain !");
    // l'endroit ou vous pouvez ajouter la logique pour accder a la blockchain
  };

  return (
    <div className={`container ${darkMode ? "dark-mode" : ""}`}>
      <ToastContainer />
      {/* Barre supérieure */}
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

      {/* Menu latéral */}
      <div className="menu-lateral">
        <h2>Tableau de bord Employeur</h2>
        <button className={view === "database" ? "active" : ""} onClick={handleAccessDatabase}>
          🗄️ Accéder à la base de données
        </button>
        <button className={view === "blockchain" ? "active" : ""} onClick={handleAccessBlockchain}>
          🔗 Accéder à la blockchain
        </button>
      </div>

      {/* Contenu dynamique */}
      <div className="contenu">
        <div className="contenu-box">
          {view === "database" && (
            <>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h2>Base de données</h2>
              </motion.div>
              <p>⚡ Fonctionnalité pour interagir avec la base de données.</p>
            </>
          )}

          {view === "blockchain" && (
            <>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h2>Blockchain</h2>
              </motion.div>
              <p>⚡ Fonctionnalité pour interagir avec la blockchain.</p>
            </>
          )}

          {view === "dashboard" && (
            <>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h2>Bienvenue dans votre tableau de bord</h2>
              </motion.div>
              <p>Utilisez le menu pour naviguer entre les différentes sections.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeurAccueil;