<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = file_get_contents('php://input');
    $file = 'data.json';

    if (file_put_contents($file, $data)) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Не вдалося зберегти дані."]);
    }
}
?>
