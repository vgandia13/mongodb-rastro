// =====================================================================
// Rastro — Entrega MongoDB (Parte B)
// Ejecutar en mongosh:
//   docker exec -it mongodb-practica mongosh -u admin -p admin_dev_123 --authenticationDatabase admin
// y pegar los bloques en orden.
// =====================================================================

// Ejercicio B0 — Preparar la base de datos (reinicio para empezar de cero)
use rastro
db.dropDatabase()

// Ejercicio B1 — Cargar los datos
db.usuarios.insertMany([
  { _id: ObjectId("660000000000000000000001"), nombre: "Ana García",  email: "ana@rastro.es",   ciudad: "Valencia",  fechaAlta: new Date("2025-03-10"), favoritos: [ObjectId("670000000000000000000008")], valoracionMedia: 0, numValoraciones: 0 },
  { _id: ObjectId("660000000000000000000002"), nombre: "Luis Martín", email: "luis@rastro.es",  ciudad: "Valencia",  fechaAlta: new Date("2024-11-02"), favoritos: [], valoracionMedia: 0, numValoraciones: 0 },
  { _id: ObjectId("660000000000000000000003"), nombre: "Marta Ruiz",  email: "marta@rastro.es", ciudad: "Alicante",  fechaAlta: new Date("2025-06-21"), favoritos: [], valoracionMedia: 5, numValoraciones: 1 },
  { _id: ObjectId("660000000000000000000004"), nombre: "Hugo Sanz",   email: "hugo@rastro.es",  ciudad: "Castellón", fechaAlta: new Date("2026-01-15"), favoritos: [], valoracionMedia: 0, numValoraciones: 0 },
  { _id: ObjectId("660000000000000000000005"), nombre: "Sara López",  email: "sara@rastro.es",  ciudad: "Valencia",  fechaAlta: new Date("2026-09-30"), favoritos: [ObjectId("670000000000000000000001"), ObjectId("670000000000000000000003"), ObjectId("670000000000000000000008")], valoracionMedia: 0, numValoraciones: 0 }
])

