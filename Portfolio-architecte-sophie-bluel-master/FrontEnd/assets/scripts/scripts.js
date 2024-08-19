let sectionFilter = document.querySelector(".filters");
/* Récupération de la liste des travaux */
const getWorks = async () => {
  const works = await fetch("http://localhost:5678/api/works");

  allWorks = await works.json();
  displayWorks(allWorks);
};

/* Affichage des travaux */
function displayWorks(allWorks) {
  document.querySelector(".gallery").innerHTML = "";
  let gallery = document.querySelector(".gallery");

  for (const i in allWorks) {
    let figure = document.createElement("figure");
    let image = document.createElement("img");
    let figcaption = document.createElement("figcaption");

    image.src = allWorks[i].imageUrl;
    image.alt = allWorks[i].title;
    figcaption.innerText = allWorks[i].title;

    gallery.appendChild(figure);
    figure.appendChild(image);
    figure.appendChild(figcaption);
  }
}
getWorks();
displayFilterButtons();

/* Cette fonction récupère la liste des catégories */
async function getCategories(event) {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error("La requête retourne une erreur", error);
  }
}

/* Cette fonction crée les boutons de catégories et les affiche */
async function displayFilterButtons() {
  document.getElementById("tousBtn").removeAttribute("hidden");
  let categories = await getCategories();
  console.log(categories);
  for (const item of categories) {
    let categoryBtn = document.createElement("button");
    categoryBtn.textContent = item.name;
    categoryBtn.className = "filterCategory";
    categoryBtn.id = item.id;
    sectionFilter.appendChild(categoryBtn);
  }
}

function filterWorks(catId) {
  let categoryId = catId;
  if (!isNaN(parseInt(categoryId))) {
    let works = allWorks.filter(
      (work) => work.categoryId === parseInt(categoryId)
    ); // get works of a specific category
    displayWorks(works);
  } else {
    displayWorks(allWorks);
  }
}
sectionFilter.addEventListener("click", function (event) {
  if (event.target.classList.contains("filterCategory")) {
    filterWorks(event.target.id);
  }
});

function checkLoggedIn() {
  const token = window.sessionStorage.getItem("token");
  const loginBtn = document.getElementById("loginBtn");
  const sectionFilter = document.querySelector(".filters");

  if (token) {
    // L'utilisateur est connecté
    loginBtn.innerText = "Logout";
    // Masquer les filtres
    sectionFilter.style.display = "none";

    // Ajouter un gestionnaire d'événements pour la déconnexion
    loginBtn.addEventListener("click", function () {
      // Supprimer le token de session
      window.sessionStorage.removeItem("token");
      // Rafraîchir la page pour mettre à jour l'état de connexion
      window.location.reload(); // Rafraîchir la page
    });
  } else {
    // L'utilisateur n'est pas connecté
    loginBtn.innerText = "Login";
    // Afficher les filtres
    sectionFilter.style.display = "block";

    // Ajouter un gestionnaire d'événements pour la connexion
    loginBtn.addEventListener("click", function () {
      // Rediriger vers la page de connexion
      window.location.href = "login.html"; // Redirige vers la page de connexion
    });
  }
}

// Appeler la fonction une fois que le DOM est chargé
document.addEventListener("DOMContentLoaded", function () {
  checkLoggedIn();
});

function displayEditButton() {
  const portSection = document.getElementById("portfolio");
  const titleP = portSection.querySelector("h2");

  const editLink = document.createElement("a");
  editLink.className = "editWorks";
  editLink.textContent = "Modifier";

  editLink.addEventListener("click", function () {
    displayGalleryModal(); // Affiche la modal de la galerie
  });

  // Ajouter le lien "Modifier" à la section du portfolio
  const elemTitle = document.createElement("div");
  elemTitle.className = "projectTitle";
  elemTitle.appendChild(titleP);
  elemTitle.appendChild(editLink);
  portSection.insertBefore(elemTitle, portSection.firstChild);
}

// Appeler la fonction une fois que le DOM est chargé
document.addEventListener("DOMContentLoaded", function () {
  displayEditButton();
});

