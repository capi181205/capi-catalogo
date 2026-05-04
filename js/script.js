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
        stock: 5,
        tallas: ["S", "M", "L", "XL", "XXL"],
        tallasDisponibles: ["M", "L", "XL"]
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
        stock: 3,
        tallas: ["S", "M", "L", "XL", "XXL"],
        tallasDisponibles: ["S", "M", "L"]
    }
    /* Agrega más productos aquí con el mismo formato */
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

    if (lista.length === 0) {
        contenedor.innerHTML = `
            <div class="sin-resultados">
                <p>No encontramos esa playera.</p>
                <a href="https://wa.me/527821702426?text=Hola! Busco una playera que no encontré en el catálogo" 
                   target="_blank" class="btn-whatsapp-inline">
                   Escríbenos y la conseguimos 💬
                </a>
            </div>`;
        return;
    }

    lista.forEach(p => {
        const card = document.createElement('div');
        card.classList.add('producto-card');
        card.onclick = () => { window.location.href = `producto.html?id=${p.id}`; };

        // Badge de urgencia si stock <= 3
        const badgeUrgencia = p.stock <= 3
            ? `<span class="badge-urgente">⚡ Últimas ${p.stock}</span>`
            : '';

        // Mensaje WhatsApp con talla pendiente
        const msgWA = encodeURIComponent(`Hola! Me interesa la ${p.nombre}`);

        card.innerHTML = `
            <div class="card-imagen-wrap">
                ${badgeUrgencia}
                <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
            </div>
            <h3>${p.nombre}</h3>
            <p class="precio">${p.precio}</p>
            <p class="stock-label">Disponibles: ${p.stock}</p>
            <a href="https://wa.me/527821702426?text=${msgWA}"
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
        // Quitar botón activo al buscar
        document.querySelectorAll('nav button').forEach(b => b.classList.remove('activo'));
    });
}

// 3. Filtrado por categoría
function filtrar(cat, btn) {
    // Marcar botón activo
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('activo'));
    if (btn) btn.classList.add('activo');
    if (buscador) buscador.value = '';

    if (cat === 'todos') return mostrarProductos(productos);
    const filtrados = productos.filter(p => p.categoria === cat);
    mostrarProductos(filtrados);
}

// Carga inicial
mostrarProductos(productos);