db.anuncios.insertMany([
  { _id: ObjectId("670000000000000000000001"), titulo: "Seat Ibiza 2015", descripcion: "Siempre en garaje, ITV pasada.", precio: 6500, categoria: "Coches", estado: "DISPONIBLE", ciudad: "Valencia", fechaPublicacion: new Date("2026-10-01"), visitas: 340,
    vendedor: { id: ObjectId("660000000000000000000002"), nombre: "Luis Martín" },
    fotos: [ { url: "https://img.rastro.es/a1-1.jpg", orden: 1 }, { url: "https://img.rastro.es/a1-2.jpg", orden: 2 } ],
    atributos: { marca: "Seat", modelo: "Ibiza", anio: 2015, km: 98000, combustible: "gasolina" } },
  { _id: ObjectId("670000000000000000000002"), titulo: "Ford Focus 2012", descripcion: "Correa cambiada hace un año.", precio: 4200, categoria: "Coches", estado: "DISPONIBLE", ciudad: "Castellón", fechaPublicacion: new Date("2026-10-12"), visitas: 95,
    vendedor: { id: ObjectId("660000000000000000000004"), nombre: "Hugo Sanz" },
    fotos: [ { url: "https://img.rastro.es/a2-1.jpg", orden: 1 } ],
    atributos: { marca: "Ford", modelo: "Focus", anio: 2012, km: 165000, combustible: "diésel" } },
  { _id: ObjectId("670000000000000000000003"), titulo: "iPhone 13 128 GB", descripcion: "Con funda y cargador.", precio: 380, categoria: "Móviles", estado: "DISPONIBLE", ciudad: "Valencia", fechaPublicacion: new Date("2026-10-20"), visitas: 512,
    vendedor: { id: ObjectId("660000000000000000000001"), nombre: "Ana García" },
    fotos: [ { url: "https://img.rastro.es/a3-1.jpg", orden: 1 }, { url: "https://img.rastro.es/a3-2.jpg", orden: 2 }, { url: "https://img.rastro.es/a3-3.jpg", orden: 3 } ],
    atributos: { marca: "Apple", modelo: "iPhone 13", almacenamientoGB: 128, bateriaPct: 87 } },
  { _id: ObjectId("670000000000000000000004"), titulo: "Samsung Galaxy A52", descripcion: "Pantalla sin rayas.", precio: 150, categoria: "Móviles", estado: "VENDIDO", ciudad: "Alicante", fechaPublicacion: new Date("2026-09-05"), visitas: 210,
    vendedor: { id: ObjectId("660000000000000000000003"), nombre: "Marta Ruiz" },
    fotos: [ { url: "https://img.rastro.es/a4-1.jpg", orden: 1 } ],
    atributos: { marca: "Samsung", modelo: "Galaxy A52", almacenamientoGB: 128, bateriaPct: 80 } },
  { _id: ObjectId("670000000000000000000005"), titulo: "Xiaomi Redmi Note 10", descripcion: "Funciona perfecto.", precio: 90, categoria: "Móviles", estado: "DISPONIBLE", ciudad: "Valencia", fechaPublicacion: new Date("2026-10-22"), visitas: 48,
    vendedor: { id: ObjectId("660000000000000000000002"), nombre: "Luis Martín" },
    fotos: [ { url: "https://img.rastro.es/a5-1.jpg", orden: 1 } ],
    atributos: { marca: "Xiaomi", modelo: "Redmi Note 10", almacenamientoGB: 64, bateriaPct: 91 } },
  { _id: ObjectId("670000000000000000000006"), titulo: "Chaqueta vaquera Levi's", descripcion: "Poco uso.", precio: 25, categoria: "Ropa", estado: "DISPONIBLE", ciudad: "Alicante", fechaPublicacion: new Date("2026-10-25"), visitas: 12,
    vendedor: { id: ObjectId("660000000000000000000003"), nombre: "Marta Ruiz" },
    fotos: [],
    atributos: { talla: "M", marca: "Levi's", genero: "unisex" } },
  { _id: ObjectId("670000000000000000000007"), titulo: "Zapatillas Nike Air", descripcion: "Talla 42, como nuevas.", precio: 40, categoria: "Ropa", estado: "RESERVADO", ciudad: "Valencia", fechaPublicacion: new Date("2026-10-18"), visitas: 77,
    vendedor: { id: ObjectId("660000000000000000000001"), nombre: "Ana García" },
    fotos: [ { url: "https://img.rastro.es/a7-1.jpg", orden: 1 } ],
    atributos: { talla: "42", marca: "Nike", genero: "hombre" } },
  { _id: ObjectId("670000000000000000000008"), titulo: "Mesa de comedor de roble", descripcion: "Para 6 personas.", precio: 120, categoria: "Muebles", estado: "DISPONIBLE", ciudad: "Castellón", fechaPublicacion: new Date("2026-10-26"), visitas: 160,
    vendedor: { id: ObjectId("660000000000000000000004"), nombre: "Hugo Sanz" },
    fotos: [ { url: "https://img.rastro.es/a8-1.jpg", orden: 1 } ],
    atributos: { material: "roble", ancho: 160, fondo: 90, alto: 75 } }
])

db.ofertas.insertMany([
  { _id: ObjectId("680000000000000000000001"), importe: 340, estado: "PENDIENTE", fecha: new Date("2026-10-27"),
    anuncio: { id: ObjectId("670000000000000000000003"), titulo: "iPhone 13 128 GB", precio: 380 },
    comprador: { id: ObjectId("660000000000000000000005"), nombre: "Sara López" } },
  { _id: ObjectId("680000000000000000000002"), importe: 6000, estado: "RECHAZADA", fecha: new Date("2026-10-05"),
    anuncio: { id: ObjectId("670000000000000000000001"), titulo: "Seat Ibiza 2015", precio: 6500 },
    comprador: { id: ObjectId("660000000000000000000001"), nombre: "Ana García" } },
  { _id: ObjectId("680000000000000000000003"), importe: 6200, estado: "PENDIENTE", fecha: new Date("2026-10-26"),
    anuncio: { id: ObjectId("670000000000000000000001"), titulo: "Seat Ibiza 2015", precio: 6500 },
    comprador: { id: ObjectId("660000000000000000000005"), nombre: "Sara López" } },
  { _id: ObjectId("680000000000000000000004"), importe: 150, estado: "ACEPTADA", fecha: new Date("2026-09-10"),
    anuncio: { id: ObjectId("670000000000000000000004"), titulo: "Samsung Galaxy A52", precio: 150 },
    comprador: { id: ObjectId("660000000000000000000004"), nombre: "Hugo Sanz" } },
  { _id: ObjectId("680000000000000000000005"), importe: 35, estado: "ACEPTADA", fecha: new Date("2026-10-27"),
    anuncio: { id: ObjectId("670000000000000000000007"), titulo: "Zapatillas Nike Air", precio: 40 },
    comprador: { id: ObjectId("660000000000000000000002"), nombre: "Luis Martín" } }
])

