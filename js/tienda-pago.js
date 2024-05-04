document.addEventListener("DOMContentLoaded", function () {
  const listaCarrito = document.getElementById("listaCarrito");
  const detalleProducto = document.getElementById("detalleProducto");

  // Función para cargar los productos desde el archivo JSON
  async function cargarProductosDesdeJSON() {
    try {
      const response = await fetch('../json/productos.json'); // Corregir la ruta del archivo JSON si es necesario
      const productos = await response.json();
      mostrarCarrito(productos);
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  }

  // Función para mostrar el carrito
  function mostrarCarrito(productos) {
    const carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    listaCarrito.innerHTML = "";

    carrito.forEach((producto, index) => {
      const productoEnCarrito = productos.find(p => p.id === producto.id);
      if (productoEnCarrito) {
        const itemCarrito = document.createElement("li");
        itemCarrito.className = "elementoHijo";
        itemCarrito.innerHTML = `
          <div class="row">
            <div class="col-md-4">
              <img src="${productoEnCarrito.imagen}" class="img-fluid" alt="${productoEnCarrito.nombre}" />
            </div>
            <div class="col-md-8">
              <h5>${productoEnCarrito.nombre}</h5>
              <p><strong>Color:</strong> ${producto.color}</p>
              <p><strong>Talla:</strong> ${producto.talla}</p>
              <p><strong>Precio:</strong> $${productoEnCarrito.precio.toFixed(2)}</p>
              <p><button class="btnEliminar btn btn-sm" data-index="${index}"><i class="bi bi-trash"></i></button></p>
            </div>
          </div>
          <hr />
        `;
        listaCarrito.appendChild(itemCarrito);
      }
    });

    // Calcular total
    const total = carrito.reduce((acc, producto) => {
      const productoEnCarrito = productos.find(p => p.id === producto.id);
      return acc + productoEnCarrito.precio;
    }, 0);
    const totalHTML = `<p class="card objetoCentrado1">Total: $${total.toFixed(2)}</p>`;
    listaCarrito.innerHTML += totalHTML;

    // Botón Eliminar
    const botonesEliminar = document.querySelectorAll(".btnEliminar");
    botonesEliminar.forEach((btnEliminar) => {
      btnEliminar.addEventListener("click", (event) => {
        const index = parseInt(event.target.getAttribute("data-index"));
        eliminarProducto(index);
      });
    });
  }

  function eliminarProducto(index) {
    let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    carrito.splice(index, 1); // Eliminar el producto en el índice especificado
    sessionStorage.setItem("carrito", JSON.stringify(carrito)); // Actualizar el sessionStorage
    mostrarCarrito(carrito); // Pasar el array de productos al mostrarCarrito
    // Actualizar localStorage para sincronización
    localStorage.setItem("carrito", JSON.stringify(carrito));
    // Disparar evento personalizado para notificar a otras páginas
    const eliminarEvento = new CustomEvent("productoEliminado", {
        detail: { index },
    });
    document.dispatchEvent(eliminarEvento);
  }

  // Escuchar el evento personalizado para actualizar el carrito cuando se elimina un producto
  document.addEventListener("productoEliminado", function (event) {
    const index = event.detail.index; // Obtener el índice del producto eliminado
    eliminarProducto(index); // Llamar a la función para eliminar el producto del carrito
  });

  // Función para mostrar el detalle del producto
  function mostrarDetalle() {
    const detalle = JSON.parse(sessionStorage.getItem("detalle")) || {};
    const detalleHTML = `
      <h4>Detalle del Producto:</h4>
      <p><strong>Nombre:</strong> ${detalle.nombre}</p>
      <p><strong>Precio:</strong> $${detalle.precio.toFixed(2)}</p>
      <p><strong>Color:</strong> ${detalle.color}</p>
      <p><strong>Talla:</strong> ${detalle.talla}</p>
    `;
    detalleProducto.innerHTML = detalleHTML;
  }

  // Agregar SweetAlert al botón de Pagar
  document.getElementById("btnPagar").addEventListener("click", function () {
    // Mostrar SweetAlert para confirmar el pago
    Swal.fire({
      title: "Proceso de Pago",
      text: "Ahora vamos a realizar todo el proceso de tu pago. ¿Deseas continuar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "No, volver a la tienda",
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirigir al enlace de PayPal
        window.open("https://www.paypal.com/paypalme/alegondramusic?country.x=AR&locale.x=es_XC", "_blank");
      } else {
        // Volver a la tienda
        window.location.href = "./tienda.html";
      }
    });
  });

  // Llamar a las funciones para cargar el carrito y detalle
  cargarProductosDesdeJSON();
  mostrarDetalle();
});
