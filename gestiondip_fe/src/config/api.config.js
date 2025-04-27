export const API_URL = 'http://localhost/php';

export const endpoints = {
    login: `${API_URL}/login.php`,
    register: `${API_URL}/register.php`,
    submitDemande: `${API_URL}/submit_demande.php`
};

export const errorMessages = {
    CONNECTION_ERROR: "Erreur de connexion au serveur",
    VALIDATION_ERROR: "Veuillez remplir tous les champs correctement",
    FILE_ERROR: "Erreur lors du téléchargement des fichiers",
    SERVER_ERROR: "Erreur serveur, veuillez réessayer"
};

export const apiHelper = async (endpoint, data, options = {}) => {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            ...options,
            body: data
        });
        
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || errorMessages.SERVER_ERROR);
        }
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};