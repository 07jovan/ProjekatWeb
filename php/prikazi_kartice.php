<?php
include "konekcija_sa_bazom.php";

$rezultat = $baza->query("SELECT * FROM kartice ORDER BY id DESC");
$kartice = array();

while ($red = $rezultat->fetchArray(SQLITE3_ASSOC)) {
    $kartice[] = $red;
}

echo json_encode($kartice, JSON_UNESCAPED_UNICODE);
?>