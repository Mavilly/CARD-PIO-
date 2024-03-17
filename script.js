const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// ABRIR O MODAL DO CARRINHO
cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex";
});

// FECHAR O MODAL QUANDO EU CLICAR FORA
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

// Adiciona eventos de clique aos botões de adicionar ao carrinho das bebidas
const addToCartBtns = document.querySelectorAll("#menu .add-to-cart-btn");
addToCartBtns.forEach(btn => {
  btn.addEventListener("click", function () {
    const name = this.getAttribute("data-name");
    const price = parseFloat(this.getAttribute("data-price"));
    addToCart(name, price);
    console.log("Item adicionado:", name, price);
  });
});

// FUNCAO PARA ADICIONAR NO CARRINHO
function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    // SE O ITEM JA EXISTE AUMENTA APENAS A QUANTIDADE + 1
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
  console.log("Carrinho atualizado:", cart);
}

//  ATUALIZA CARRINHO
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

    cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">${item.name}</p>
            <p>Qtd: ${item.quantity}</p>
            <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
          </div>

          <div>
            <button class="remove-from-cart-btn" data-name="${item.name}">
              Remover
            </button>
          </div>
        </div>
        `;

    total += item.price * item.quantity;
    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  cartCounter.innerHTML = cart.length;
}

// FUNCAO REMOVER ITEM DO CARRINHO
cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");
    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex(item => item.name === name);
  if (index !== -1) {
    const item = cart[index];
    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }
    cart.splice(index, 1);
    updateCartModal();
  }
}

addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;
  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

//FINALIZAR PEDIDO
checkoutBtn.addEventListener("click", function () {
  const isOpen = checkRestauranteOpen();
  if (!isOpen) {
    Toastify({
      text: "Ops, o restaurante está fechado!",
      duration: 3000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
      onClick: function () { } // Callback after click
    }).showToast();
    return;
  }

  if (cart.length === 0) return;
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  //ENVIAR O PEDIDO PARA API WHATS

//ENVIAR O PEDIDO PARA API WHATS
const cartItems = cart.map((item) => {
  return (
    `> ${item.name} - Quantidade: (${item.quantity}) - Preço: R$${item.price.toFixed(2)}`
  );
}).join("\n");

const totalPedido = cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);

const message = encodeURIComponent(`Olá, boa noite. Segue meu pedido:\n${cartItems}\nTotal: R$${totalPedido}`);
const phone = "5583993506967";
window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank");
cart = [];
updateCartModal();

});

// VERIFICAR A HORA E MANIPULAR O CART DO HORARIO
function checkRestauranteOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 22;
  //TRUE = RESTAURANTE ESTA ABERTO
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestauranteOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
}
