var sveKartice = [];

var btnDodajKarticu = document.getElementById("btnDodajKarticu");
var btnPrikaziKartice = document.getElementById("btnPrikaziKartice");
var btnPrimeni = document.getElementById("btnPrimeni");
var btnSacuvajIzmene = document.getElementById("btnSacuvajIzmene");

var formaSekcija = document.getElementById("formaSekcija");
var karticeSekcija = document.getElementById("karticeSekcija");

var cardForm = document.getElementById("cardForm");
var editForm = document.getElementById("editForm");

var nazivInput = document.getElementById("naziv");
var nivoInput = document.getElementById("nivo");
var napadInput = document.getElementById("napad");
var odbranaInput = document.getElementById("odbrana");
var opisInput = document.getElementById("opis");

var filterKategorija = document.getElementById("filterKategorija");
var sortiranje = document.getElementById("sortiranje");

var karticeContainer = document.getElementById("karticeContainer");
var brojKartica = document.getElementById("brojKartica");

var modalUredi = new bootstrap.Modal(document.getElementById("modalUredi"));

btnDodajKarticu.addEventListener("click", prikaziFormu);
btnPrikaziKartice.addEventListener("click", ucitajKartice);
btnPrimeni.addEventListener("click", prikaziHTMLKartice);
cardForm.addEventListener("submit", dodajKarticu);
btnSacuvajIzmene.addEventListener("click", sacuvajIzmene);

function prikaziFormu() {
  formaSekcija.classList.remove("d-none");
  karticeSekcija.classList.add("d-none");
}

function dodajKarticu(e) {
  e.preventDefault();

  var naziv = nazivInput.value.trim();
  var nivo = parseInt(nivoInput.value);
  var napad = parseInt(napadInput.value) || 0;
  var odbrana = parseInt(odbranaInput.value) || 0;
  var opis = opisInput.value.trim();

  var tipRadio = document.querySelector('input[name="tip"]:checked');
  var tip = tipRadio ? tipRadio.value : "Čudovište";

  if (naziv == "" || isNaN(nivo) || nivo < 0) {
    alert("Unesi ispravan naziv i nivo kartice.");
    return;
  }

  var moc = napad + odbrana;
  var kategorija = odrediKategorijuMoci(moc);

  var podaci = new FormData(cardForm);
  podaci.append("moc", moc);
  podaci.append("kategorija", kategorija);

  var zahtev = new XMLHttpRequest();
  zahtev.open("POST", "php/dodaj_karticu.php", true);
  zahtev.onload = function () {
    alert(zahtev.responseText);
    cardForm.reset();
    document.getElementById("tipCudoviste").checked = true;
    ucitajKartice();
  };
  zahtev.send(podaci);
}

function odrediKategorijuMoci(moc) {
  if (moc < 2000) return "Slaba";
  if (moc < 4000) return "Srednja";
  if (moc < 6000) return "Jaka";
  return "Legendarna";
}

function ucitajKartice() {
  formaSekcija.classList.add("d-none");
  karticeSekcija.classList.remove("d-none");

  var zahtev = new XMLHttpRequest();
  zahtev.open("GET", "php/prikazi_kartice.php", true);
  zahtev.onload = function () {
    sveKartice = JSON.parse(zahtev.responseText);
    prikaziHTMLKartice();
  };
  zahtev.send();
}

