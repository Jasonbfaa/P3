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

/*const boutonObjet = document.querySelector(".btn-objet");
    
    boutonObjet.addEventListener("click", function () {
        const objetGallery = objet.filter();

    });*/

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
    //Création de la modal (couper en function)
    const modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    const closeModalBtn = document.createElement("span");
    closeModalBtn.className = "close-modal-btn";
    closeModalBtn.textContent = "×";

    // Créer un nouvel élément de titre de niveau 2
    const modalTitle = document.createElement("h2");
    // Ajouter du texte au titre
    modalTitle.textContent = "Galerie Photo";

    // Ajouter une classe au titre pour appliquer les styles CSS
    modalTitle.classList.add("modal-title");

    // Ajouter le titre à la modalContent (supposons que modalContent existe)
    modalContent.appendChild(modalTitle);

    const modalGallery = document.createElement("div");
    modalGallery.className = "modal-gallery";

    //Ajouter les images à la galerie de la modal (couper en function)
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
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Afficher la modal
    modalOverlay.style.display = "block";

    // Gérer la fermeture de la modal lorsqu'on clique sur le bouton de fermeture
    closeModalBtn.addEventListener("click", function () {
      modalOverlay.style.display = "none";
      // Supprimer la modal du DOM
      document.body.removeChild(modalOverlay);
    });

    // Gérer la fermeture de la modal lorsqu'on clique en dehors de la modal
    modalOverlay.addEventListener("click", function (event) {
      if (event.target === modalOverlay) {
        modalOverlay.style.display = "none";
        // Supprimer la modal du DOM
        document.body.removeChild(modalOverlay);
      }
    });
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

// Function to delete a work

function deleteWork(workId) {
  fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
  }).then(() => {
    allWorks = allWorks.filter(
      (element) => parseInt(element.id) !== parseInt(workId)
    );
    figure.remove();
    displayWorks(allWorks);
  });
}

//Ajout d'un travail

function sendWork(image, titre, category) {
  const formData = new formData();
  formData.append("image", image);
  formData.append("tittle", titre);
  formData.append("category", category);
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    Headers: {
      Autorization: "Bearer ${userToken}",
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      allWorks.push(data);
      displayWorks(allWorks);
    })
    .catch((error) => {
      console.error(
        "Une erreur est survenue lors de la création du work:",
        error
      );
    });
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
