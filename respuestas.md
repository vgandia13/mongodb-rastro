# Rastro — Respuestas (entrega MongoDB)

## PARTE A

### A1 — ¿Por qué MongoDB aquí?

1. **Columnas de `anuncios` si cada atributo es una columna:**
   - Comunes (10): `id`, `titulo`, `descripcion`, `precio`, `categoria`, `estado`, `ciudad`, `fecha_publicacion`, `visitas`, `vendedor_id`.
   - Atributos (13): `marca`, `modelo`, `anio`, `km`, `combustible`, `almacenamiento_gb`, `bateria_pct`, `talla`, `genero`, `material`, `ancho`, `fondo`, `alto` (`marca` y `modelo` se comparten entre categorías).
   - **Total: 23 columnas.**
2. **Fila de la chaqueta:** rellena las 10 comunes + `talla = 'M'`, `marca = 'Levi''s'`, `genero = 'unisex'`. Quedan **10 columnas en `NULL`** (`modelo`, `anio`, `km`, `combustible`, `almacenamiento_gb`, `bateria_pct`, `material`, `ancho`, `fondo`, `alto`).
3. **Categoría Deporte:** hay que hacer un `ALTER TABLE anuncios ADD COLUMN tipo_bici …, ADD COLUMN pulgadas_rueda …` (la `talla` se reutiliza). Es un cambio de esquema, una migración, y todas las filas que no son de Deporte tendrán todavía más `NULL`.
4. **Una tabla por categoría:** para listar todos los anuncios de Valencia con sus datos hacen falta **4 `LEFT JOIN`** (coches, móviles, ropa, muebles), y uno más por cada categoría nueva.
5. **Documentos:**

```javascript
{ titulo: "iPhone 13 128 GB", categoria: "Móviles", precio: 380,
  atributos: { marca: "Apple", modelo: "iPhone 13", almacenamientoGB: 128, bateriaPct: 87 } }

{ titulo: "Mesa de comedor de roble", categoria: "Muebles", precio: 120,
  atributos: { material: "roble", ancho: 160, fondo: 90, alto: 75 } }
```

### A2 — Anuncio y vendedor

1. **No embebemos el usuario completo** porque (a) el usuario tiene vida propia: tiene varios anuncios, hace ofertas y escribe valoraciones, así que estaría repetido en muchos sitios; y (b) cualquier cambio (email, ciudad…) obligaría a actualizar todos sus anuncios. Además la ficha solo necesita su nombre.
2. **Copiamos solo el nombre** porque es lo único que pinta la ficha y casi nunca cambia. El email y la ciudad no se muestran ahí, y copiarlos solo añadiría datos que mantener sincronizados.
3. **Si Luis cambia su nombre:** su documento en `usuarios`, todos sus anuncios (`vendedor.nombre`) y, en el modelo completo, también sus ofertas (`comprador.nombre`) y sus valoraciones (`autor.nombre`).
4. **En el gimnasio** la clase guardaba `monitor_id` (clave ajena) y el nombre salía con un `JOIN clases ↔ monitores`. Aquí guardamos el id **y** una copia del nombre: la ficha se lee en una sola consulta sin `JOIN`, a cambio de mantener la copia actualizada.

### A3 — Ofertas

1. **Colección aparte `ofertas`.** Al leer el anuncio no necesito sus ofertas (solo las ve el vendedor). La oferta no pertenece solo al anuncio, también al comprador («mis ofertas»). Y un anuncio popular puede recibir muchísimas ofertas, así que el array no tendría límite.
2. **Documento:**

```javascript
{ importe: 340, estado: "PENDIENTE", fecha: new Date("2026-10-27"),
  anuncio:   { id: ObjectId("670000000000000000000003") },
  comprador: { id: ObjectId("660000000000000000000005"), nombre: "Sara López" } }
```

3. Copiaría dentro de `anuncio` el **`titulo`** y el **`precio`** que pedían: `anuncio: { id, titulo: "iPhone 13 128 GB", precio: 380 }`.
4. **No debe cambiar.** El precio de la oferta es una foto del momento en que Sara ofertó (igual que el precio de una línea de pedido en Furniro, que es el precio al que se compró y no el actual). Si se actualizara, se perdería el contexto de la oferta.

### A4 — Valoraciones

1. **Colección aparte `valoraciones`.** Un usuario con muchas ventas acumularía valoraciones sin límite (16 MB), y además la valoración se relaciona con tres cosas: autor, valorado y anuncio. En el usuario solo guardamos el resumen.
2. **Documento:**

```javascript
{ anuncioId: ObjectId("670000000000000000000004"),
  autor: { id: ObjectId("660000000000000000000004"), nombre: "Hugo Sanz" },
  valoradoId: ObjectId("660000000000000000000003"),
  estrellas: 5, comentario: "Todo perfecto", fecha: new Date() }
```