db.valoraciones.insertOne({
  anuncioId: ObjectId("670000000000000000000004"),
  autor: { id: ObjectId("660000000000000000000004"), nombre: "Hugo Sanz" },
  valoradoId: ObjectId("660000000000000000000003"),
  estrellas: 5, comentario: "Todo perfecto", fecha: new Date("2026-09-15")
})

// Comprobación: 5 usuarios, 8 anuncios, 5 ofertas, 1 valoración
db.usuarios.countDocuments()
db.anuncios.countDocuments()
db.ofertas.countDocuments()
db.valoraciones.countDocuments()


// Ejercicio B2 — Dos anuncios nuevos (sin _id: lo genera MongoDB)
db.anuncios.insertOne({
  titulo: "Bicicleta de montaña Orbea", descripcion: "Revisada en taller.", precio: 300,
  categoria: "Deporte", estado: "DISPONIBLE", ciudad: "Castellón",
  fechaPublicacion: new Date("2026-10-27"), visitas: 0,
  vendedor: { id: ObjectId("660000000000000000000004"), nombre: "Hugo Sanz" },
  fotos: [ { url: "https://img.rastro.es/bici-1.jpg", orden: 1 } ],
  atributos: { talla: "L", tipo: "montaña", pulgadasRueda: 29 }
})

db.anuncios.insertOne({
  titulo: "Google Pixel 7", descripcion: "Libre, con caja.", precio: 260,
  categoria: "Móviles", estado: "DISPONIBLE", ciudad: "Valencia",
  fechaPublicacion: new Date("2026-10-28"), visitas: 0,
  vendedor: { id: ObjectId("660000000000000000000005"), nombre: "Sara López" },
  fotos: [ { url: "https://img.rastro.es/pixel-1.jpg", orden: 1 }, { url: "https://img.rastro.es/pixel-2.jpg", orden: 2 } ],
  atributos: { marca: "Google", modelo: "Pixel 7", almacenamientoGB: 128, bateriaPct: 92 }
})


// Ejercicio B3 — Índices
// B3.1 Email único
db.usuarios.createIndex({ email: 1 }, { unique: true })
// B3.2 Un autor solo valora una vez cada anuncio (compra)
db.valoraciones.createIndex({ "autor.id": 1, anuncioId: 1 }, { unique: true })
// B3.3 Búsqueda por categoría ordenada por precio
db.anuncios.createIndex({ categoria: 1, precio: 1 })
// B3.4 Ver los índices
db.usuarios.getIndexes()
db.valoraciones.getIndexes()
db.anuncios.getIndexes()
// B3.5 El plan ganador debe ser IXSCAN sobre categoria_1_precio_1 (no COLLSCAN)
db.anuncios.find({ categoria: "Coches" }).sort({ precio: 1 }).explain().queryPlanner.winningPlan


// Ejercicio B4 — Romper la base de datos a propósito
// B4.1 Un usuario con el email de Ana
db.usuarios.insertOne({ nombre: "Ana Copia", email: "ana@rastro.es", ciudad: "Valencia", fechaAlta: new Date(), favoritos: [], valoracionMedia: 0, numValoraciones: 0 })

