<?php
// Paramètres de connexion
$host = 'localhost';
$user = 'root';
$pass = 'root';
$dbname = 'diplomas';

// Connexion à la base de données
$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die("Erreur de connexion : " . $conn->connect_error);
}

// Récupération des données du formulaire
$nom = $_POST['nom'] ?? '';
$prenom = $_POST['prenom'] ?? '';
$telephone = $_POST['telephone'] ?? '';
$email = $_POST['email'] ?? '';
$password = password_hash($_POST['password'] ?? '', PASSWORD_BCRYPT);
$role_nom = $_POST['role'] ?? '';

// Vérification des champs obligatoires
if (empty($nom) || empty($prenom) || empty($telephone) || empty($email) || empty($password) || empty($role_nom)) {
    die("Tous les champs sont obligatoires.");
}

// Récupération de l'ID du rôle
$stmt = $conn->prepare("SELECT id FROM role WHERE nom = ?");
$stmt->bind_param("s", $role_nom);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("Rôle invalide.");
}
$role_id = $result->fetch_assoc()['id'];

// Insertion de l'utilisateur
$stmt_user = $conn->prepare("
    INSERT INTO utilisateur (nom, prenom, telephone, email, password, role_id)
    VALUES (?, ?, ?, ?, ?, ?)
");
$stmt_user->bind_param("sssssi", $nom, $prenom, $telephone, $email, $password, $role_id);

if ($stmt_user->execute()) {
    echo "✅ Utilisateur enregistré avec succès.";
} else {
    echo "❌ Erreur lors de l'enregistrement : " . $stmt_user->error;
}

$conn->close();
?>