3. **Índice único sobre `autor.id` + `anuncioId`**: el mismo autor no puede valorar dos veces la misma compra.
4. En el usuario guardaría **`valoracionMedia`** y **`numValoraciones`**. Con los dos se recalcula la media al añadir una valoración sin recorrer todas: `nuevaMedia = (media * n + estrellas) / (n + 1)`.

### A5 — Favoritos (N:M)

1. Un usuario normal tendrá **pocos** favoritos (decenas, como mucho cientos). Un anuncio popular puede estar en los favoritos de **miles** de usuarios.
2. **Descarto la b) (array de usuarios en el anuncio)**: ese array puede crecer sin límite. Además el anuncio es el documento que más se lee, y arrastraría miles de ids que la ficha no necesita.
3. La **a) (array en el usuario)**: «Mis favoritos» es leer un solo documento, el del usuario, y luego buscar `anuncios` con `$in`.
4. Con un filtro sobre el array: `db.usuarios.countDocuments({ favoritos: ObjectId("…idAnuncio…") })`. Un filtro sobre un array encuentra los documentos que **contienen** ese valor.
5. **`$addToSet`**: solo añade el valor si no está ya en el array (en cambio `$push` lo duplicaría).

### A6 — ¿Dentro o aparte?

1. **Mensajes de chat:** referenciar, en una colección `mensajes` (con `anuncioId`, emisor y receptor). Crecen sin límite y no se leen con la ficha.
2. **Dirección de envío de una compra:** embebida en la compra. Es una foto del momento: si el usuario cambia luego su dirección, la de esa compra no debe cambiar.
3. **Etiquetas:** embebidas en el anuncio, como array de strings. Son pocas, pequeñas y se leen con él.
4. **Categorías con nombre, icono y atributos obligatorios:** referenciar, en una colección `categorias`. Las comparten muchos anuncios y cambian por su cuenta. En el anuncio basta con su nombre.
5. **Historial de precios:** embebido en el anuncio, como array `{ fecha, precio }`. Son pocos cambios y se muestran con el anuncio («ha bajado de precio»).
6. **Anuncios dentro del usuario:** referenciar (no embeber). Los anuncios tienen vida propia, se buscan solos y un vendedor puede tener muchos. Por eso cada anuncio guarda `vendedor.id`.
7. **Furniro, líneas de pedido:** embebidas en el pedido. Pertenecen solo a él, siempre se leen juntas y son pocas. Llevan una copia del precio de ese momento.
8. **Furniro, reseñas de un producto:** colección aparte. Pueden ser miles y tienen su propio autor. En el producto se guardaría solo el resumen (media y número).

### Apartado 9 — Diferencias con mi diseño

Mi diseño coincide con el modelo propuesto: 4 colecciones, fotos embebidas, vendedor referenciado con su nombre copiado, ofertas y valoraciones en colecciones propias con los datos imprescindibles copiados, el resumen de valoraciones en el usuario y favoritos como array de ids en el usuario. La única diferencia es que en A3.2 escribí primero la oferta solo con `anuncio.id`, y en A3.3 añadí el `titulo` y el `precio`, que es justo lo que hace el modelo.

---

## PARTE B

### B2.3 — Categoría «Deporte»

No he tenido que cambiar nada antes de insertar: el documento llegó con sus propios `atributos` (`talla`, `tipo`, `pulgadasRueda`) y MongoDB lo guardó sin más. En PostgreSQL habría tenido que hacer antes un `ALTER TABLE` para añadir las columnas nuevas (o crear una tabla `deporte`). Si no, el `INSERT` habría fallado con un error de «la columna no existe».

### B4 — Romper la base de datos

| | Predicción | Resultado real | Explicación |
|---|---|---|---|
| **B4.1** email repetido | Falla, porque hay un índice único en `email`. | ❌ `MongoServerError: E11000 duplicate key error collection: rastro.usuarios index: email_1 dup key: { email: "ana@rastro.es" }` | Lo ha impedido el **índice único `email_1`** creado en B3.1. |
| **B4.2** Hugo valora dos veces | Falla, por el índice único `autor.id + anuncioId`. | ❌ `E11000 duplicate key error collection: rastro.valoraciones index: autor.id_1_anuncioId_1 dup key: {...}` | Lo ha impedido el **índice único compuesto** de B3.2. |
| **B4.3** vendedor inexistente | Se guarda: MongoDB no comprueba referencias. | ✅ `acknowledged: true` | **Es un problema:** hay un anuncio cuyo vendedor no existe (dato huérfano). MongoDB no tiene claves ajenas. |
| **B4.4** precio `"75"` (texto) | Se guarda, pero no saldrá en la búsqueda por precio. | ✅ Se inserta. El `find({ precio: { $lt: 100 } })` devuelve Xiaomi (90), Chaqueta (25), Zapatillas (40) y «Prueba fantasma» (10), **pero no la lámpara**. | **Es un problema:** el dato es incoherente y desaparece de los filtros numéricos sin dar ningún error. |
| **B4.5** update sin operador | Falla, o reemplaza el documento entero. | ❌ `MongoInvalidArgumentError: Update document requires atomic operators` | Lo impide **mongosh / el driver**: `updateOne` exige `$set`, `$inc`… Para sustituir el documento entero existe `replaceOne`. El Xiaomi sigue a 90 €. |
| **B4.6** id como texto | Devuelve `null`. | `null` | No es un error, pero no encuentra nada: el `_id` es de tipo `ObjectId`, y el string `"6700…03"` es otro tipo. Hay que escribir `ObjectId("…")`. |

