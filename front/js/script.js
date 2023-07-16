"use strict";

//Déclaration variable(s) utilisée(s)
const productContainer = document.querySelector(".items");

//Fonction pour créer les balises pour ajout produit
function addProduct(product) {

  const linkProduct = document.createElement("a"); //Ajout lien de l'article
  linkProduct.href = "./product.html?id=" + product._id;

  const articleProduct = document.createElement("article");
  linkProduct.appendChild(articleProduct);

  const imgProduct = document.createElement("img");
  imgProduct.src = product.imageUrl;
  imgProduct.alt = product.altTxt;
  articleProduct.appendChild(imgProduct);

  const productName = document.createElement("h3");
  productName.textContent = product.name;
  articleProduct.appendChild(productName);
  productName.classList.add("productName");

  const productDescription = document.createElement("p");
  productDescription.textContent = product.description
  articleProduct.appendChild(productDescription);
  productDescription.classList.add("productDescription");

  productContainer.appendChild(linkProduct); // Ajout en tant que enfant de product
}




fetch("http://localhost:3000/api/products")  //Appel de l'API
.then(response => response.json())  //Cela nous retourne la response
.then(products => {
  for (const product of products){  //On créé la boucle pour appeler les données du produit
    addProduct(product)
  }
})



