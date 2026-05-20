<?php
include "konekcija_sa_bazom.php";

$id = $_POST["id"];

$slikaUpit = $baza->prepare("SELECT slika FROM kartice WHERE id = :id");
$slikaUpit->bindValue(":id", $id);
$slikaRez = $slikaUpit->execute();
$slikaRed = $slikaRez->fetchArray(SQLITE3_ASSOC);

if ($slikaRed && $slikaRed["slika"] != "") {
    $putanjaSlike = __DIR__ . "/../uploads/" . $slikaRed["slika"];
    if (file_exists($putanjaSlike)) {
        unlink($putanjaSlike);
    }
}

$upit = $baza->prepare("DELETE FROM kartice WHERE id = :id");
$upit->bindValue(":id", $id);

if ($upit->execute()) {
    echo "Kartica obrisana iz kolekcije.";
} else {
    echo "Greška pri brisanju.";
}
?>