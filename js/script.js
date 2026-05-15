/* ==============================================
   SCRIPT.JS — CAPI Print Studio PRO v2.1
   CORRECCIÓN: productos[] declarado al tope del
   archivo, sin ninguna dependencia del DOM en el
   scope global. Así producto.html puede usar la
   variable en cuanto el <script> termina de cargar.
   ============================================== */


/* =============================================
   1. BASE DE DATOS DE PRODUCTOS  ← SIEMPRE PRIMERO
   ─────────────────────────────────────────────
   Campos de badge (elige uno por producto):
     badge: 'nuevo'    → morado  "NUEVO"
     badge: 'best'     → naranja "BEST SELLER"
     badge: 'premium'  → dorado  "PREMIUM"
     badge: null       → sin badge extra
   Si stock <= 3 el badge rojo "Últimas X" se
   agrega automáticamente, sin importar el campo.
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
        caracteristicas: [
            "Corte Regular",
            "Estampado DTF alta resolución",
            "Cuello redondo reforzado"
        ],
        lavado: "Lavar a mano con agua fría. No usar secadora. Planchar al revés.",
        stock: 5,
        tallas: ["S", "M", "L", "XL", "XXL"],
        tallasDisponibles: ["M", "L", "XL"],
        badge: "best"
    },
    {
        id: 2,
        nombre: "Playera ASSC Sadboys",
        categoria: "belica",
        precioNum: 280,
        precio: "$280",
        precioAntes: null,
        imagen: "img/ASSC/assc-Sadboys-Angeles.webp",
        imagenes: [
            "img/ASSC/assc-Sadboys-Angeles.webp"
        ],
        composicion: "100% Algodón tacto suave",
        caracteristicas: [
            "Diseño exclusivo",
            "Impresión duradera",
            "Talla única oversize"
        ],
        lavado: "Lavar con colores similares. Evitar exprimir fuertemente el estampado.",
        stock: 3,
        tallas: ["S", "M", "L", "XL", "XXL"],
        tallasDisponibles: ["S", "M", "L"],
        badge: "nuevo"
    }
    /*
    ── CÓMO AGREGAR MÁS PRODUCTOS ──────────────
    Agrega una coma después del último producto
    y copia este bloque:

    ,{
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
        tallasDisponibles: ["S", "M", "L", "XL", "XXL"],
        badge: null
    }
    ──────────────────────────────────────────── */
];


/* =============================================
   2. CARRITO — estado global
============================================== */
let carrito = JSON.parse(localStorage.getItem('capi_carrito') || '[]');


/* =============================================
   3. UTILIDADES
============================================== */

/* Quita acentos y pasa a minúsculas */
function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

/* Persiste el carrito y refresca el badge */
function guardarCarrito() {
    localStorage.setItem('capi_carrito', JSON.stringify(carrito));
    actualizarBadgeCarrito();
}

/* Badge del botón 🛒 */
function actualizarBadgeCarrito() {
    const badge = document.getElementById('carrito-badge');
    if (!badge) return;
    const total = carrito.reduce((sum, i) => sum + i.cantidad, 0);
    badge.textContent = total;
}

/* Contador de visitas (localStorage, resetea cada 7 días) */
function registrarVisita(id) {
    const key   = `visitas_${id}`;
    const hoy   = Date.now();
    const datos = JSON.parse(localStorage.getItem(key) || '{"count":0,"desde":0}');
    if (hoy - datos.desde > 7 * 24 * 60 * 60 * 1000) { datos.count = 0; datos.desde = hoy; }
    datos.count++;
    localStorage.setItem(key, JSON.stringify(datos));
    return datos.count;
}