- **B4.7:** en el gimnasio, PostgreSQL habría rechazado el `INSERT` con un error de violación de la clave ajena (`violates foreign key constraint`). En Rastro tiene que comprobarlo **la aplicación** (el backend): antes de insertar el anuncio, verificar que el vendedor existe (normalmente es el usuario con la sesión iniciada).
- **B4.8:** porque `precio` es un **string** (`"75"`) y `$lt: 100` compara con un **número**. MongoDB solo compara valores del mismo tipo, así que un string nunca cumple un filtro numérico.
- **B4.9:** en los dos casos MongoDB guarda datos incorrectos **sin quejarse**. No valida las referencias (no hay claves ajenas) ni el tipo de los campos (no hay esquema fijo). Solo protege lo que le pedimos explícitamente, como los índices únicos. El resto lo tiene que validar la aplicación (o un validador `$jsonSchema`).

### B5.12 — Anuncios sin `atributos.km`

No dan error: simplemente **no salen**. Un documento sin el campo `atributos.km` no cumple `{ $lt: 100000 }`, así que el filtro lo ignora. Es la ventaja (y el riesgo) de no tener esquema: los campos que faltan no rompen la consulta.

### B6.4 — Captura

Resultado obtenido (ver la captura `captura_b6_4.png`):

```
[
  { _id: 'Luis Martín', valorEnVenta: 6590 },
  { _id: 'Hugo Sanz',   valorEnVenta: 4620 },
  { _id: 'Ana García',  valorEnVenta: 380 },
  { _id: 'Sara López',  valorEnVenta: 260 },
  { _id: 'Marta Ruiz',  valorEnVenta: 25 }
]
```

### B7 — Notas

- **B7.3:** el segundo `$addToSet` devuelve `matchedCount: 1, modifiedCount: 0`. **No se ha duplicado** el Ford Focus.
- **B7.4:** han hecho falta **2 instrucciones** (una en `ofertas` y otra en `anuncios`). Si se cortara la luz entre las dos, la oferta quedaría `ACEPTADA` y el Seat seguiría `DISPONIBLE`: un estado incoherente en el que otro comprador podría seguir ofertando. Para evitarlo habría que usar una **transacción** (`session.startTransaction()`) o un proceso que lo revise y lo repare.
- **B7.6:** después de cambiar el usuario, sus anuncios seguían mostrando «Luis Martín», porque es una copia. He tenido que actualizar `anuncios.vendedor.nombre` (2 anuncios), `ofertas.comprador.nombre` (1 oferta) y `valoraciones.autor.nombre` (0, porque Luis aún no ha valorado a nadie).

### B8 — Explícalo con tus palabras

1. **Dos razones:** los anuncios tienen atributos distintos según la categoría y salen categorías nuevas sin cambiar el esquema; y la ficha (lo más consultado) se lee de una sola vez, en un documento, sin `JOIN`.
2. **En SQL** guardaría los pagos, facturas y saldos: tienen una estructura fija, están muy relacionados y necesitan que la base de datos garantice la coherencia (claves ajenas, transacciones, restricciones).
3. **Fotos embebidas** porque siempre se leen con el anuncio, solo pertenecen a él y son como máximo 10. **Ofertas aparte** porque pueden ser muchas, las consultan comprador y vendedor por separado y no hacen falta para pintar la ficha.
4. Porque es el precio **en el momento de la oferta**. Si el vendedor cambia luego el precio, la oferta tiene que seguir mostrando lo que se pedía cuando se ofertó (y además así no hay que leer el anuncio para enseñarlo).
5. **Desnormalizar** es copiar datos de un documento a otro. **Ventaja:** la ficha muestra el nombre del vendedor sin una segunda consulta. **Inconveniente:** cuando Luis cambió su nombre tuve que actualizarlo a mano en tres colecciones. Si se me olvida alguna, quedan datos desactualizados.
6. **La aplicación** (el backend): MongoDB no comprueba que un `vendedor.id` exista. Lo vimos en B4.3, donde el anuncio de un vendedor inexistente se guardó sin error.
