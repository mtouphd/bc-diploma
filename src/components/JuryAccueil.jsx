import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMoreVertical, FiList, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./JuryAccueil.css";

const JuryAccueil = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [view, setView] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user || JSON.parse(user).role !== "jury") {
      navigate("/");
    }
  }, [navigate]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    toast.success("Déconnexion réussie");
  };

  const handleViewDemandes = () => {
    setView("demandes");
    setLoading(true);
    // À remplacer par l'appel API
    setLoading(false);
  };

  const handleAccept = async (id) => {
    try {
      // À remplacer par l'appel API
      toast.success("Demande acceptée");
    } catch (error) {
      toast.error("Erreur lors de l'acceptation");
    }
  };

  const handleReject = async (id) => {
    try {
      // À remplacer par l'appel API
      toast.error("Demande refusée");
    } catch (error) {
      toast.error("Erreur lors du refus");
    }
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
        <h2>Tableau de bord Jury</h2>
        <button 
          className={`menu-button ${view === "demandes" ? "active" : ""}`}
          onClick={handleViewDemandes}
        >
          <FiList /> Liste des demandes
        </button>
      </div>

      {/* Contenu principal */}
      <div className="contenu">
        <div className="contenu-box">
          {view === "demandes" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2>Liste des demandes de promotion</h2>
              {loading ? (
                <div className="loading-spinner">Chargement des demandes...</div>
              ) : demandes.length === 0 ? (
                <div className="no-data">
                  Aucune demande de promotion en attente
                </div>
              ) : (
                <div className="demandes-list">
                  {demandes.map((demande) => (
                    <div key={demande.id} className="demande-card">
                      <div className="card-content">
                        <div className="card-header">
                          <h3>Demande de promotion</h3>
                          <span className="statut-badge en-attente">En attente</span>
                        </div>
                        <div className="card-details">
                          <p><strong>Grade actuel :</strong> {demande.gradeActuel}</p>
                          <p><strong>Grade demandé :</strong> {demande.gradeDemande}</p>
                        </div>
                        <div className="card-actions">
                          <button 
                            className="accept-btn"
                            onClick={() => handleAccept(demande.id)}
                          >
                            <FiCheckCircle /> Accepter
                          </button>
                          <button 
                            className="reject-btn"
                            onClick={() => handleReject(demande.id)}
                          >
                            <FiXCircle /> Refuser
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {view === "dashboard" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2>Bienvenue dans votre espace Jury</h2>
              <p>
                Utilisez le menu latéral pour consulter et gérer les demandes 
                de promotion des enseignants.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JuryAccueil;