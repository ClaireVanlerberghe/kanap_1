"use strict";

class Cart {
  get() {
    // Récupère le panier dans le local storage
    const cartJSON = localStorage.getItem("cart");
    const cart = cartJSON ? JSON.parse(cartJSON) : [];
    console.log(cart);
    return cart;
  }

  save(cart) {
    //Sauvegarde le panier dans le localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    this.computeTotals(cart);
  }

  update(productToUpdate, selectQuantity) {
    //Met a jour la quantité dans le localStorage
    console.log(this, productToUpdate, selectQuantity);
    const newQuantity = parseInt(selectQuantity.value);
    const cart = this.get();
    for (const productFromCart of cart) {
      let isProductToUpdate =
        productFromCart.id === productToUpdate.id &&
        productFromCart.color === productToUpdate.color;
      if (isProductToUpdate) {
        productFromCart.quantity = newQuantity;
      }
    }
    this.save(cart);
  }

  //Calcule prix et quantité total pour mettre a jours le dom
  async computeTotals(cart) {
    const totalQuantityElt = document.getElementById("totalQuantity");
    const totalPriceElt = document.getElementById("totalPrice");
    let quantityTotal = 0;
    let priceTotal = 0;

    for (const product of cart) {
      const response = await fetch(
        "http://localhost:3000/api/products/" + product.id
      );
      const apiProduct = await response.json();
      quantityTotal += product.quantity;
      priceTotal += apiProduct.price * product.quantity;
    }
    totalQuantityElt.innerText = quantityTotal;
    totalPriceElt.innerText = priceTotal;
  }
}

let cartManager = new Cart();

let cart = cartManager.get();

fetch("http://localhost:3000/api/products") //Appel de l'API
  .then((response) => response.json()) //Cela nous retourne la response
  .then((apiProducts) => {
    for (const cartProduct of cart) {
      console.log(cartProduct);
      let foundProduct = apiProducts.find(
        (apiProduct) => cartProduct.id === apiProduct._id
      );
      console.log(foundProduct);

      //fusion api et localstorage
      addProductToCart({ ...foundProduct, ...cartProduct });
    }
    cartManager.computeTotals(cart);
  });

const cartProduct = document.getElementById("cart__items");

//Ajoute produit du localStorage sur la page
function addProductToCart(product) {
  const articleProduct = document.createElement("article");
  articleProduct.classList.add("cart__item");
  cartProduct.appendChild(articleProduct);

  const imgDivProduct = document.createElement("div");
  imgDivProduct.classList.add("cart__item__img");
  articleProduct.appendChild(imgDivProduct);

  const imgProduct = document.createElement("img");
  imgProduct.src = product.imageUrl;
  imgProduct.alt = product.altTxt;
  imgDivProduct.appendChild(imgProduct);

  const contentProduct = document.createElement("div");
  contentProduct.classList.add("cart__item__content");
  articleProduct.appendChild(contentProduct);

  const contentDescriptionProduct = document.createElement("div");
  contentDescriptionProduct.classList.add("cart__item__content__description");
  contentProduct.appendChild(contentDescriptionProduct);

  const nameProduct = document.createElement("h2");
  nameProduct.textContent = product.name;
  contentDescriptionProduct.appendChild(nameProduct);

  const colorProduct = document.createElement("p");
  colorProduct.textContent = product.color;
  contentDescriptionProduct.appendChild(colorProduct);

  const priceProduct = document.createElement("p");
  priceProduct.textContent = product.price + "€";
  contentDescriptionProduct.appendChild(priceProduct);

  const contentSettings = document.createElement("div");
  contentSettings.classList.add("cart__item__content__settings");
  contentProduct.appendChild(contentSettings);

  const contentSettingsQuantity = document.createElement("div");
  contentSettingsQuantity.classList.add(
    "cart__item__content__settings__quantity"
  );
  contentSettings.appendChild(contentSettingsQuantity);

  const quantityProduct = document.createElement("p");
  quantityProduct.textContent = "Qté : ";
  contentSettingsQuantity.appendChild(quantityProduct);

  const selectQuantityProduct = document.createElement("input");
  selectQuantityProduct.setAttribute("type", "number");
  selectQuantityProduct.classList.add("itemQuantity");
  selectQuantityProduct.name = "itemQuantity";
  selectQuantityProduct.value = product.quantity;
  contentSettingsQuantity.appendChild(selectQuantityProduct);
  selectQuantityProduct.addEventListener(
    "change",
    cartManager.update.bind(cartManager, product, selectQuantityProduct)
  );

  const deleteQuantityProduct = document.createElement("div");
  deleteQuantityProduct.classList.add("cart__item__content__settings__delete");
  contentSettings.appendChild(deleteQuantityProduct);

  const deleteItemElt = document.createElement("p");
  deleteItemElt.textContent = "Supprimer";
  deleteItemElt.classList.add("deleteItem");

  deleteItemElt.addEventListener(
    "click",
    deleteItem.bind(articleProduct, product)
  );
  deleteQuantityProduct.appendChild(deleteItemElt);
}

