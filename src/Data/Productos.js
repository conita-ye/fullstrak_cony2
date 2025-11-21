

const INICIAL_PRODUCTOS = [
 
  //  CONSOLAS
 
  {
    id: 1,
    nombre: "PlayStation 5 Slim",
    precio: 589990,
    categoria: "consolas",
    imagen: "https://example.com/ps5slim.jpg",
    descripcion: "Nueva versión PS5 Slim con control DualSense. Ideal para juegos en 4K.",
    rating: 4.9,
    stock: 10,
    reviews: []
  },
  {
    id: 2,
    nombre: "Nintendo Switch OLED Edición Rosa Pastel",
    precio: 429990,
    categoria: "consolas",
    imagen: "https://example.com/switch-rosa.jpg",
    descripcion: "Consola híbrida ideal para jugar Zelda, Mario y más. Edición especial rosada.",
    rating: 4.8,
    stock: 15,
    reviews: []
  },
  {
    id: 3,
    nombre: "Xbox Series S",
    precio: 299990,
    categoria: "consolas",
    imagen: "https://example.com/xboxs.jpg",
    descripcion: "Consola digital compacta y potente para juegos Game Pass.",
    rating: 4.6,
    stock: 20,
    reviews: []
  },

  
  //  VIDEOJUEGOS EN CD / FÍSICOS

  {
    id: 4,
    nombre: "Fortnite Minty Legends Pack (Físico)",
    precio: 29990,
    categoria: "juegos",
    imagen: "https://example.com/mintyfortnite.jpg",
    descripcion: "Caja física con código para skins Minty Legends.",
    rating: 4.7,
    stock: 45,
    reviews: []
  },
  {
    id: 5,
    nombre: "Spider-Man 2 PS5 (Físico)",
    precio: 54990,
    categoria: "juegos",
    imagen: "https://example.com/spiderman2.jpg",
    descripcion: "Juego exclusivo de PS5 en formato físico.",
    rating: 5.0,
    stock: 30,
    reviews: []
  },
  {
    id: 6,
    nombre: "Mario Kart 8 Deluxe (Nintendo Switch) Físico",
    precio: 46990,
    categoria: "juegos",
    imagen: "https://example.com/mariokart8.jpg",
    descripcion: "Carreras multijugador para Switch. Uno de los juegos más vendidos.",
    rating: 4.9,
    stock: 25,
    reviews: []
  },
  {
    id: 7,
    nombre: "Call of Duty Modern Warfare III (PS5) Físico",
    precio: 54990,
    categoria: "juegos",
    imagen: "https://example.com/codmw3.jpg",
    descripcion: "Edición física del nuevo título de la saga COD.",
    rating: 4.5,
    stock: 18,
    reviews: []
  },

  //  GIFT CARDS Y CÓDIGOS DIGITALES
  
  {
    id: 8,
    nombre: "Pavos Fortnite – 2.800 V-Bucks",
    precio: 13990,
    categoria: "fortnite",
    imagen: "https://example.com/vbucks2800.jpg",
    descripcion: "Entrega inmediata por correo o WhatsApp.",
    rating: 4.9,
    stock: 500,
    reviews: []
  },
  {
    id: 9,
    nombre: "Tarjeta PlayStation Store 20 USD",
    precio: 20990,
    categoria: "giftcards",
    imagen: "https://example.com/ps20.jpg",
    descripcion: "Código digital canjeable en PS4 y PS5.",
    rating: 4.8,
    stock: 300,
    reviews: []
  },
  {
    id: 10,
    nombre: "Xbox Game Pass Ultimate – 1 mes",
    precio: 10990,
    categoria: "giftcards",
    imagen: "https://example.com/gamepass1m.jpg",
    descripcion: "Accede a más de 100 juegos incluyendo EA Play.",
    rating: 4.7,
    stock: 250,
    reviews: []
  },

  
  // ACCESORIOS GAMER ROSADOS / FEMENINOS
 
  {
    id: 11,
    nombre: "Mouse Gamer Rosa RGB",
    precio: 15990,
    categoria: "accesorios",
    imagen: "https://example.com/mousepink.jpg",
    descripcion: "Mouse ligero con luces RGB pastel. Ideal para setup femenino.",
    rating: 4.9,
    stock: 40,
    reviews: []
  },
  {
    id: 12,
    nombre: "Teclado Mecánico Rosa + Morado LED",
    precio: 34990,
    categoria: "accesorios",
    imagen: "https://example.com/tecladorosa.jpg",
    descripcion: "Teclado mecánico con switches azules y RGB violeta.",
    rating: 5.0,
    stock: 30,
    reviews: []
  },
  {
    id: 13,
    nombre: "Headset Gamer Kitty Rosa LED",
    precio: 29990,
    categoria: "accesorios",
    imagen: "https://example.com/kittyheadset.jpg",
    descripcion: "Audífonos con orejitas LED. Súper cute y cómodos.",
    rating: 5.0,
    stock: 25,
    reviews: []
  }
];


// CATEGORÍAS 
export const categorias = [
  { id: "todos", nombre: "Todos" },
  { id: "consolas", nombre: "Consolas" },
  { id: "juegos", nombre: "Videojuegos Físicos" },
  { id: "fortnite", nombre: "Fortnite" },
  { id: "giftcards", nombre: "Gift Cards" },
  { id: "accesorios", nombre: "Accesorios Gamer" }
];


// STORAGE PERSONALIZADO

const STORAGE_KEY = "tienda_gamer_cony_productos_v2";

const cargarProductos = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INICIAL_PRODUCTOS));
  return INICIAL_PRODUCTOS.slice();
};

let productos = cargarProductos();

const guardarProductos = (lista) => {
  productos = lista;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
};

// CRUD
export const obtenerProductos = () => productos.slice();
export const obtenerProductoPorId = (id) => productos.find(p => p.id === parseInt(id));
export const obtenerProductosPorCategoria = (categoria) =>
  categoria === "todos" ? productos.slice() : productos.filter(p => p.categoria === categoria);

export const agregarProducto = (producto) => {
  const nuevo = { ...producto, id: productos.length ? Math.max(...productos.map(p => p.id)) + 1 : 1 };
  const lista = [...productos, nuevo];
  guardarProductos(lista);
  return nuevo;
};

export const actualizarProducto = (id, cambios) => {
  const lista = productos.map(p => p.id === parseInt(id) ? { ...p, ...cambios } : p);
  guardarProductos(lista);
  return obtenerProductoPorId(id);
};

export const eliminarProducto = (id) => {
  const lista = productos.filter(p => p.id !== parseInt(id));
  guardarProductos(lista);
  return true;
};
