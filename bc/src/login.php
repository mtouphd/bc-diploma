<?php
$mysqli = new mysqli("localhost", "root", "root", "diplomas");

$email = $_POST['email'];
$password = $_POST['password'];

$stmt = $mysqli->prepare("SELECT id, password, role_id FROM utilisateur WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    if (password_verify($password, $row['password'])) {
        echo json_encode([
            "message" => "Connexion réussie",
            "user_id" => $row['id'],
            "role_id" => $row['role_id']
        ]);
    } else {
        echo json_encode(["message" => "Mot de passe incorrect"]);
    }
} else {
    echo json_encode(["message" => "Email non trouvé"]);
}

$stmt->close();
$mysqli->close();
?>
