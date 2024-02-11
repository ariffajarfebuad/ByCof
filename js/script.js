const navbarNav = document.querySelector('.navbar-nav');

document.querySelector('#hamburger-menu').onclick = () => {
  navbarNav.classList.toggle('active');
};

const searchForm = document.querySelector('.search-form');
const searchBox = document.querySelector('#search-box');

document.querySelector('#search-button').onclick = (e) => {
  searchForm.classList.toggle('active');
  searchBox.focus();
  e.preventDefault();
};

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount).replace(",00", ",000");
}

const cartItems = [];

document.addEventListener('DOMContentLoaded', function () {
  var addToCartButtons = document.querySelectorAll('.add-to-cart');

  addToCartButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();

      const productId = button.dataset.productId;
      const productContent = button.closest('.product-card').querySelector('.product-content');
      const productName = productContent.querySelector('h3').textContent;
      const productPriceElement = productContent.querySelector('.product-price');
      const productPrice = productPriceElement.firstChild.nodeValue.trim(); 

      const productImage = button.closest('.product-card').querySelector('.product-image img').src;

      console.log('Product added to cart:', productId);

      const existingProductIndex = cartItems.findIndex(item => item.id === productId);
      if (existingProductIndex !== -1) {
        cartItems[existingProductIndex].quantity++;
      } else {
        cartItems.push({
          id: productId,
          name: productName,
          price: productPrice,
          image: productImage,
          quantity: 1
        });
      }

      updateShoppingCart();

      console.log('Cart Items:', cartItems);
    });
  });
});

function generateWhatsAppMessage(totalPrice) {
  let message = 'Halo, saya ingin memesan produk berikut:\n';
  cartItems.forEach(function(product) {
    message += `- ${product.name}: ${product.quantity}\n`;
  });
  message += `Total harga: ${formatCurrency(totalPrice)}`;

  const phoneNumber = "62882006024359";
  const encodedMessage = encodeURIComponent(message);

  const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

  window.open(whatsappURL, '_blank');
}

function updateShoppingCart() {
  let totalPrice = 0;

  var cartItemListHTML = '<ul class="cart-items">';
  cartItems.forEach(function (product) {
    cartItemListHTML += `
      <li class="cart-item" data-product-id="${product.id}">
        <div class="item-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="item-info">
          <div class="item-name">${product.name}</div>
          <div class="item-price">${product.price}</div>
        </div>
        <div class="item-quantity">
          <button class="quantity-btn minus">-</button>
          <span class="quantity">${product.quantity}</span>
          <button class="quantity-btn plus">+</button>
        </div>
        <button class="remove-item-btn">Remove</button>
      </li>
    `;

    const productPrice = parseFloat(product.price.replace(/[^\d.]/g, ''));
    if (!isNaN(productPrice)) {
      totalPrice += productPrice * product.quantity;
    }
  });
  cartItemListHTML += '</ul>';

  const shoppingCart = document.querySelector('.shopping-cart');
  if (cartItems.length === 0) {
    shoppingCart.innerHTML = '<p>Tambahkan Produk</p>';
    shoppingCart.classList.remove('active'); // Hide the shopping cart if it's empty
  } else {
    shoppingCart.innerHTML = cartItemListHTML;

    const totalHTML = `<div class="total-price">Total: ${formatCurrency(totalPrice)}</div>`;
    shoppingCart.insertAdjacentHTML('beforeend', totalHTML);

    const checkoutButton = '<button id="checkout-button" class="checkout-btn">Checkout</button>';
    shoppingCart.insertAdjacentHTML('beforeend', checkoutButton);

    document.querySelector('#checkout-button').addEventListener('click', function () {
      generateWhatsAppMessage(totalPrice);
    });

    const quantityButtons = document.querySelectorAll('.quantity-btn');
    quantityButtons.forEach(button => {
      button.addEventListener('click', function () {
        const itemQuantity = button.parentElement.querySelector('.quantity');
        let quantity = parseInt(itemQuantity.textContent);

        if (button.classList.contains('plus')) {
          quantity++;
        } else if (button.classList.contains('minus') && quantity > 1) {
          quantity--;
        }

        itemQuantity.textContent = quantity;

        const productId = button.closest('.cart-item').dataset.productId;
        const productIndex = cartItems.findIndex(item => item.id === productId);
        if (productIndex !== -1) {
          cartItems[productIndex].quantity = quantity;
          updateShoppingCart();
        }
      });
    });

    const removeButtons = document.querySelectorAll('.remove-item-btn');
    removeButtons.forEach(button => {
      button.addEventListener('click', function () {
        const cartItem = button.parentElement;
        cartItem.remove();

        const productId = cartItem.dataset.productId;
        const productIndex = cartItems.findIndex(item => item.id === productId);
        if (productIndex !== -1) {
          cartItems.splice(productIndex, 1);
          updateShoppingCart();
        }
      });
    });
  }
}