// B4.2 Hugo valora otra vez a Marta por el mismo anuncio
db.valoraciones.insertOne({ anuncioId: ObjectId("670000000000000000000004"), autor: { id: ObjectId("660000000000000000000004"), nombre: "Hugo Sanz" }, valoradoId: ObjectId("660000000000000000000003"), estrellas: 1, comentario: "Cambio de opinión", fecha: new Date() })

// B4.3 Un anuncio de un vendedor que no existe
db.anuncios.insertOne({ titulo: "Prueba fantasma", precio: 10, categoria: "Libros", estado: "DISPONIBLE", ciudad: "Valencia", fechaPublicacion: new Date(), visitas: 0, vendedor: { id: ObjectId("660000000000000000000099"), nombre: "Nadie" }, fotos: [], atributos: {} })

// B4.4 Un anuncio con el precio escrito como texto
db.anuncios.insertOne({ titulo: "Prueba lámpara", precio: "75", categoria: "Muebles", estado: "DISPONIBLE", ciudad: "Valencia", fechaPublicacion: new Date(), visitas: 0, vendedor: { id: ObjectId("660000000000000000000001"), nombre: "Ana García" }, fotos: [], atributos: { material: "metal" } })
db.anuncios.find({ precio: { $lt: 100 } }, { titulo: 1, precio: 1, _id: 0 })

// B4.5 Cambiar el precio del Xiaomi sin operador
db.anuncios.updateOne({ _id: ObjectId("670000000000000000000005") }, { precio: 80 })

// B4.6 Buscar el iPhone por su id escrito como texto
db.anuncios.findOne({ _id: "670000000000000000000003" })

// Limpieza: borrar los anuncios de prueba
db.anuncios.find({ titulo: /^Prueba/ }, { titulo: 1 })
db.anuncios.deleteMany({ titulo: /^Prueba/ })


// Ejercicio B5 — Consultas
// B5.1 DISPONIBLE en Valencia, título y precio, del más barato al más caro
db.anuncios.find({ estado: "DISPONIBLE", ciudad: "Valencia" }, { titulo: 1, precio: 1, _id: 0 }).sort({ precio: 1 })

// B5.2 Coches con menos de 100.000 km
db.anuncios.find({ categoria: "Coches", "atributos.km": { $lt: 100000 } })

// B5.3 Móviles con 128 GB o más
db.anuncios.find({ categoria: "Móviles", "atributos.almacenamientoGB": { $gte: 128 } })

// B5.4 Entre 50 y 400 € (incluidos)
db.anuncios.find({ precio: { $gte: 50, $lte: 400 } })

// B5.5 Título contiene "nike" sin importar mayúsculas
db.anuncios.find({ titulo: /nike/i })

// B5.6 Anuncios de Luis Martín, por su id
db.anuncios.find({ "vendedor.id": ObjectId("660000000000000000000002") })

// B5.7 Anuncios sin ninguna foto
db.anuncios.find({ fotos: { $size: 0 } })

// B5.8 Ofertas PENDIENTE del Seat Ibiza
db.ofertas.find({ "anuncio.id": ObjectId("670000000000000000000001"), estado: "PENDIENTE" })

// B5.9 Usuarios con la mesa de roble en favoritos (solo nombre)
db.usuarios.find({ favoritos: ObjectId("670000000000000000000008") }, { nombre: 1, _id: 0 })

// B5.10 Cuántos anuncios están VENDIDO
db.anuncios.countDocuments({ estado: "VENDIDO" })

// B5.11 Los 3 anuncios más vistos
db.anuncios.find({}, { titulo: 1, visitas: 1, _id: 0 }).sort({ visitas: -1 }).limit(3)


// Ejercicio B6 — Agregaciones
// B6.1 Número de anuncios por categoría, de más a menos
db.anuncios.aggregate([
  { $group: { _id: "$categoria", total: { $sum: 1 } } },
  { $sort: { total: -1 } }
])

// B6.2 Precio medio por categoría
db.anuncios.aggregate([
  { $group: { _id: "$categoria", precioMedio: { $avg: "$precio" } } },
  { $sort: { precioMedio: -1 } }
])

// B6.3 Número de anuncios por ciudad
db.anuncios.aggregate([
  { $group: { _id: "$ciudad", total: { $sum: 1 } } },
  { $sort: { total: -1 } }
])

