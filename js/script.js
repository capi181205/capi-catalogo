/* ==============================================
   SCRIPT.JS — CAPI Print Studio PRO
   Contiene: base de datos de productos,
   catálogo, buscador, filtros, orden,
   personalización y productos relacionados.
   ============================================== */


/* =============================================
   1. BASE DE DATOS DE PRODUCTOS
   Agrega aquí cada playera que vendas.
   Estructura de carpetas de imágenes:
     img/belicas/   → playeras bélicas/urbanas
     img/jdm/       → autos y JDM
     img/anime/     → anime
     img/futbol/    → equipos de fútbol
     img/personalizadas/ → ejemplos de personalizados
   
   Campos de cada producto:
     id            → número único, nunca repetir
     nombre        → nombre completo de la playera
     categoria     → belica | jdm | anime | futbol | personalizada
     precioNum     → número sin símbolo (para ordenar)
     precio        → precio con símbolo para mostrar
     precioAntes   → precio tachado (opcional, omitir si no aplica)
     imagen        → ruta de imagen principal
     imagenes      → array de todas las imágenes del producto
     composicion   → material de la playera
     caracteristicas → array de puntos clave
     lavado        → instrucciones de lavado
     stock         → cantidad disponible (<=3 muestra badge rojo)
     tallas        → todas las tallas del producto
     tallasDisponibles → solo las que tienen stock
============================================== */
const productos = [
    {
        id: 1,
        nombre: "Playera ASSC Corridos Tumbados",
        categoria: "belica",
        precioNum: 280,
        precio: "$280",
        precioAntes: "$350",
        imagen: "img/ASSC/assc-corridos-tumbados.webp",
        imagenes: [
            "img/ASSC/assc-corridos-tumbados.webp",
            "img/ASSC/assc-corridos-tumbados-2.webp",
            "img/ASSC/assc-corridos-tumbados-3.webp"
        ],
        composicion: "100% Algodón Premium",
        caracteristicas: ["Corte Regular", "Estampado DTF alta resolución", "Cuello redondo reforzado"],
        lavado: "Lavar a mano con agua fría. No usar secadora. Planchar al revés.",
        stock: 5,
        tallas: ["S", "M", "L", "XL", "XXL"],
        tallasDisponibles: ["M", "L", "XL"]
    },
    {
        id: 2,
        nombre: "Playera ASSC Sadboys",
        categoria: "belica",
        precioNum: 280,
        precio: "$280",
        precioAntes: null,
        imagen: "img/ASSC/assc-Sadboys-Angeles.webp",
        imagenes: ["img/ASSC/assc-Sadboys-Angeles.webp"],
        composicion: "100% Algodón tacto suave",
        caracteristicas: ["Diseño exclusivo", "Impresión duradera", "Talla única"],
        lavado: "Lavar con colores similares. Evitar exprimir fuertemente el estampado.",
        stock: 3,
        tallas: ["S", "M", "L", "XL", "XXL"],
        tallasDisponibles: ["S", "M", "L"]
    },
    /* ─── EJEMPLO DE PRODUCTO JDM ──────────────────
    {
        id: 3,
        nombre: "Playera Toyota Supra MK4",
        categoria: "jdm",
        precioNum: 280,
        precio: "$280",
        precioAntes: null,
        imagen: "img/jdm/supra-mk4.webp",
        imagenes: ["img/jdm/supra-mk4.webp"],
        composicion: "100% Algodón Premium",
        caracteristicas: ["Diseño JDM exclusivo", "Estampado DTF", "Corte Regular"],
        lavado: "Lavar a mano con agua fría. Planchar al revés.",
        stock: 8,
        tallas: ["S", "M", "L", "XL", "XXL"],
        tallasDisponibles: ["S", "M", "L", "XL", "XXL"]
    },
    ─────────────────────────────────────────────── */
    /* ─── EJEMPLO DE PRODUCTO ANIME ────────────────
    {
        id: 4,
        nombre: "Playera Naruto Akatsuki",
        categoria: "anime",
        precioNum: 260,
        precio: "$260",
        precioAntes: null,
        imagen: "img/anime/naruto-akatsuki.webp",
        imagenes: ["img/anime/naruto-akatsuki.webp"],
        composicion: "100% Algodón",
        caracteristicas: ["Diseño anime", "Estampado DTF", "Corte Oversize"],
        lavado: "Lavar a mano. No usar cloro.",
        stock: 6,
        tallas: ["S", "M", "L", "XL"],
        tallasDisponibles: ["M", "L", "XL"]
    },
    ─────────────────────────────────────────────── */
];


/* =============================================
   2. VARIABLES GLOBALES
   listaMostrada → guarda la lista actual filtrada/ordenada
   para que el ordenar no rompa el filtro activo.
============================================== */
const contenedor = document.getElementById('contenedor-productos');
const buscador   = document.getElementById('buscador');
let listaMostrada = [...productos];