document.querySelector('#shopping-cart-button').onclick = (e) => {
  const shoppingCart = document.querySelector('.shopping-cart');
  if (cartItems.length === 0) {
    shoppingCart.innerHTML = '<p>Tambahkan Produk</p>';
  } else {
    shoppingCart.classList.toggle('active');
    updateShoppingCart();
  }
  e.preventDefault();
};

const hm = document.querySelector('#hamburger-menu');
const sb = document.querySelector('#search-button');
const sc = document.querySelector('#shopping-cart-button');

document.addEventListener('click', function (e) {
  if (!hm.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove('active');
  }

  if (!sb.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove('active');
  }

  if (!sc.contains(e.target) && !shoppingCart.contains(e.target)) {
    shoppingCart.classList.remove('active');
  }
});

function getProductDetail(productId) {
  const product = products.find(item => item.id === parseInt(productId));
  if (product) {
    console.log('Product found:', product);
    return product;
  } else {
    console.log('Product not found for ID:', productId);
    return null;
  }
}

const products = [
  {
    id: 1,
    name: 'Coffee Arabika',
    price: 'IDR 30.000',
    image: 'img/products/Coffee Arabika.jpg',
    description: 'Kopi Arabika adalah varietas kopi yang tumbuh di daerah pegunungan dengan ketinggian 600-2000 meter di atas permukaan laut. Ia memiliki rasa kompleks yang mencakup manis, asam ringan, dan aroma buah-buahan serta bunga. Dikenal karena profil rasanya yang halus, kopi Arabika adalah pilihan favorit bagi banyak pecinta kopi di seluruh dunia.'
  },
  {
    id: 2,
    name: 'Coffee Robusta',
    price: 'IDR 40.000',
    image: 'img/products/Coffee Robusta.jpg',
    description: 'Kopi Robusta adalah jenis kopi yang memiliki rasa yang kuat dan kandungan kafein yang tinggi. Dibandingkan dengan kopi Arabika, Robusta memiliki rasa yang lebih pahit dan tajam, serta aroma yang kurang kompleks. Biasanya digunakan dalam campuran kopi espresso untuk memberikan badan yang kaya dan crema yang tebal.'
  },
  {
    id: 3,
    name: 'Coffee Speciality',
    price: 'IDR 50.000',
    image: 'img/products/Coffee Speciality.jpg',
    description: 'Kopi Speciality adalah kopi berkualitas tinggi yang ditanam dan diproses secara khusus untuk menghasilkan cita rasa dan aroma yang unik. Dipilih dengan cermat dari daerah tertentu, kopi Speciality memenuhi standar kualitas yang tinggi dan menjadi pilihan favorit bagi pecinta kopi yang mencari pengalaman minum kopi yang istimewa.'
  },
  {
    id: 4,
    name: 'Coffee Speciality + Sugar',
    price: 'IDR 50.000',
    image: 'img/products/Coffee Spciality + Sugar.jpg',
    description: 'Kombinasi kopi Speciality dengan gula menciptakan perpaduan unik antara kelembutan dan kompleksitas rasa kopi dengan manisnya gula, menghasilkan minuman yang memuaskan bagi para penikmat kopi yang mencari pengalaman yang berbeda.'
  },
];

const itemDetailModal = document.querySelector('#item-detail-modal');
const itemDetailButtons = document.querySelectorAll('.item-detail-button');

itemDetailButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const productId = btn.getAttribute('data-product-id');
    const product = getProductDetail(productId);

    if (product) {
      document.getElementById('modal-product-image').src = product.image;
      document.getElementById('modal-product-name').innerText = product.name;
      document.getElementById('modal-product-description').innerText = product.description;
      document.getElementById('modal-product-normal-price').innerText = 'Price: ' + product.price;

      itemDetailModal.style.display = 'block';
    } else {
      alert('Product not found!');
    }
  });
});

document.querySelector('.close-icon').addEventListener('click', () => {
  itemDetailModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === itemDetailModal) {
    itemDetailModal.style.display = 'none';
  }
});