// B6.4 Valor total en venta (solo DISPONIBLE) por vendedor  <-- hacer captura de este resultado
db.anuncios.aggregate([
  { $match: { estado: "DISPONIBLE" } },
  { $group: { _id: "$vendedor.nombre", valorEnVenta: { $sum: "$precio" } } },
  { $sort: { valorEnVenta: -1 } }
])

// B6.5 Reto: la categoría con más visitas en total
db.anuncios.aggregate([
  { $group: { _id: "$categoria", visitasTotales: { $sum: "$visitas" } } },
  { $sort: { visitasTotales: -1 } },
  { $limit: 1 }
])


// Ejercicio B7 — Modificar (antes de cada update, un find con el mismo filtro)
// B7.1 Cuarta foto del iPhone
db.anuncios.find({ _id: ObjectId("670000000000000000000003") }, { fotos: 1 })
db.anuncios.updateOne(
  { _id: ObjectId("670000000000000000000003") },
  { $push: { fotos: { url: "https://img.rastro.es/a3-4.jpg", orden: 4 } } }
)

// B7.2 +1 visita al Xiaomi
db.anuncios.find({ _id: ObjectId("670000000000000000000005") }, { visitas: 1 })
db.anuncios.updateOne({ _id: ObjectId("670000000000000000000005") }, { $inc: { visitas: 1 } })

// B7.3 Sara quita el iPhone y añade el Ford Focus (dos veces con $addToSet)
db.usuarios.find({ _id: ObjectId("660000000000000000000005") }, { favoritos: 1 })
db.usuarios.updateOne({ _id: ObjectId("660000000000000000000005") }, { $pull: { favoritos: ObjectId("670000000000000000000003") } })
db.usuarios.updateOne({ _id: ObjectId("660000000000000000000005") }, { $addToSet: { favoritos: ObjectId("670000000000000000000002") } })
db.usuarios.updateOne({ _id: ObjectId("660000000000000000000005") }, { $addToSet: { favoritos: ObjectId("670000000000000000000002") } })
db.usuarios.find({ _id: ObjectId("660000000000000000000005") }, { favoritos: 1 })

// B7.4 Luis acepta la oferta de Sara por el Seat (2 instrucciones)
db.ofertas.find({ _id: ObjectId("680000000000000000000003") })
db.ofertas.updateOne({ _id: ObjectId("680000000000000000000003") }, { $set: { estado: "ACEPTADA" } })
db.anuncios.updateOne({ _id: ObjectId("670000000000000000000001") }, { $set: { estado: "RESERVADO" } })

// B7.5 Rebajas: todos los coches -10 %
db.anuncios.find({ categoria: "Coches" }, { titulo: 1, precio: 1 })
db.anuncios.updateMany({ categoria: "Coches" }, { $mul: { precio: 0.9 } })
db.anuncios.find({ categoria: "Coches" }, { titulo: 1, precio: 1 })

// B7.6 Luis cambia su nombre: usuario + todas las copias del nombre
db.usuarios.updateOne({ _id: ObjectId("660000000000000000000002") }, { $set: { nombre: "Luis M. Martín" } })
db.anuncios.find({ "vendedor.id": ObjectId("660000000000000000000002") }, { titulo: 1, vendedor: 1 })   // sigue "Luis Martín"
// Copias en anuncios (como vendedor), ofertas (como comprador) y valoraciones (como autor)
db.anuncios.updateMany({ "vendedor.id": ObjectId("660000000000000000000002") }, { $set: { "vendedor.nombre": "Luis M. Martín" } })
db.ofertas.updateMany({ "comprador.id": ObjectId("660000000000000000000002") }, { $set: { "comprador.nombre": "Luis M. Martín" } })
db.valoraciones.updateMany({ "autor.id": ObjectId("660000000000000000000002") }, { $set: { "autor.nombre": "Luis M. Martín" } })
db.anuncios.find({ "vendedor.id": ObjectId("660000000000000000000002") }, { titulo: 1, vendedor: 1 })
db.ofertas.find({ "comprador.id": ObjectId("660000000000000000000002") }, { comprador: 1 })