function prikaziHTMLKartice() {
  karticeContainer.innerHTML = "";
  var listaZaPrikaz = [...sveKartice];
  var kategorijaFilter = filterKategorija.value;

  if (kategorijaFilter != "Sve") {
    listaZaPrikaz = listaZaPrikaz.filter(k => k.kategorija == kategorijaFilter);
  }

  var nacinSortiranja = sortiranje.value;
  if (nacinSortiranja == "min-max") {
    listaZaPrikaz.sort((a, b) => a.moc - b.moc);
  } else if (nacinSortiranja == "max-min") {
    listaZaPrikaz.sort((a, b) => b.moc - a.moc);
  }

  brojKartica.textContent = listaZaPrikaz.length + " kartica";

  if (listaZaPrikaz.length == 0) {
    karticeContainer.innerHTML =
      '<div class="col-12"><div class="empty-box p-5 text-center"><h4 class="mb-2">Nema kartica</h4><p class="text-muted mb-0">Dodaj karticu ili promeni filter.</p></div></div>';
    return;
  }

  for (var i = 0; i < listaZaPrikaz.length; i++) {
    var k = listaZaPrikaz[i];
    var linija = "";
    var badge = "";

    if (k.kategorija == "Slaba") { linija = "line-slaba"; badge = "text-bg-secondary"; }
    else if (k.kategorija == "Srednja") { linija = "line-srednja"; badge = "text-bg-success"; }
    else if (k.kategorija == "Jaka") { linija = "line-jaka"; badge = "text-bg-warning"; }
    else { linija = "line-legendarna"; badge = "text-bg-danger"; }

    var opisTekst = k.opis ? k.opis : "Nema efekta/opisa.";
    var slikaHTML = k.slika ? '<img src="uploads/' + k.slika + '" class="card-img-top slika-pacijenta">' : '';

    var karticaElement = document.createElement("div");
    karticaElement.className = "col-12 col-md-6 col-xl-4";
    karticaElement.innerHTML = `
      <div class="card patient-card">
        ${slikaHTML}
        <div class="card-top-line ${linija}"></div>
        <div class="card-body p-4">
          <h4 class="card-title mb-3">${k.naziv}</h4>
          <div class="info-line"><strong>Nivo:</strong> ⭐ ${k.nivo}</div>
          <div class="info-line"><strong>Tip:</strong> ${k.tip}</div>
          <div class="info-line"><strong>ATK:</strong> ${k.napad} | <strong>DEF:</strong> ${k.odbrana}</div>
          <div class="info-line"><strong>Ukupna moć:</strong> ${k.moc}</div>
          <div class="info-line"><strong>Kategorija:</strong> <span class="badge ${badge}">${k.kategorija}</span></div>
          <div class="mt-3"><strong>Opis:</strong><p class="text-muted mb-0">${opisTekst}</p></div>
          <div class="d-flex gap-2 mt-3">
            <button class="btn btn-sm btn-outline-primary btn-uredi">Uredi</button>
            <button class="btn btn-sm btn-outline-danger btn-obrisi">Obriši</button>
          </div>
        </div>
      </div>`;

    var btnUredi = karticaElement.querySelector(".btn-uredi");
    var btnObrisi = karticaElement.querySelector(".btn-obrisi");

    (function (karticaData) {
      btnUredi.addEventListener("click", function () { otvoriUrediModal(karticaData); });
      btnObrisi.addEventListener("click", function () { obrisiKarticu(karticaData.id, karticaData.naziv); });
    })(k);

    karticeContainer.appendChild(karticaElement);
  }
}

function otvoriUrediModal(k) {
  document.getElementById("editId").value = k.id;
  document.getElementById("editNaziv").value = k.naziv;
  document.getElementById("editNivo").value = k.nivo;
  document.getElementById("editNapad").value = k.napad;
  document.getElementById("editOdbrana").value = k.odbrana;
  document.getElementById("editOpis").value = k.opis || "";
  document.getElementById("editSlika").value = "";

  var polRadios = document.querySelectorAll('input[name="tip"]');
  for (var i = 0; i < polRadios.length; i++) {
    polRadios[i].checked = polRadios[i].value === k.tip;
  }
  modalUredi.show();
}

function sacuvajIzmene() {
  var id = document.getElementById("editId").value;
  var naziv = document.getElementById("editNaziv").value.trim();
  var nivo = parseInt(document.getElementById("editNivo").value);
  var napad = parseInt(document.getElementById("editNapad").value) || 0;
  var odbrana = parseInt(document.getElementById("editOdbrana").value) || 0;

  if (naziv == "" || isNaN(nivo) || nivo < 0) {
    alert("Unesi ispravan naziv i nivo.");
    return;
  }

  var moc = napad + odbrana;
  var kategorija = odrediKategorijuMoci(moc);

  var podaci = new FormData(editForm);
  podaci.append("moc", moc);
  podaci.append("kategorija", kategorija);

  var zahtev = new XMLHttpRequest();
  zahtev.open("POST", "php/uredi_karticu.php", true);
  zahtev.onload = function () {
    alert(zahtev.responseText);
    modalUredi.hide();
    ucitajKartice();
  };
  zahtev.send(podaci);
}

function obrisiKarticu(id, naziv) {
  if (!confirm('Da li sigurno želiš da obrišeš karticu "' + naziv + '"?')) return;

  var podaci = new FormData();
  podaci.append("id", id);

  var zahtev = new XMLHttpRequest();
  zahtev.open("POST", "php/obrisi_karticu.php", true);
  zahtev.onload = function () {
    alert(zahtev.responseText);
    ucitajKartice();
  };
  zahtev.send(podaci);
}