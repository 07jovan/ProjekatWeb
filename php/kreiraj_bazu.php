<?php
include_once "konekcija_sa_bazom.php";

$baza->exec("CREATE TABLE IF NOT EXISTS kartice (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    naziv TEXT,
    nivo INTEGER,
    tip TEXT,
    napad INTEGER,
    odbrana INTEGER,
    moc INTEGER,
    kategorija TEXT,
    opis TEXT,
    slika TEXT
)");
?>