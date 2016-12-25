<?php
require_once __DIR__ . "/Users.php";

try {
    $pdo = PDOconnect::getInstance();
    $pdo->setParams("localhost", "db", "root", "mysql");
    $result = $pdo->executeRequest($_POST['fetch']);
} catch (PDOException $e) {
    die($e->getMessage());
}
echo json_encode($result);

