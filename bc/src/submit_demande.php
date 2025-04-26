<?php
$mysqli = new mysqli("localhost", "root", "root", "diplomas");

$filiere = $_POST['filiere'];
$lieu_naissance = $_POST['lieu_naissance'];
$date_naissance = $_POST['date_naissance'];
$moyenne = $_POST['moyenne'];
$utilisateur_id = $_POST['utilisateur_id'];

// fichiers PDF : mémoire ou relevé
$doc_path = ""; // à gérer côté front avec move_uploaded_file()

$stmt = $mysqli->prepare("INSERT INTO demande_etudiant (filiere, lieu_naissance, date_naissance, moyenne, document, utilisateur_id) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssdsi", $filiere, $lieu_naissance, $date_naissance, $moyenne, $doc_path, $utilisateur_id);

if ($stmt->execute()) {
    echo "Demande soumise avec succès";
} else {
    echo "Erreur : " . $stmt->error;
}

$stmt->close();
$mysqli->close();
?>
