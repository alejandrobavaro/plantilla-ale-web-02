document.addEventListener("DOMContentLoaded", function () {
    // Obtener la categoría de la URL
    const categoria = obtenerCategoriaDeURL();

    if (categoria) {
        // Función para cargar los productos desde el archivo JSON
        async function cargarProductosDesdeJSON() {
            try {
                const response = await fetch('../json/productos2.json'); 
                const productos = await response.json();
                mostrarProductos(productos, categoria);
            } catch (error) {
                console.error('Error al cargar los productos:', error);
            }
        }

        // Función para mostrar los productos en la página
        function mostrarProductos(productos, categoria) {
            const contenedorProductos = document.querySelector(".row.row-cols-1.row-cols-md-4.g-4");
            contenedorProductos.innerHTML = ""; // Limpiar el contenedor antes de cargar los productos

            const productosFiltrados = filtrarProductosPorCategoria(productos, categoria);

            productosFiltrados.forEach((producto) => {
                const productoHTML = `
                    <div class="col producto" id="producto${producto.id}" data-id="${producto.id}">
                        <div class="card">
                            <div class="card-body card4">
                                <section>
                                    <h5 class="objetoCentrado1"><i class="bi bi-activity"></i> (Producto por encargo) <i class="bi bi-activity"></i></h5>
                                </section>
                                <img src="${producto.imagen}" class="card-img-top img-fluid" alt="${producto.nombre}" />
                                <h5 class="card-title">${producto.nombre}</h5>
                                <span>
                                    <h3 class="tituloImportante2 objetoCentrado1"> $${producto.precio.toFixed(2)} </h3>
                                    </span>
                                <label for="selectColor${producto.id}" class="objetoCentrado1 tituloPequeño1"><i class="bi bi-activity"></i> ELIGE COLOR <i class="bi bi-activity"></i></label>
                                <select id="selectColor${producto.id}" class="form-select mb-3 tituloPequeño4">
                                    <option value="Negro">Negro</option>
                                    <option value="Blanco">Blanco</option>
                                    <option value="Gris-claro">Gris Claro</option>
                                    <option value="Gris-oscuro">Gris Oscuro</option>
                                    <option value="Rojo">Rojo</option>
                                    <option value="Naranja">Naranja</option>
                                </select>
                                <label for="selectTalla${producto.id}" class="objetoCentrado1 tituloPequeño1"><i class="bi bi-activity"></i> ELIGE TALLE <i class="bi bi-activity"></i></label>
                                <select id="selectTalla${producto.id}" class="form-select tituloPequeño4">
                                    <option value="x-small">X-Small</option>
                                    <option value="xx-small">XX-Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                    <option value="x-large">X-Large</option>
                                    <option value="xx-large">XX-Large</option>
                                </select>
                                <div class="d-grid gap-2 col-6 mx-auto objetoCentrado1">
                                    <button class="botonEncargar btn btn-primary" data-producto-id="${producto.id}">
                                        <i class="bi bi-shift-fill"></i> Encargar 
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                contenedorProductos.insertAdjacentHTML("beforeend", productoHTML);
            });
        }

        // Función para obtener la categoría de la URL
        function obtenerCategoriaDeURL() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('categoria');
        }

        // Función para filtrar los productos por categoría
        function filtrarProductosPorCategoria(productos, categoria) {
            // Convertir ambas categorías a minúsculas para compararlas
            const categoriaMinusculas = categoria.toLowerCase();
            return productos.filter(producto => producto.categoria.toLowerCase() === categoriaMinusculas);
        }

        // Llamar a la función para cargar los productos cuando la página esté lista
        cargarProductosDesdeJSON();
    }
});
