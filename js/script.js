/* =========================================
   BASE DE DATOS DE PRODUCTOS
   ========================================= */
const productos = [
    {
        id: 1,
        nombre: "Playera ASSC Corridos Tumbados",
        categoria: "belica",
        precio: "$280",
        imagen: "img/assc-corridos-tumbados.webp", // Imagen principal del catálogo
        imagenes: ["img/assc-corridos-tumbados.webp", "img/assc-corridos-tumbados-2.webp", "img/assc-corridos-tumbados-3.webp"], // Puedes agregar más fotos aquí para la galería
        composicion: "100% Algodón Premium",
        caracteristicas: ["Corte Oversize", "Estampado DTF alta resolución", "Cuello redondo reforzado"],
        lavado: "Lavar a mano con agua fría. No usar secadora. Planchar al revés.",
        stock: 5
    },
    {
        id: 2,
        nombre: "Playera ASSC Sadboys",
        categoria: "belica",
        precio: "$280",
        imagen: "img/assc-Sadboys-Angeles.webp",
        imagenes: ["img/assc-Sadboys-Angeles.webp"],
        composicion: "100% Algodón tacto suave",
        caracteristicas: ["Diseño exclusivo", "Impresión duradera", "Talla única"],
        lavado: "Lavar con colores similares. Evitar exprimir fuertemente el estampado.",
        stock: 3
    }
];

const contenedor = document.getElementById('contenedor-productos');
const buscador = document.getElementById('buscador');

/* =========================================
   FUNCIONES PRINCIPALES
   ========================================= */

// 1. RENDERIZAR CATÁLOGO: Dibuja las tarjetas en el HTML
function mostrarProductos(lista) {
    contenedor.innerHTML = ''; // Limpiamos el contenedor antes de dibujar
    lista.forEach(p => {
        const card = document.createElement('div');
        card.classList.add('producto-card');
        
        // Al hacer clic en la tarjeta, llamamos a abrirModal pasándole el ID del producto
        card.setAttribute('onclick', `abrirModal(${p.id})`);
        
        card.innerHTML = `
            <img src="${p.imagen}" alt="${p.nombre}">
            <h3>${p.nombre}</h3>
            <p class="precio">${p.precio}</p>
            <p>Disponibles: ${p.stock}</p>
            <a href="https://wa.me/527821702426?text=Hola! Me interesa la ${p.nombre}" 
               class="btn-whatsapp" 
               onclick="event.stopPropagation();" 
               target="_blank">Pedir por WhatsApp</a>
        `;
        contenedor.appendChild(card);
    });
}

// 2. BUSCADOR: Filtra la lista mientras el usuario escribe
buscador.addEventListener('keyup', (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(texto));
    mostrarProductos(filtrados);
});

// 3. FILTROS DE CATEGORÍA: Muestra productos según el botón presionado
function filtrar(cat) {
    if(cat === 'todos') return mostrarProductos(productos);
    const filtrados = productos.filter(p => p.categoria === cat);
    mostrarProductos(filtrados);
}

// 4. ABRIR DETALLE (MODAL): Busca el producto y llena el modal con su info
function abrirModal(id) {
    // Buscamos el objeto del producto en nuestro array usando el ID
    const p = productos.find(prod => prod.id === id);
    
    // Inyectamos los textos en el modal
    document.getElementById('modal-titulo').innerText = p.nombre;
    document.getElementById('modal-precio').innerText = p.precio;
    document.getElementById('modal-composicion').innerText = p.composicion;
    document.getElementById('modal-lavado').innerText = p.lavado;
    
    // Generamos la lista de características (usamos .map para crear <li> por cada una)
    const listaChar = document.getElementById('modal-caracteristicas');
    listaChar.innerHTML = p.caracteristicas.map(c => `<li>${c}</li>`).join('');
    
    // Generamos las imágenes de la galería
    const galeria = document.getElementById('modal-galeria');
    galeria.innerHTML = p.imagenes.map(img => `<img src="${img}">`).join('');

    // Actualizamos el link de WhatsApp con el nombre del producto para que sepas qué quieren
    const btnModal = document.getElementById('btn-comprar-modal');
    btnModal.href = `https://wa.me/527821702426?text=Hola CAPI! Quiero comprar la ${p.nombre}`;

    // Mostramos el modal y bloqueamos el scroll del fondo para mejor UX
    document.getElementById('modal-producto').style.display = "block";
    document.body.style.overflow = "hidden"; 
}

// 5. CERRAR MODAL: Oculta la ventana y devuelve el scroll a la normalidad
function cerrarModal() {
    document.getElementById('modal-producto').style.display = "none";
    document.body.style.overflow = "auto";
}

// 6. CERRAR AL HACER CLIC AFUERA: Función de comodidad para el usuario
window.onclick = function(event) {
    const modal = document.getElementById('modal-producto');
    if (event.target == modal) {
        cerrarModal();
    }
}

// INICIALIZACIÓN: Ejecutamos la función para que la página no empiece vacía
mostrarProductos(productos);