/* =============================================
   4. CATÁLOGO — renderizar tarjetas
============================================== */
function mostrarProductos(lista) {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;

    window._listaMostrada = lista;
    contenedor.innerHTML  = '';

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
        card.onclick = () => { window.location.href = `producto.html?id=${p.id}`; };

        /* Badges */
        const badges = [];
        if (p.stock <= 3)          badges.push(`<span class="badge badge-urgente">⚡ Últimas ${p.stock}</span>`);
        if (p.badge === 'nuevo')   badges.push(`<span class="badge badge-nuevo">Nuevo</span>`);
        if (p.badge === 'best')    badges.push(`<span class="badge badge-best">Best Seller</span>`);
        if (p.badge === 'premium') badges.push(`<span class="badge badge-premium">★ Premium</span>`);
        const badgesHTML = badges.length ? `<div class="badges-wrap">${badges.join('')}</div>` : '';

        /* Precio tachado */
        const precioHTML = p.precioAntes
            ? `<p class="precio"><span class="precio-antes">${p.precioAntes}</span> ${p.precio}</p>`
            : `<p class="precio">${p.precio}</p>`;

        /* Visitas */
        const visitas    = registrarVisita(p.id);
        const visitasHTML = visitas > 5
            ? `<p class="visitas-label">👁 ${visitas} personas lo vieron esta semana</p>`
            : '';

        const enCarrito = carrito.some(i => i.id === p.id);
        const msgWA     = encodeURIComponent(`Hola! Me interesa la ${p.nombre}`);

        card.innerHTML = `
            <div class="card-imagen-wrap">
                ${badgesHTML}
                <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
            </div>
            <h3>${p.nombre}</h3>
            ${precioHTML}
            <p class="stock-label">Disponibles: ${p.stock}</p>
            ${visitasHTML}
            <div class="card-actions">
                <a href="https://wa.me/527821702426?text=${msgWA}"
                   class="btn-whatsapp"
                   onclick="event.stopPropagation();"
                   target="_blank">Pedir por WA</a>
                <button class="btn-add-carrito ${enCarrito ? 'agregado' : ''}"
                    title="Agregar a lista de pedido"
                    onclick="event.stopPropagation(); toggleCarritoProducto(${p.id}, this)">
                    ${enCarrito ? '✓' : '+'}
                </button>
            </div>
        `;
        contenedor.appendChild(card);
    });
}


/* =============================================
   5. FILTROS Y ORDEN
============================================== */
function filtrar(cat, btn) {
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('activo'));
    if (btn) btn.classList.add('activo');

    const buscador = document.getElementById('buscador');
    if (buscador) buscador.value = '';
    const orden = document.getElementById('orden');
    if (orden)   orden.value = 'default';

    const filtrados = cat === 'todos'
        ? [...productos]
        : productos.filter(p => p.categoria === cat);

    mostrarProductos(filtrados);
}

function ordenarProductos(criterio) {
    const base = window._listaMostrada || [...productos];
    let lista  = [...base];
    if (criterio === 'precio-asc')  lista.sort((a, b) => a.precioNum - b.precioNum);
    if (criterio === 'precio-desc') lista.sort((a, b) => b.precioNum - a.precioNum);
    if (criterio === 'nombre')      lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
    mostrarProductos(lista);
}


/* =============================================
   6. BUSCADOR FUZZY
============================================== */
function initBuscador() {
    const buscador = document.getElementById('buscador');
    if (!buscador) return;
    buscador.addEventListener('keyup', (e) => {
        const texto     = normalizar(e.target.value.trim());
        const filtrados = productos.filter(p => normalizar(p.nombre).includes(texto));
        mostrarProductos(filtrados);
        document.querySelectorAll('nav button').forEach(b => b.classList.remove('activo'));
        const orden = document.getElementById('orden');
        if (orden) orden.value = 'default';
    });
}


