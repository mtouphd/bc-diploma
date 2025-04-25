import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMoreVertical, FiBell, FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./JuryAccueil.css";

const JuryAccueil = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState("accueil");
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
    }
    // Charger les demandes depuis le localStorage
    const storedDemandes = JSON.parse(localStorage.getItem("demandes")) || [];
    setDemandes(storedDemandes);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    toast.success("Déconnexion réussie");
  };

  const handleValiderDemande = (demandeId) => {
    const updatedDemandes = demandes.map(demande => {
      if (demande.id === demandeId) {
        return { ...demande, statut: "Validé" };
      }
      return demande;
    });
    setDemandes(updatedDemandes);
    localStorage.setItem("demandes", JSON.stringify(updatedDemandes));
    toast.success("Demande validée avec succès");
  };

  const handleRefuserDemande = (demandeId) => {
    const updatedDemandes = demandes.map(demande => {
      if (demande.id === demandeId) {
        return { ...demande, statut: "Refusé" };
      }
      return demande;
    });
    setDemandes(updatedDemandes);
    localStorage.setItem("demandes", JSON.stringify(updatedDemandes));
    toast.error("Demande refusée");
  };

  return (
    <div className="container">
      <ToastContainer />
      <div className="welcome-header">
        <div className="welcome-message">
          Bienvenue au portail jury
        </div>
        <div className="actions">
          <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
            <FiMoreVertical size={24} />
          </div>
          {menuOpen && (
            <div className="dropdown-menu">
              <button onClick={() => toast.info("Notifications")}>
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

      <div className="menu-lateral">
        <h2>Système de Validation</h2>
        <button 
          className={view === "accueil" ? "active" : ""} 
          onClick={() => setView("accueil")}
        >
          Accueil
        </button>
        <button 
          className={view === "demandes" ? "active" : ""} 
          onClick={() => setView("demandes")}
        >
          Demandes en attente
        </button>
        <button 
          className={view === "historique" ? "active" : ""} 
          onClick={() => setView("historique")}
        >
          Historique
        </button>
      </div>

      <div className="contenu">
        <div className="contenu-box">
          {view === "accueil" ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2>Tableau de bord</h2>
              <p>Bienvenue sur votre espace jury</p>
              <div className="statistics">
                <p>Demandes en attente : {demandes.filter(d => d.statut === "En attente").length}</p>
                <p>Demandes traitées : {demandes.filter(d => d.statut !== "En attente").length}</p>
              </div>
            </motion.div>
          ) : view === "demandes" ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2>Demandes en attente</h2>
              <div className="table-container">
                {demandes.filter(d => d.statut === "En attente").length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Filière</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demandes
                        .filter(demande => demande.statut === "En attente")
                        .map(demande => (
                          <tr key={demande.id}>
                            <td>{demande.etudiant.nom}</td>
                            <td>{demande.etudiant.prenom}</td>
                            <td>{demande.etudiant.filiere}</td>
                            <td className="actions-cell">
                              <button 
                                className="valide"
                                onClick={() => handleValiderDemande(demande.id)}
                              >
                                Valider
                              </button>
                              <button 
                                className="refuser"
                                onClick={() => handleRefuserDemande(demande.id)}
                              >
                                Refuser
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="empty-message">Aucune demande en attente</p>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2>Historique des demandes</h2>
              <div className="table-container">
                {demandes.filter(d => d.statut !== "En attente").length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Filière</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demandes
                        .filter(demande => demande.statut !== "En attente")
                        .map(demande => (
                          <tr key={demande.id}>
                            <td>{demande.etudiant.nom}</td>
                            <td>{demande.etudiant.prenom}</td>
                            <td>{demande.etudiant.filiere}</td>
                            <td className={`statut-${demande.statut.toLowerCase()}`}>
                              {demande.statut}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="empty-message">Aucune demande traitée</p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JuryAccueil;