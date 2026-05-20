<?php
session_start();

if (!isset($_SESSION["ulogovan"])) {
    header("Location: login.php");
    exit();
}

// Automatski kreira bazu i tabelu ako ne postoje kada pokreneš sajt
include "php/kreiraj_bazu.php";

readfile("index.html");
?>