/* =============================================
   7. PERSONALIZACIÓN
============================================== */
function pedirPersonalizada() {
    const nombre = document.getElementById('custom-nombre').value.trim();
    const diseno = document.getElementById('custom-diseno').value.trim();
    const talla  = document.getElementById('custom-talla').value;
    if (!diseno) { alert('Por favor describe tu diseño antes de continuar.'); return; }
    const msg = `Hola! Quiero pedir una playera personalizada.\nNombre: ${nombre || 'No especificado'}\nDiseño: ${diseno}\nTalla: ${talla || 'No especificada'}`;
    window.open(`https://wa.me/527821702426?text=${encodeURIComponent(msg)}`, '_blank');
}


/* =============================================
   8. FAQ ACORDEÓN
============================================== */
function toggleFaq(btn) {
    const respuesta   = btn.nextElementSibling;
    const estaAbierta = btn.classList.contains('abierta');

    document.querySelectorAll('.faq-pregunta').forEach(b => {
        b.classList.remove('abierta');
        b.nextElementSibling.classList.remove('abierta');
    });

    if (!estaAbierta) {
        btn.classList.add('abierta');
        respuesta.classList.add('abierta');
    }
}


/* =============================================
   9. CARRITO MULTI-PEDIDO
============================================== */
function toggleCarritoProducto(id, btn) {
    const idx = carrito.findIndex(i => i.id === id);

    if (idx !== -1) {
        carrito.splice(idx, 1);
        btn.textContent = '+';
        btn.classList.remove('agregado');
        guardarCarrito();
        renderCarrito();
        return;
    }

    const p = productos.find(prod => prod.id === id);
    if (!p) return;

    let tallaElegida = null;
    if (p.tallasDisponibles && p.tallasDisponibles.length > 0) {
        tallaElegida = prompt(
            `¿Qué talla quieres de "${p.nombre}"?\nDisponibles: ${p.tallasDisponibles.join(', ')}`
        );
        if (tallaElegida === null) return;
        tallaElegida = tallaElegida.trim().toUpperCase();
        const disponiblesUpper = p.tallasDisponibles.map(t => t.toUpperCase());
        if (!disponiblesUpper.includes(tallaElegida)) {
            alert(`Talla "${tallaElegida}" no disponible.\nElige entre: ${p.tallasDisponibles.join(', ')}`);
            return;
        }
    }

    carrito.push({
        id:        p.id,
        nombre:    p.nombre,
        precio:    p.precio,
        precioNum: p.precioNum,
        imagen:    p.imagen,
        talla:     tallaElegida,
        cantidad:  1
    });

    btn.textContent = '✓';
    btn.classList.add('agregado');
    guardarCarrito();
    renderCarrito();
    abrirCarrito();
}

function cambiarCantidad(idx, delta) {
    carrito[idx].cantidad += delta;
    if (carrito[idx].cantidad < 1) carrito.splice(idx, 1);
    guardarCarrito();
    renderCarrito();
    mostrarProductos(window._listaMostrada || productos);
}

function quitarDelCarrito(idx) {
    carrito.splice(idx, 1);
    guardarCarrito();
    renderCarrito();
    mostrarProductos(window._listaMostrada || productos);
}

function vaciarCarrito() {
    if (!confirm('¿Vaciar toda la lista?')) return;
    carrito = [];
    guardarCarrito();
    renderCarrito();
    mostrarProductos(window._listaMostrada || productos);
}

function renderCarrito() {
    const contenedorItems = document.getElementById('carrito-items');
    if (!contenedorItems) return;

    if (carrito.length === 0) {
        contenedorItems.innerHTML = '<p class="carrito-vacio">Aún no has agregado productos.</p>';
        return;
    }

    contenedorItems.innerHTML = carrito.map((item, idx) => `
        <div class="carrito-item">
            <img src="${item.imagen}" alt="${item.nombre}">
            <div class="carrito-item-info">
                <p class="carrito-item-nombre">${item.nombre}</p>
                <p class="carrito-item-precio">${item.precio}</p>
                ${item.talla ? `<p class="carrito-item-talla">Talla: <strong>${item.talla}</strong></p>` : ''}
                <div class="carrito-cantidad">
                    <button onclick="cambiarCantidad(${idx}, -1)">−</button>
                    <span>${item.cantidad}</span>
                    <button onclick="cambiarCantidad(${idx}, 1)">+</button>
                </div>
            </div>
            <button class="btn-quitar-item" onclick="quitarDelCarrito(${idx})" title="Quitar">✕</button>
        </div>
    `).join('');
}

