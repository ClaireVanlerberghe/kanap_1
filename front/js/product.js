"use strict";

//Déclaration variable(s) utilisée(s)
const linkURL = window.location.href; //Récupère l'URL de la page
const url = new URL(linkURL);
const idProduct = url.searchParams.get("id"); //Retourne la première valeur associée au paramètre de recherche donné.
const colorSelect = document.getElementById("colors");
const quantitySelect = document.getElementById("quantity");
const addToCartButton = document.getElementById("addToCart");

getArticle(); //Appel de la fonction

// Récupération des articles de l'API
function getArticle() {
  fetch("http://localhost:3000/api/products/" + idProduct)
    .then((response) => {
      return response.json();
    })

    // Répartition des données de l'API dans le DOM
    .then(function (article) {
      if (article) {
        addProduct(article);
      }
    })
    .catch((error) => {
      //Sinon message d'erreur
      console.error("Erreur de la requête API", error);
    });
}
//Fonction ajout des éléments de l'api

function addProduct(article) {
  //Ajout de l'image via l'API
  const productImg = document.createElement("img"); //Création élément img
  productImg.src = article.imageUrl; //On la récupère dans l'API
  productImg.alt = article.altTxt;
  document.querySelector(".item__img").appendChild(productImg); //Et on l'ajoute au parent

  //Ajout du nom du produit
  const productName = document.getElementById("title");
  productName.innerText = article.name;

  //Ajout prix du produit
  const productPrice = document.getElementById("price");
  productPrice.innerText = article.price;

  //Ajout de la description
  const productDescription = document.getElementById("description");
  productDescription.innerText = article.description;

  //Ajout option de couleur
  for (let color of article.colors) {
    //Création de la boucle pour ajout des couleurs

    let productColors = document.createElement("option"); //Création de l'élément
    colorSelect.appendChild(productColors); //Ajout dans la DOM
    productColors.value = color; //On lui dit quelle valeur il prendra
    productColors.innerText = color;
  }
}
//Ajout au panier

addToCartButton.addEventListener("click", () => {
  const colorPicked = colorSelect.value;
  const quantityPicked = parseInt(quantitySelect.value);
  const cartJSON = localStorage.getItem("cart");
  const cart = cartJSON ? JSON.parse(cartJSON) : []; //On demande au localStorage de remonter cart si il yen a sinon tableau vide

  //vérifier les données pour l'envoie au panier
  try {
    if (!colorPicked) throw "Merci de séléctionner une couleur"; //Le point d'exclammation agit comme négation
    if (quantityPicked <= 0) throw "Merci de séléctionner une quantité supérieur à 0 !";
    if (quantityPicked > 100) throw "Merci de séléctionner une quantité inférieure ou égale à 100 !";
  } catch (error) {
    return alert(error); //Si conditions non remplit, ne continue pas
  }

  const product = {
    id: idProduct,
    color: colorPicked,
    quantity: quantityPicked,
  }; //Objet product

  let foundProduct = cart.find(
    (product) => idProduct == product.id && colorPicked == product.color
  );
  if (foundProduct != undefined) {
    foundProduct.quantity += quantityPicked;
  } else {
    cart.push(product);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert('Produit ajouté au panier')
});