/* =============================================
   3. MOSTRAR PRODUCTOS
   Recibe un array de productos y renderiza las tarjetas.
   Incluye: badge de urgencia, precio tachado,
   contador de visitas y botón de WhatsApp.
============================================== */
function mostrarProductos(lista) {
    if (!contenedor) return;
    listaMostrada = lista;
    contenedor.innerHTML = '';

    /* Si no hay resultados, mostrar mensaje + link a WhatsApp */
    if (lista.length === 0) {
        contenedor.innerHTML = `
            <div class="sin-resultados">
                <p>No encontramos esa playera 😔</p>
                <a href="https://wa.me/527821702426?text=${encodeURIComponent('Hola! Busco una playera que no encontré en el catálogo')}"
                   target="_blank" class="btn-whatsapp-inline">
                   Escríbenos y la conseguimos 💬
                </a>
            </div>`;
        return;
    }

    lista.forEach(p => {
        const card = document.createElement('div');
        card.classList.add('producto-card');

        /* Al clic en la tarjeta, ir a página de detalle con el ID del producto */
        card.onclick = () => { window.location.href = `producto.html?id=${p.id}`; };

        /* Badge rojo de urgencia si quedan 3 o menos unidades */
        const badgeUrgencia = p.stock <= 3
            ? `<span class="badge-urgente">⚡ Últimas ${p.stock}</span>`
            : '';

        /* Precio tachado si el producto tiene precioAntes definido */
        const precioHTML = p.precioAntes
            ? `<p class="precio"><span class="precio-antes">${p.precioAntes}</span> ${p.precio}</p>`
            : `<p class="precio">${p.precio}</p>`;

        /* Contador de visitas guardado en localStorage por producto */
        const visitas = registrarVisita(p.id);
        const visitasHTML = visitas > 5
            ? `<p class="visitas-label">👁 ${visitas} personas lo vieron esta semana</p>`
            : '';

        /* Mensaje para WhatsApp desde la tarjeta (sin talla aún) */
        const msgWA = encodeURIComponent(`Hola! Me interesa la ${p.nombre}`);

        card.innerHTML = `
            <div class="card-imagen-wrap">
                ${badgeUrgencia}
                <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
            </div>
            <h3>${p.nombre}</h3>
            ${precioHTML}
            <p class="stock-label">Disponibles: ${p.stock}</p>
            ${visitasHTML}
            <a href="https://wa.me/527821702426?text=${msgWA}"
               class="btn-whatsapp"
               onclick="event.stopPropagation();"
               target="_blank">Pedir por WhatsApp</a>
        `;
        contenedor.appendChild(card);
    });
}


/* =============================================
   4. CONTADOR DE VISITAS (localStorage)
   Guarda cuántas veces se vio cada producto.
   Devuelve el número de visitas de esa semana.
   El contador se resetea cada 7 días.
============================================== */
function registrarVisita(id) {
    const key   = `visitas_${id}`;
    const hoy   = Date.now();
    const datos = JSON.parse(localStorage.getItem(key) || '{"count":0,"desde":0}');

    /* Si pasaron más de 7 días, reiniciar el contador */
    if (hoy - datos.desde > 7 * 24 * 60 * 60 * 1000) {
        datos.count = 0;
        datos.desde = hoy;
    }
    datos.count++;
    localStorage.setItem(key, JSON.stringify(datos));
    return datos.count;
}


/* =============================================
   5. BUSCADOR EN TIEMPO REAL
   Filtra por nombre mientras el usuario escribe.
   Quita el botón activo de los filtros al buscar.
============================================== */
if (buscador) {
    buscador.addEventListener('keyup', (e) => {
        const texto    = e.target.value.toLowerCase().trim();
        const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(texto));
        mostrarProductos(filtrados);
        document.querySelectorAll('nav button').forEach(b => b.classList.remove('activo'));
        /* Resetear el selector de orden */
        const orden = document.getElementById('orden');
        if (orden) orden.value = 'default';
    });
}


/* =============================================
   6. FILTRADO POR CATEGORÍA
   Muestra solo los productos de la categoría elegida.
   Marca el botón seleccionado como "activo".
   Limpia el buscador al filtrar.
============================================== */
function filtrar(cat, btn) {
    /* Marcar botón activo y desmarcar los demás */
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('activo'));
    if (btn) btn.classList.add('activo');

    /* Limpiar buscador y resetear orden */
    if (buscador) buscador.value = '';
    const orden = document.getElementById('orden');
    if (orden) orden.value = 'default';

    const filtrados = cat === 'todos'
        ? [...productos]
        : productos.filter(p => p.categoria === cat);

    mostrarProductos(filtrados);
}


/* =============================================
   7. ORDENAR PRODUCTOS
   Ordena la lista ACTUALMENTE visible (no el total).
   Así respeta el filtro de categoría activo.
   Opciones: precio asc, precio desc, nombre A-Z.
============================================== */
function ordenarProductos(criterio) {
    /* Clonar la lista actual para no mutar el array original */
    let lista = [...listaMostrada];

    if (criterio === 'precio-asc')  lista.sort((a, b) => a.precioNum - b.precioNum);
    if (criterio === 'precio-desc') lista.sort((a, b) => b.precioNum - a.precioNum);
    if (criterio === 'nombre')      lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
    if (criterio === 'default')     lista = [...listaMostrada];

    mostrarProductos(lista);
}


/* =============================================
   8. SECCIÓN DE PERSONALIZACIÓN
   Recoge nombre, descripción y talla del formulario.
   Arma un mensaje completo y abre WhatsApp.
============================================== */
function pedirPersonalizada() {
    const nombre = document.getElementById('custom-nombre').value.trim();
    const diseno = document.getElementById('custom-diseno').value.trim();
    const talla  = document.getElementById('custom-talla').value;

    /* Validar que al menos el diseño esté lleno */
    if (!diseno) {
        alert('Por favor describe tu diseño antes de continuar.');
        return;
    }

    const msg = `Hola! Quiero pedir una playera personalizada.\n`
              + `Nombre: ${nombre || 'No especificado'}\n`
              + `Diseño: ${diseno}\n`
              + `Talla: ${talla || 'No especificada'}`;

    window.open(`https://wa.me/527821702426?text=${encodeURIComponent(msg)}`, '_blank');
}


/* =============================================
   9. CARGA INICIAL
   Al cargar la página, reemplaza los skeletons
   con los productos reales después de 300ms.
   El pequeño delay hace que el skeleton se vea.
============================================== */
setTimeout(() => {
    mostrarProductos(productos);
}, 300);