//Permet de supprimer un produit du localStorage
function deleteItem(productToDelete) {
  console.log(productToDelete);
  let cart = cartManager.get();

  cart = cart.filter((productFromCart) => {
    let isProductToDelete =
      productFromCart.id === productToDelete.id &&
      productFromCart.color === productToDelete.color;
    return !isProductToDelete;
  });

  cartManager.save(cart); //Sauvegarde le nouveau panier (localStorage)

  this.remove(); //supprime la ligne du DOM
}

//Validation formulaire
function getFormValid() {
  const form = document.querySelector(".cart__order__form");

  //REGEX pour validation formulaire
  let emailRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$"
  );
  let charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
  let addressRegExp = new RegExp(
    "^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+"
  );

  // Ecoute de la modification du prénom
  form.firstName.addEventListener("change", function () {
    validFirstName(this);
  });

  // Ecoute de la modification du prénom
  form.lastName.addEventListener("change", function () {
    validLastName(this);
  });

  // Ecoute de la modification du prénom
  form.address.addEventListener("change", function () {
    validAddress(this);
  });

  // Ecoute de la modification du prénom
  form.city.addEventListener("change", function () {
    validCity(this);
  });

  // Ecoute de la modification du prénom
  form.email.addEventListener("change", function () {
    validEmail(this);
  });

  //validation du prénom
  const validFirstName = function (inputFirstName) {
    let firstNameErrorMsg = inputFirstName.nextElementSibling;

    if (charRegExp.test(inputFirstName.value)) {
      firstNameErrorMsg.innerHTML = "";
    } else {
      firstNameErrorMsg.innerHTML = "Veuillez mettre votre prénom.";
    }
  };

  //validation du nom
  const validLastName = function (inputLastName) {
    let lastNameErrorMsg = inputLastName.nextElementSibling;

    if (charRegExp.test(inputLastName.value)) {
      lastNameErrorMsg.innerHTML = "";
    } else {
      lastNameErrorMsg.innerHTML = "Veuillez mettre votre nom.";
    }
  };

  //validation de l'adresse
  const validAddress = function (inputAddress) {
    let addressErrorMsg = inputAddress.nextElementSibling;

    if (addressRegExp.test(inputAddress.value)) {
      addressErrorMsg.innerHTML = "";
    } else {
      addressErrorMsg.innerHTML = "Veuillez renseigner une adresse valide.";
    }
  };

  //validation de la ville
  const validCity = function (inputCity) {
    let cityErrorMsg = inputCity.nextElementSibling;

    if (charRegExp.test(inputCity.value)) {
      cityErrorMsg.innerHTML = "";
    } else {
      cityErrorMsg.innerHTML = "Veuillez renseigner une ville valide.";
    }
  };

  //validation de l'email
  const validEmail = function (inputEmail) {
    let emailErrorMsg = inputEmail.nextElementSibling;

    if (emailRegExp.test(inputEmail.value)) {
      emailErrorMsg.innerHTML = "";
    } else {
      emailErrorMsg.innerHTML = "Veuillez renseigner un email valide.";
    }
  };
}
getFormValid();

//Envoi des informations du formulaire au localstorage
function postForm() {

const formElt = document.querySelector('form.cart__order__form')

  //Ecouter le panier
  formElt.addEventListener("submit", (event) => {
    event.preventDefault()
    //Récupération des coordonnées du formulaire client
    let inputName = document.getElementById("firstName");
    let inputLastName = document.getElementById("lastName");
    let inputAddress = document.getElementById("address");
    let inputCity = document.getElementById("city");
    let inputMail = document.getElementById("email");

    //Construction d'un array depuis le local storage
    let idProducts = [];
    const cart = cartManager.get()
    for (let product of cart) {
      idProducts.push(product.id);
    }
    console.log(idProducts);

    

    const order = {
      contact: {
        firstName: inputName.value,
        lastName: inputLastName.value,
        address: inputAddress.value,
        city: inputCity.value,
        email: inputMail.value,
      },
      products: idProducts,
    };

    
    const options = {
      method: "POST",
      body: JSON.stringify(order),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    fetch("http://localhost:3000/api/products/order", options)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
       localStorage.clear();
        localStorage.setItem("orderId", data.orderId);

       document.location.href = "confirmation.html";
      })
      .catch((err) => {
        alert("Problème avec fetch : " + err.message);
      });
  });
}
postForm();