function displayGalleryModal() {
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const closeModalBtn = document.createElement("span");
  closeModalBtn.className = "close-modal-btn";
  closeModalBtn.textContent = "×";

  const modalTitle = document.createElement("h2");
  modalTitle.textContent = "Galerie Photo";
  modalTitle.classList.add("modal-title");

  const modalGallery = document.createElement("div");
  modalGallery.className = "modal-gallery";

  // Ajouter les images à la galerie de la modal
  allWorks.forEach((work) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");

    image.src = work.imageUrl;
    image.alt = work.title;

    figure.appendChild(image);
    modalGallery.appendChild(figure);
  });

  // Construction de la modal
  modalContent.appendChild(closeModalBtn);
  modalContent.appendChild(modalTitle);
  modalContent.appendChild(modalGallery);

  // Ajouter le bouton "Ajouter une photo"
  const addPhotoBtn = document.createElement("button");
  addPhotoBtn.textContent = "Ajouter une photo";
  addPhotoBtn.className = "add-photo-btn";
  modalContent.appendChild(addPhotoBtn);

  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);

  // Afficher la modal
  modalOverlay.style.display = "block";

  // Gérer la fermeture de la modal lorsqu'on clique sur le bouton de fermeture
  closeModalBtn.addEventListener("click", function () {
    modalOverlay.style.display = "none";
    document.body.removeChild(modalOverlay);
  });

  // Gérer la fermeture de la modal lorsqu'on clique en dehors de la modal
  modalOverlay.addEventListener("click", function (event) {
    if (event.target === modalOverlay) {
      modalOverlay.style.display = "none";
      document.body.removeChild(modalOverlay);
    }
  });

  // Ajoute l'événement pour le bouton "Ajouter une photo"
  addPhotoBtn.addEventListener("click", function () {
    modalOverlay.style.display = "none"; // Ferme la première modal
    displayAddPhotoModal(); // Ouvre la modal pour ajouter une photo
  });

  // Ajouter les boutons de suppression dans la modal de la galerie
  addDeleteButtonsToModal();
}

function displayAddPhotoModal() {
  // Créer la nouvelle modal pour l'ajout de photo
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const closeModalBtn = document.createElement("span");
  closeModalBtn.className = "close-modal-btn";
  closeModalBtn.textContent = "×";

  const backBtn = document.createElement("span"); // Flèche de retour
  backBtn.className = "back-btn";
  backBtn.textContent = "←"; // Symbole de flèche gauche

  const modalTitle = document.createElement("h2");
  modalTitle.textContent = "Ajouter une photo";
  modalTitle.classList.add("modal-title");

  // Formulaire d'ajout de photo
  const form = document.createElement("form");
  form.className = "add-photo-form";

  const imageInput = document.createElement("input");
  imageInput.type = "file";
  imageInput.name = "image";
  imageInput.accept = "image/*";
  form.appendChild(imageInput);

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.name = "title";
  titleInput.placeholder = "Titre de la photo";
  form.appendChild(titleInput);

  const categoryInput = document.createElement("select");
  categoryInput.name = "category";
  // Remplir les options de catégorie ici
  form.appendChild(categoryInput);

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Ajouter";
  form.appendChild(submitBtn);

  modalContent.appendChild(closeModalBtn);
  modalContent.appendChild(backBtn);
  modalContent.appendChild(modalTitle);
  modalContent.appendChild(form);
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);

  // Afficher la modal d'ajout de photo
  modalOverlay.style.display = "block";

  // Gérer la fermeture de la modal lorsqu'on clique sur le bouton de fermeture
  closeModalBtn.addEventListener("click", function () {
    modalOverlay.style.display = "none";
    document.body.removeChild(modalOverlay);
  });

  // Gérer la fermeture de la modal lorsqu'on clique en dehors de la modal
  modalOverlay.addEventListener("click", function (event) {
    if (event.target === modalOverlay) {
      modalOverlay.style.display = "none";
      document.body.removeChild(modalOverlay);
    }
  });

  // Gérer le clic sur la flèche de retour
  backBtn.addEventListener("click", function () {
    modalOverlay.style.display = "none"; // Ferme la modal d'ajout de photo
    document.body.removeChild(modalOverlay);
    displayGalleryModal(); // Réaffiche la modal de la galerie
  });

  // Gérer l'envoi du formulaire
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const image = imageInput.files[0];
    const title = titleInput.value;
    const category = categoryInput.value;

    sendWork(image, title, category);
    modalOverlay.style.display = "none";
    document.body.removeChild(modalOverlay);
  });
}

async function sendWork(image, title, category) {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("title", title);
  formData.append("category", category);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Recharger la liste des travaux après l'ajout
    getWorks();
  } catch (error) {
    console.error("Erreur lors de l'ajout du travail", error);
  }
}

function addDeleteButtonsToModal() {
  const modalGallery = document.querySelector(".modal-gallery");

  if (modalGallery) {
    modalGallery.querySelectorAll("figure").forEach((figure, index) => {
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️"; // Icône de poubelle
      deleteBtn.className = "delete-btn";
      deleteBtn.dataset.index = index;

      figure.appendChild(deleteBtn);

      // Ajouter un gestionnaire d'événements pour supprimer l'image
      deleteBtn.addEventListener("click", function () {
        // Supprimer l'élément du DOM
        figure.remove();
        // Optionnel: Ajouter une requête pour supprimer l'image du serveur
        // fetch(`http://localhost:5678/api/works/${allWorks[index].id}`, { method: 'DELETE' });
      });
    });
  }
}

// Appeler cette fonction lorsque la modale est affichée
document.addEventListener("DOMContentLoaded", function () {
  // Ajout d'un observateur de mutation pour détecter quand la modale est ajoutée au DOM
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          if (node.classList && node.classList.contains("modal-overlay")) {
            addDeleteButtonsToModal();
          }
        });
      }
    });
  });

  observer.observe(document.body, { childList: true });
});
