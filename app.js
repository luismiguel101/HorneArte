document.addEventListener('DOMContentLoaded', function () {
  // Inicializar los carruseles

  const swiperGalletas = new Swiper('.swiperGalletas', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: {
      el: '.swiperGalletas .swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiperGalletas .swiper-button-next',
      prevEl: '.swiperGalletas .swiper-button-prev',
    },
    breakpoints: {
      // cuando la ventana es >= 640px
      640: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      // cuando la ventana es >= 992px
      992: {
        slidesPerView: 3,
        spaceBetween: 30
      }
    }
  });

  const swiperTortas = new Swiper('.swiperTortas', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: {
      el: '.swiperTortas .swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiperTortas .swiper-button-next',
      prevEl: '.swiperTortas .swiper-button-prev',
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 30
      }
    }
  });

  const swiperBake = new Swiper('.swiperBake', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: {
      el: '.swiperBake .swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiperBake .swiper-button-next',
      prevEl: '.swiperBake .swiper-button-prev',
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 30
      }
    }
  });

  // Funcionalidad del carrito de compras
  let cart = [];
  const cartItems = document.getElementById('cart-items');
  const totalAmount = document.getElementById('total-amount');
  const addToCartButtons = document.querySelectorAll('.add-to-cart');

  // Añadir evento a los botones de "Añadir al Carrito"
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function () {
      const productCard = this.closest('.product-card');
      const productName = productCard.querySelector('h3').textContent;
      const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('S/', '').trim());

      // Añadir producto al carrito
      addToCart(productName, productPrice);

      // Actualizar la visualización del carrito
      updateCartDisplay();
      
      // Mostrar confirmación al usuario
      showNotification(`¡${productName} añadido al carrito!`);
    });
  });

  function addToCart(name, price) {
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        name: name,
        price: price,
        quantity: 1
      });
    }
    
    // Guardar el carrito en localStorage para persistencia
    saveCart();
  }

  function updateCartDisplay() {
    // Limpiar el contenido actual del carrito
    cartItems.innerHTML = '';

    let total = 0;

    // Añadir cada item al carrito
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const itemElement = document.createElement('div');
      itemElement.className = 'cart-item';
      itemElement.innerHTML = `
        <span class="item-name">${item.name}</span>
        <span class="item-quantity">x${item.quantity}</span>
        <span class="item-price">S/ ${itemTotal.toFixed(2)}</span>
        <button class="remove-item" data-name="${item.name}">X</button>
      `;

      cartItems.appendChild(itemElement);
    });

    // Actualizar el total con el formato correcto en soles
    totalAmount.textContent = `S/ ${total.toFixed(2)}`;
    
    // Actualizar contador de artículos si existe
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCounter.textContent = totalItems;
      cartCounter.style.display = totalItems > 0 ? 'block' : 'none';
    }

    // Añadir eventos a los botones de eliminar
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', function () {
        const productName = this.getAttribute('data-name');
        removeFromCart(productName);
        updateCartDisplay();
      });
    });
  }

  function removeFromCart(name) {
    const itemIndex = cart.findIndex(item => item.name === name);

    if (itemIndex !== -1) {
      if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity -= 1;
      } else {
        cart.splice(itemIndex, 1);
      }
      
      // Guardar el carrito actualizado
      saveCart();
    }
  }
  
  // Funciones para guardar y cargar el carrito desde localStorage
  function saveCart() {
    localStorage.setItem('bakeryCart', JSON.stringify(cart));
  }
  
  function loadCart() {
    const savedCart = localStorage.getItem('bakeryCart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
      updateCartDisplay();
    }
  }
  
  // Cargar el carrito al iniciar
  loadCart();
  
  // Notificación temporal para feedback al usuario
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    
    // Estilos para la notificación
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.background = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    
    document.body.appendChild(notification);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.5s';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  }

  // Funcionalidad del botón de WhatsApp
  const whatsappBtn = document.getElementById('whatsappBtn');

  whatsappBtn.addEventListener('click', function () {
    if (cart.length === 0) {
      alert('Agrega productos a tu carrito antes de ordenar.');
      return;
    }

    // Construir el mensaje para WhatsApp
    let message = 'Hola, me gustaría hacer un pedido:\n';

    cart.forEach(item => {
      message += `* ${item.quantity}x ${item.name} - S/ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\nTotal: S/ ${total.toFixed(2)}`;

    // Número de WhatsApp (reemplazar con el número real)
    const phoneNumber = '+51962314578';

    // Crear el enlace de WhatsApp
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappLink, '_blank');
  });
});