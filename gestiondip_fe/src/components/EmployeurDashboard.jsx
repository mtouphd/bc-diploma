import { useContext, useState } from "react";
import { AuthContext } from "../context";

const EnseignantDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [info, setInfo] = useState({ specialite: "" });

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Bienvenue, {user.nom} 👋</h1>
      <p>Email : {user.email}</p>
      <p>Rôle : {user.role}</p>

      <h2 className="mt-4 text-xl">Informations Enseignant</h2>
      <input type="text" name="specialite" value={info.specialite} onChange={handleChange} placeholder="Spécialité" className="border p-2 rounded w-full" />

      <button onClick={logout} className="mt-4 p-2 bg-red-500 text-white rounded">
        Déconnexion
      </button>
    </div>
  );
};

export default EnseignantDashboard;
