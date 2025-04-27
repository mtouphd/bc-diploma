import { useContext } from "react";
import { AuthContext } from "../context";

const JuryDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Bienvenue, {user.nom} 👋</h1>
      <p>Email : {user.email}</p>
      <p>Rôle : {user.role}</p>

      <h2 className="mt-4 text-xl">Tableau de bord Jury</h2>
      <p>Ici, vous pouvez examiner les promotions des enseignants.</p>

      <button onClick={logout} className="mt-4 p-2 bg-red-500 text-white rounded">
        Déconnexion
      </button>
    </div>
  );
};

export default JuryDashboard;
