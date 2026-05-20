<?php
include "konekcija_sa_bazom.php";

$id = $_POST["id"];
$naziv = $_POST["naziv"];
$nivo = $_POST["nivo"];
$tip = $_POST["tip"];
$napad = $_POST["napad"];
$odbrana = $_POST["odbrana"];
$moc = $_POST["moc"];
$kategorija = $_POST["kategorija"];
$opis = $_POST["opis"];

$staraSlikaUpit = $baza->prepare("SELECT slika FROM kartice WHERE id = :id");
$staraSlikaUpit->bindValue(":id", $id);
$staraSlikaRez = $staraSlikaUpit->execute();
$staraSlikaRed = $staraSlikaRez->fetchArray(SQLITE3_ASSOC);
$nazivSlike = $staraSlikaRed["slika"];

if (isset($_FILES["slika"]) && $_FILES["slika"]["error"] == 0) {
    $folder = __DIR__ . "/../uploads/";
    if (!file_exists($folder)) {
        mkdir($folder, 0777, true);
    }
    $ekstenzija = pathinfo($_FILES["slika"]["name"], PATHINFO_EXTENSION);
    $noviNaziv = time() . "_" . rand(1000, 9999) . "." . $ekstenzija;
    if (move_uploaded_file($_FILES["slika"]["tmp_name"], $folder . $noviNaziv)) {
        $nazivSlike = $noviNaziv;
    }
}

$upit = $baza->prepare("UPDATE kartice SET naziv = :naziv, nivo = :nivo, tip = :tip, napad = :napad, 
                        odbrana = :odbrana, moc = :moc, kategorija = :kategorija, opis = :opis, slika = :slika 
                        WHERE id = :id");

$upit->bindValue(":id", $id);
$upit->bindValue(":naziv", $naziv);
$upit->bindValue(":nivo", $nivo);
$upit->bindValue(":tip", $tip);
$upit->bindValue(":napad", $napad);
$upit->bindValue(":odbrana", $odbrana);
$upit->bindValue(":moc", $moc);
$upit->bindValue(":kategorija", $kategorija);
$upit->bindValue(":opis", $opis);
$upit->bindValue(":slika", $nazivSlike);

if ($upit->execute()) {
    echo "Podaci o kartici uspešno izmenjeni.";
} else {
    echo "Greška pri izmeni.";
}
?>