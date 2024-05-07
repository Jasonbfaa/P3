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
    document.getElementById("tousBtn").removeAttribute('hidden');
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
    if (token) {
        // L'utilisateur est connecté
        document.getElementById("loginBtn").innerText = "Logout";
        // Masquer les filtres
        sectionFilter.style.display = "none";
    } else {
        // L'utilisateur n'est pas connecté
        document.getElementById("loginBtn").innerText = "Login";
        // Afficher les filtres
        sectionFilter.style.display = "block";
    }
}

window.onload = function()  {
  checkLoggedIn();
  
}

function displayEditButton() {
  const elemTitle = document.createElement("div");
  elemTitle.className = "projectTitle";
  const portSection = document.getElementById("portfolio");
  const titleP = portSection.querySelector("h2"); // on recupere le titre
  const iconElement2 = document.createElement("i");
  iconElement2.className = "fa-regular fa-pen-to-square";
  const editLink = document.createElement("a");
  editLink.className = "editWorks";
  const editText = document.createTextNode("modifier");
  editLink.appendChild(iconElement2);
  editLink.appendChild(editText);
  elemTitle.appendChild(titleP);
  elemTitle.appendChild(editLink);
  portSection.insertBefore(elemTitle, portSection.firstChild);
}
displayEditButton();