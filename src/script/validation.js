const formProposer = document.getElementById("formProposer");
// Section courte description
const nomActiviteEvenement = document.getElementById("nomActiEve");
const description = document.getElementById("description");
const categorie = document.getElementById("categorie");

// Section informations sur l'activité
const nomLieu = document.getElementById("nomLieu");
const adresse = document.getElementById("adresse");
const dateActivite = document.getElementById("dateActivite");
const gratuit = document.getElementById("gratuit");
const prix = document.getElementById("prix");
const ageRecommande = document.getElementById("ageRecommande");
const siteWeb = document.getElementById("siteWeb");

// Section du contact
const prenomProp = document.getElementById("prenomProp");
const nomProp = document.getElementById("nomProp");
const courriel = document.getElementById("courriel");
const telephone = document.getElementById("telephone");
const conditions = document.getElementById("conditions");


formProposer.addEventListener("submit", (event) => {
    if (!validateForm()) {
        event.preventDefault();
    }
});

// form.addEventListener("submit", (event) => {
//     event.preventDefault();

//     validateForm();
// });

function validateForm() {

    let noError = true;


    // Section courte description
    // Validation du nom de l'activité (Requis)
    if (nomActiviteEvenement.value.trim() === "") {
        setError(nomActiviteEvenement, "Le nom de l'activité est requis");
        noError = false;
    } else {
        setSuccess(nomActiviteEvenement);
    }

    // Validation de la description (Requis)
    if (description.value.trim() === "") {
        setError(description, "La description est requise")
        noError = false;
    } else {
        setSuccess(description);
    }

    // Validation de la catégorie (Requis)
    if (categorie.value === "") {
        setError(categorie, "Veuillez choisir une catégorie");
        noError = false;
    } else {
        setSuccess(categorie);
    }


    // Section informations sur l'activité
    // Validation du nom du lieu (Requis)
    if (nomLieu.value.trim() === "") {
        setError(nomLieu, "Le nom du lieu est requis");
        noError = false;
    } else {
        setSuccess(nomLieu);
    }

    // Validation de l'adresse (Requis)
    if (adresse.value.trim() === "") {
        setError(adresse, "L'adresse est requise");
        noError = false;
    } else {
        setSuccess(adresse);
    }

    // Validation de la date (Requis)
    if (dateActivite.value === "") {
        setError(dateActivite, "La date est requise");
        noError = false;
    } else {
        setSuccess(dateActivite);
    }

    // Validation du prix (Requis)
    if (gratuit.value === "") {
        setError(gratuit, "Veuillez choisir une option");
        noError = false;
    } else {
        if (gratuit.value === "non" && prix.value.trim() === "") {
            setError(prix, "Le prix est requis");
            noError = false;
        } else {
            setSuccess(gratuit);
            setSuccess(prix);
        }
    }

    // Validation de l'age recommandé (Requis)
    if (ageRecommande.value === "") {
        setError(ageRecommande, "L'âge recommandé est requis");
        noError = false;
    } else {
        setSuccess(ageRecommande);
    }

    //Validation du site web (Optionnel)
    if (siteWeb.value.trim() !== "" && !siteWeb.value.startsWith("https://")) {
        setError(siteWeb, "Le site web doit commencer par 'https://'");
        noError = false;
    } else {
        setSuccess(siteWeb);
    }

    // Section du contact
    //Validation du prénom (Requis)
    if (prenomProp.value.trim() === "") {
        setError(prenomProp, "Le prénom est requis");
        noError = false;
    } else {
        setSuccess(prenomProp);
    }

    //Validation du nom (Requis)
    if (nomProp.value.trim() === "") {
        setError(nomProp, "Le nom est requis");
        noError = false;
    } else {
        setSuccess(nomProp);
    }

    //Validation du courriel (Requis)
    if (courriel.value.trim() === "") {
        setError(courriel, "Le courriel est requis");
        noError = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(courriel.value.trim())) {
        setError(courriel, "Le courriel n'est pas valide");
        noError = false;
    } else {
        setSuccess(courriel);
    }

    //Validation du téléphone (Optionnel)
    if (telephone.value.trim() !== "" && !/^\d{10}$/.test(telephone.value.trim())) {
        setError(telephone, "Le numéro de téléphone doit contenir 10 chiffres");
        noError = false;
    } else {
        setSuccess(telephone);
    }

    //Validation de la condition d'utilisation (Requis)
    if (!conditions.checked) {
        setError(conditions, "Vous devez accepter les conditions d'utilisation");
        noError = false;
    } else {
        setSuccess(conditions);
    }

    return noError;
};

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector(".errorMessage");

    errorDisplay.innerText = message;
    inputControl.classList.add("error");
    inputControl.classList.remove("success");
};

const setSuccess = (element) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector(".errorMessage");

    errorDisplay.innerText = "";
    inputControl.classList.add("success");
    inputControl.classList.remove("error");
};