/* =========================================
   BASE DE DATOS DE PRODUCTOS
   ========================================= */
const productos = [
    {
        id: 1,
        nombre: "Playera ASSC Corridos Tumbados",
        categoria: "belica",
        precio: "$280",
        imagen: "img/assc-corridos-tumbados.webp",
        imagenes: [
            "img/assc-corridos-tumbados.webp", 
            "img/assc-corridos-tumbados-2.webp", 
            "img/assc-corridos-tumbados-3.webp"
        ],
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

// 1. Mostrar tarjetas en el catálogo
function mostrarProductos(lista) {
    if (!contenedor) return; 
    contenedor.innerHTML = '';
    
    lista.forEach(p => {
        const card = document.createElement('div');
        card.classList.add('producto-card');
        
        // Al hacer clic, enviamos al usuario a producto.html con el ID
        card.onclick = () => {
            window.location.href = `producto.html?id=${p.id}`;
        };
        
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

// 2. Buscador
if (buscador) {
    buscador.addEventListener('keyup', (e) => {
        const texto = e.target.value.toLowerCase();
        const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(texto));
        mostrarProductos(filtrados);
    });
}

// 3. Filtrado por categoría
function filtrar(cat) {
    if(cat === 'todos') return mostrarProductos(productos);
    const filtrados = productos.filter(p => p.categoria === cat);
    mostrarProductos(filtrados);
}

// Carga inicial
mostrarProductos(productos);