function abrirCarrito() {
    const panel   = document.getElementById('carrito-panel');
    const overlay = document.getElementById('carrito-overlay');
    if (panel)   panel.classList.add('abierto');
    if (overlay) overlay.classList.add('visible');
    renderCarrito();
}

function cerrarCarrito() {
    const panel   = document.getElementById('carrito-panel');
    const overlay = document.getElementById('carrito-overlay');
    if (panel)   panel.classList.remove('abierto');
    if (overlay) overlay.classList.remove('visible');
}

function pedirTodo() {
    if (carrito.length === 0) {
        alert('Tu lista está vacía. Agrega al menos una playera.');
        return false;
    }
    const lineas = carrito.map(i => {
        const talla = i.talla ? ` | Talla: ${i.talla}` : '';
        return `• ${i.nombre}${talla} | Cant: ${i.cantidad} | ${i.precio}`;
    });
    const total = carrito.reduce((sum, i) => sum + i.precioNum * i.cantidad, 0);
    const msg   = `Hola! Quiero hacer un pedido:\n\n${lineas.join('\n')}\n\nTotal aprox: $${total} MXN`;
    window.open(`https://wa.me/527821702426?text=${encodeURIComponent(msg)}`, '_blank');
    return false;
}


/* =============================================
   10. CRONÓMETRO DE URGENCIA
   Cambia HORA_CORTE para ajustar tu horario.
============================================== */
function iniciarCronometro() {
    const horaCorteEl = document.getElementById('hora-corte');
    const hEl = document.getElementById('crono-h');
    const mEl = document.getElementById('crono-m');
    const sEl = document.getElementById('crono-s');
    if (!horaCorteEl || !hEl) return;

    const HORA_CORTE = 18; /* 6:00 PM */
    horaCorteEl.textContent = '6:00 PM';

    function tick() {
        const ahora = new Date();
        const corte = new Date(ahora);
        corte.setHours(HORA_CORTE, 0, 0, 0);
        if (ahora >= corte) corte.setDate(corte.getDate() + 1);

        const diff = corte - ahora;
        const h    = Math.floor(diff / 3600000);
        const m    = Math.floor((diff % 3600000) / 60000);
        const s    = Math.floor((diff % 60000) / 1000);

        hEl.textContent = String(h).padStart(2, '0');
        mEl.textContent = String(m).padStart(2, '0');
        sEl.textContent = String(s).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
}


/* =============================================
   11. ARRANQUE — DOMContentLoaded
   ─────────────────────────────────────────────
   Los datos (productos[]) ya están disponibles
   ANTES de este evento, porque están declarados
   arriba en el scope global del archivo.

   Este bloque solo inicializa lo que neces9ita
   el DOM, que en producto.html lo maneja el
   propio <script> inline de esa página.
============================================== */
document.addEventListener('DOMContentLoaded', () => {

    /* Badge del carrito (ambas páginas) */
    actualizarBadgeCarrito();

    /* ── Solo en index.html ─────────────────── */
    if (document.getElementById('contenedor-productos')) {
        setTimeout(() => mostrarProductos(productos), 350);
        initBuscador();
        iniciarCronometro();

        /* Link del botón flotante en index */
        const waFlotante = document.getElementById('wa-flotante');
        if (waFlotante) {
            waFlotante.href = `https://wa.me/527821702426?text=${encodeURIComponent('Hola! Estoy en el catálogo y tengo una duda')}`;
        }
    }

    /* ── producto.html lo inicializa su propio ── */
    /* bloque <script> porque necesita leer la    */
    /* URL antes de tocar el DOM.                 */
});