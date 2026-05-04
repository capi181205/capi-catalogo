// Tu base de datos de productos
const productos = [
    {
        id: 1,
        nombre: "Playera ASSC Corridos Tumbados",
        categoria: "jdm",
        precio: "$280",
        imagen: "img/assc-corridos-tumbados.webp",
        stock: 5
    },
    {
        id: 2,
        nombre: "Playera ASSC",
        categoria: "anime",
        precio: "$280",
        imagen: "img/assc-Sadboyz Angeles.webp",
        stock: 3
    }
];

const contenedor = document.getElementById('contenedor-productos');
const buscador = document.getElementById('buscador');

// Función para mostrar las playeras en pantalla
function mostrarProductos(lista) {
    contenedor.innerHTML = '';
    lista.forEach(p => {
        const card = document.createElement('div');
        card.classList.add('producto-card');
        card.innerHTML = `
            <img src="${p.imagen}" alt="${p.nombre}">
            <h3>${p.nombre}</h3>
            <p class="precio">${p.precio}</p>
            <p>Disponibles: ${p.stock}</p>
            <a href="https://wa.me/527821702426" class="btn-whatsapp">Pedir por WhatsApp</a>
        `;
        contenedor.appendChild(card);
    });
}

// Lógica del buscador
buscador.addEventListener('keyup', (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(texto));
    mostrarProductos(filtrados);
});

// Lógica de los botones de categoría
function filtrar(cat) {
    if(cat === 'todos') return mostrarProductos(productos);
    const filtrados = productos.filter(p => p.categoria === cat);
    mostrarProductos(filtrados);
}

// Iniciamos la página mostrando todo
mostrarProductos(productos);