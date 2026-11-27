## Primer acercamiento a los datos

Primero que nada creé un objeto en un array para empezar a trabajar con los datos. Este objeto tiene las propiedades de venta, productos, etc.
Luego de manera exploratoria para entender la estructura de los datos utilicé el método console.log() para mostrar los datos en la consola. Utilizando .length para saber la cantidad total de ventas en el archivo.

console.log("Primero:", ventas[0]) --> Lo usé para imprimir en consola el primer objeto de las ventas.
console.log("Ultimo:", ventas[ventas.length - 1]); --> Lo usé para imprimir en consola el último objeto de las ventas.
console.log("Producto en la posición 4:", ventas[4].producto); --> Lo usé para imprimir en consola el producto en la posición 4.
console.table(ventas) --> Me sirvió para ver los datos de una manera tabular y entender mejor la estructura de los datos.

## Diccionario de datos

| Propiedad | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `number` | Identificador numérico único de cada venta. |
| `fecha` | `string` | Fecha de la venta en formato `AAAA-MM-DD`. |
| `cliente` | `string` | Código identificador del cliente que realizó la compra. |
| `producto` | `string` | Nombre del producto vendido (café o accesorio). |
| `ciudad` | `string` | Ciudad donde se registró la venta. |
| `cantidad` | `number` | Número de unidades vendidas en el registro. |
| `precio` | `number` | Precio unitario del producto en pesos colombianos (COP). |

## Casos borde detectados

* **Venta 8 con `cantidad: 0`:** No se debe contar como venta válida al calcular el ticket promedio para evitar distorsionar el resultado hacia abajo. Decisión: filtrar únicamente registros con `cantidad > 0` al promediar (en las sumas de unidades y dinero aporta `0` naturalmente).
* **Ciudades con mayúsculas/minúsculas o espacios extra (`"medellín "` y `"Bogotá "`):** Si se comparan o agrupan tal cual vienen, generan grupos duplicados o quedan por fuera de los filtros. Decisión: normalizar los textos limpiando espacios laterales con `.trim()` y estandarizando mayúsculas/minúsculas antes de comparar (`normalizar`) o agrupar (`nombreCiudad`).
* **Clientes repetidos (`C01`, `C02`, `C03`):** Es un comportamiento válido del negocio porque un mismo cliente puede realizar múltiples compras en distintos días o productos. Decisión: conservar todos los registros independientes sin eliminarlos como duplicados.

## MiniReto 2: Métricas con ciclos (`for...of`)

### Plan en pseudocódigo de cada indicador

1. **`valorVenta(venta)`**
   - Entrada: un objeto `venta`.
   - Retornar `venta.cantidad * venta.precio`.

2. **`totalVendido(listaVentas)`**
   - Iniciar acumulador `total` en `0`.
   - Recorrer cada `venta` de `listaVentas`:
     - Condición: ninguna (todas las ventas suman su subtotal; si `cantidad` es `0`, suma `0`).
     - Acumular `total = total + valorVenta(venta)`.
   - Retornar `total`.

3. **`unidadesVendidas(listaVentas)`**
   - Iniciar acumulador `unidades` en `0`.
   - Recorrer cada `venta` de `listaVentas`:
     - Condición: ninguna.
     - Acumular `unidades = unidades + venta.cantidad`.
   - Retornar `unidades`.

4. **`ventaMayor(listaVentas)`**
   - Si `listaVentas` está vacía (`length === 0`), retornar `null`.
   - Iniciar `mayor` con el primer elemento `listaVentas[0]`.
   - Recorrer cada `venta` de `listaVentas`:
     - Condición: si `valorVenta(venta) > valorVenta(mayor)`.
     - Actualizar `mayor = venta` (guardando el registro completo).
   - Retornar `mayor`.

5. **`ticketPromedio(listaVentas)`**
   - Iniciar acumulador `sumaValidas` en `0` y contador `conteoValidas` en `0`.
   - Recorrer cada `venta` de `listaVentas`:
     - Condición: si `venta.cantidad > 0`.
     - Acumular `sumaValidas = sumaValidas + valorVenta(venta)` e incrementar `conteoValidas` en `1`.
   - Si `conteoValidas === 0`, retornar `0` (evita división por cero).
   - Retornar `sumaValidas / conteoValidas`.

6. **`ventasPorCiudad(listaVentas, ciudadBuscada)`**
   - Guardar `objetivo = normalizar(ciudadBuscada)` e iniciar acumulador `totalCiudad` en `0`.
   - Recorrer cada `venta` de `listaVentas`:
     - Condición: si `normalizar(venta.ciudad) === objetivo`.
     - Acumular `totalCiudad = totalCiudad + valorVenta(venta)`.
   - Retornar `totalCiudad`.

### Funciones implementadas en `src/analitica.js`
* **`valorVenta(venta)`**: Calcula el valor total de un registro multiplicando `venta.cantidad * venta.precio`.
* **`normalizar(texto)`**: Convierte el texto a cadena, elimina espacios en blanco a los lados con `.trim()` y pasa a minúsculas con `.toLowerCase()`.
* **`totalVendido(listaVentas)`**: Recorre las ventas con `for...of` y acumula `valorVenta(venta)` (con los datos iniciales da `$985.000`).
* **`unidadesVendidas(listaVentas)`** (y alias `totalUnidades`): Recorre las ventas con `for...of` y suma `venta.cantidad` (con los datos iniciales da `21` unidades).
* **`ventaMayor(listaVentas)`**: Compara el valor de cada venta con `for...of` y retorna el objeto completo con mayor subtotal (`id: 10`, cliente `C07`, por `$168.000` en los datos iniciales).
* **`ticketPromedio(listaVentas)`**: Acumula el valor y la cantidad de registros únicamente donde `venta.cantidad > 0`, dividiendo al final entre el número de ventas válidas (`985000 / 11 = 89545.45...` en los datos iniciales).
* **`ventasPorCiudad(listaVentas, ciudadBuscada)`**: Filtra y acumula usando `normalizar()` tanto en la ciudad del registro como en la ciudad buscada (`$356.000` para `"Medellín"`).
* **`ventasDelDia(listaVentas, fechaBuscada)`**: Recorre las ventas con `for...of` y devuelve las que coinciden exactamente con la fecha solicitada.

### Casos borde y decisiones con entradas de prueba
* **Arreglo vacío (`[]`):** `totalVendido([])`, `unidadesVendidas([])` y `ventasPorCiudad([], "Medellín")` retornan `0`; `ventaMayor([])` retorna `null` porque no existe ningún registro que devolver; `ticketPromedio([])` retorna `0` para evitar `0 / 0` (`NaN`).
* **Arreglo de un solo elemento (`[ventas[0]]`):** Funciona directamente sin errores de índice (`totalVendido` y `ticketPromedio` dan `84000`, `unidadesVendidas` da `2` y `ventaMayor` devuelve el registro `id: 1`).
* **Venta con `cantidad: 0` (`id: 8`):** Se excluye del conteo de ventas válidas en `ticketPromedio` para no bajar artificialmente el promedio.

### Trazas manuales de verificación

#### Traza 1: `ventasPorCiudad(ventas, "Medellín")` sobre las 12 ventas (`objetivo = "medellín"`)
| Paso (`id`) | `venta.ciudad` | `normalizar(venta.ciudad)` | ¿Coincide? | Subtotal (`cantidad * precio`) | `totalCiudad` acumulado |
| :---: | :--- | :--- | :---: | :---: | :---: |
| Inicio | — | — | — | — | `0` |
| 1 | `"Medellín"` | `"medellín"` | Sí | `2 * 42000 = 84000` | `84000` |
| 2 | `"Bogotá"` | `"bogotá"` | No | — | `84000` |
| 3 | `"Cali"` | `"cali"` | No | — | `84000` |
| 4 | `"Medellín"` | `"medellín"` | Sí | `1 * 42000 = 42000` | `126000` |
| 5 | `"medellín "` | `"medellín"` | Sí | `3 * 45000 = 135000` | `261000` |
| 6 a 10 | Bogotá / Cali / Pereira | distinto | No | — | `261000` |
| 11 | `"Medellín"` | `"medellín"` | Sí | `1 * 95000 = 95000` | `356000` |
| 12 | `"Bogotá "` | `"bogotá"` | No | — | **`356000`** |

*Resultado manual:* `356000` — coincide exactamente con `ventasPorCiudad(ventas, "Medellín")` en el programa.

#### Traza 2: `ventaMayor(ventas)` sobre las 12 ventas
| Paso (`id`) | Producto | Subtotal (`valorVenta`) | `mayor` actual (`id` y valor) | ¿`subtotal > mayor`? | Nuevo `mayor` |
| :---: | :--- | :---: | :--- | :---: | :--- |
| Inicio | — | — | `id: 1` (`84000`) | — | `id: 1` (`84000`) |
| 1 | Origen Huila 500 g | `84000` | `id: 1` (`84000`) | No (`84000 > 84000` falso) | `id: 1` (`84000`) |
| 2 | Origen Nariño 250 g | `26000` | `id: 1` (`84000`) | No | `id: 1` (`84000`) |
| 3 | Prensa francesa | `95000` | `id: 1` (`84000`) | Sí | `id: 3` (`95000`) |
| 4 | Origen Huila 500 g | `42000` | `id: 3` (`95000`) | No | `id: 3` (`95000`) |
| 5 | Origen Sierra 500 g | `135000` | `id: 3` (`95000`) | Sí | `id: 5` (`135000`) |
| 6 | Origen Nariño 250 g | `52000` | `id: 5` (`135000`) | No | `id: 5` (`135000`) |
| 7 | Molino manual | `120000` | `id: 5` (`135000`) | No | `id: 5` (`135000`) |
| 8 | Origen Huila 500 g | `0` | `id: 5` (`135000`) | No | `id: 5` (`135000`) |
| 9 | Origen Sierra 500 g | `90000` | `id: 5` (`135000`) | No | `id: 5` (`135000`) |
| 10 | Origen Huila 500 g | `168000` | `id: 5` (`135000`) | Sí | `id: 10` (`168000`) |
| 11 | Prensa francesa | `95000` | `id: 10` (`168000`) | No | `id: 10` (`168000`) |
| 12 | Origen Nariño 250 g | `78000` | `id: 10` (`168000`) | No | **`id: 10` (`168000`)** |

*Resultado manual:* registro completo con `id: 10` (`cliente: "C07"`, `$168.000`), y la suma de los 12 subtotales (`84000 + 26000 + 95000 + 42000 + 135000 + 52000 + 120000 + 0 + 90000 + 168000 + 95000 + 78000`) da **`985000`** — ambos coinciden con el programa.

## MiniReto 3: Métodos de arreglos, agrupaciones y verificación

- **Migración a métodos declarativos:** Se implementaron `totalVendidoM`, `unidadesVendidasM` (y alias `totalUnidadesM`), `ventaMayorM`, `ticketPromedioM`, `ventasPorCiudadM` y `ventasDelDiaM` usando `.map()`, `.filter()` y `.reduce()`.
- **Agrupaciones y ranking:** Se añadieron `totalPorCiudad` (con `nombreCiudad` para unificar ciudades sin duplicados), `unidadesPorProducto` y `topProductosPorValor(listaVentas, k = 3)` copiando el arreglo de pares con `[...pares]` antes de `.sort()` para garantizar que el arreglo original `ventas` nunca se modifique.
- **Verificación (`src/verificar.js`):** Se contrastaron los resultados de las funciones con `for...of` frente a las de métodos de arreglos mostrando `[OK]` o `[DIFERENTE]`, además de probar arreglos vacíos, arreglos de un solo elemento y que `ventas` conserve su orden original. Posteriormente se refactorizó `verificarIgualdad` (*prompt: "Puedes simplificar la función? o bueno hacerla como si fuera alguien que a penas aprende javascript"*) reemplazando el operador ternario y la negación por una estructura `if / else` explícita y variables intermedias con `JSON.stringify` mucho más clara de leer.

### Las 5 preguntas sobre colecciones en cada función

| Función | ¿Qué recorro? | ¿Qué filtro? | ¿Qué transformo? | ¿Qué acumulo? | ¿Cómo agrupo? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `totalVendidoM` | El arreglo `listaVentas` | Nada (entran todas) | Cada `venta` en su subtotal con `.map(valorVenta)` | La suma de los subtotales desde `0` con `.reduce()` | Sin agrupación (un solo total numérico) |
| `unidadesVendidasM` | El arreglo `listaVentas` | Nada | Leo `venta.cantidad` de cada registro | La suma total de unidades desde `0` con `.reduce()` | Sin agrupación (un solo número) |
| `ventasPorCiudadM` | El arreglo `listaVentas` | Solo ventas donde `normalizar(venta.ciudad) === objetivo` | Cada venta filtrada en su subtotal con `.map(valorVenta)` | La suma de subtotales de esa ciudad desde `0` | Sin diccionario (acumula para una ciudad dada) |
| `totalPorCiudad` | El arreglo `listaVentas` | Nada | `venta.ciudad` limpia con `nombreCiudad()` y el subtotal con `valorVenta()` | El monto vendido dentro de la clave de cada ciudad | En un objeto diccionario `{ Ciudad: montoTotal }` |
| `unidadesPorProducto` | El arreglo `listaVentas` | Nada | Se extrae `venta.producto` y `venta.cantidad` | Las unidades sumadas en la clave de cada producto | En un objeto diccionario `{ Producto: unidades }` |
| `topProductosPorValor` | Primero `listaVentas`, luego los pares `[producto, monto]` | Al final `.slice(0, k)` deja solo los primeros `k` | El diccionario en arreglo de pares con `Object.entries()`, copiado con `[...]` y ordenado de mayor a menor | Primero el valor total por producto en un diccionario | Por `venta.producto` antes de ordenar el ranking |

## MiniReto 4: Reporte final v0.1 y depuración (`src/reporte.js`)

- **Formato local y 4 secciones:** Se implementó el reporte formateado con `.toLocaleString("es-CO")` mostrando resumen general (`$985.000`, `21` unidades, ticket promedio `$89.545`, venta mayor `#10` por `$168.000`), ventas por ciudad, unidades por producto y top 3 productos por valor.
- **Día con ventas y día sin ventas:** Se incluyó en `src/reporte.js` el reporte filtrado de un día con ventas (`2026-09-01`: `2` ventas, total `$110.000`, ticket `$55.000`) y la simulación de un día sin ventas (`2026-09-10`: `0 ventas · total $0 · ticket $0` sin `NaN` ni errores).

### Errores depurados (formato completo)

#### 1. Duplicación de ciudades por espacios/mayúsculas (y error tipográfico en `nombreCiudad`)
* **Síntoma:** Al agrupar ventas por ciudad, `"Bogotá"` y `"Bogotá "` (y `"Medellín"` con `"medellín "`) aparecían como dos ciudades separadas en el reporte; además, en un primer intento apareció `TypeError: ...toLowerCases is not a function`.
* **Entrada que lo produce:** El arreglo `ventas` de `src/datos.js`, específicamente los registros `id: 5` (`ciudad: "medellín "`) e `id: 12` (`ciudad: "Bogotá "`).
* **Hipótesis:** Las llaves de un objeto en JavaScript distinguen mayúsculas y espacios finales (`"Bogotá" !== "Bogotá "`), y el método de cadena tenía una `"s"` de más al final.
* **Prueba realizada:** Se imprimieron en consola las ciudades rodeadas de corchetes (`ventas.map(v => "[" + v.ciudad + "]")`) en `src/explorar.js`, confirmando visualmente `[medellín ]` y `[Bogotá ]`, y se probó `nombreCiudad("  bogotá ")` verificando que devuelva `"Bogotá"`.
* **Causa:** Usar directamente `venta.ciudad` sin limpiar espacios con `.trim()` ni unificar mayúsculas/minúsculas antes de usarla como llave del objeto acumulador (más el typo `toLowerCases`).
* **Corrección:** Se implementó `nombreCiudad(texto)` aplicando `String(texto).trim().toLowerCase()`, validando cadena vacía y capitalizando la primera letra (`limpio.charAt(0).toUpperCase() + limpio.slice(1)`), consolidando exactamente las 4 ciudades en `totalPorCiudad`.

#### 2. `NaN` en el ticket promedio al evaluar un día sin ventas
* **Síntoma:** Al calcular el ticket promedio filtrando una fecha en la que no hubo transacciones, el resultado mostraba `$NaN` en consola.
* **Entrada que lo produce:** `ventasDelDia(ventas, "2026-09-10")` (que devuelve un arreglo vacío `[]`) o un arreglo donde todas las ventas tengan `cantidad: 0` (por ejemplo `[ventas[7]]`).
* **Hipótesis:** Cuando no hay ventas válidas, tanto la suma de dinero como el conteo de ventas válidas valen `0`, y en JavaScript dividir `0 / 0` produce `NaN`.
* **Prueba realizada:** Se ejecutó en consola `ticketPromedio([])` y `imprimirReporte` con `ventasDelDia(ventas, "2026-09-10")`, comprobando qué valor tomaba `conteoValidas` / `validas.length` antes de la división.
* **Causa:** Ejecutar la división `sumaValidas / conteoValidas` sin validar primero si el denominador era `0`.
* **Corrección:** Se añadió una validación temprana (`if (conteoValidas === 0) return 0;` en `ticketPromedio` e `if (validas.length === 0) return 0;` en `ticketPromedioM`), logrando que un día sin ventas imprima limpiamente `0 ventas · total $0 · ticket $0`.

## MiniReto 5: Generador de datos, contador de operaciones y Big O

### Metodología de trabajo asistido (sin entrega de código)
- **Prompts de aprendizaje:**
  - *"Tengo el siguiente trabajo por hacer, ahora quiero que me guíes paso por paso como hacer cada cosa que me piden, te iré haciendo preguntas al respecto. Ahora dime, por donde empiezo, sin pasarme ninguna linea de código, quiero aprender"*.
  - *"Quiero que me ayudes a aprender, no me pases ninguna linea de código pero si quisiera que me guíes paso por paso. Según mi codigo, en que voy?"*.
- **Enfoque:** A partir de este reto se trabajó de manera guiada paso a paso, escribiendo cada línea manualmente y resolviendo dudas conceptuales sobre arreglos, índices, objetos, condicionales, funciones, parámetros y ciclos, sin recibir código generado.

### Avances completados en `src/generador.js`

#### 1. Catálogos fijos (`productos` y `ciudades`)
- **Prompts utilizados:** *"Bueno, empecemos por el primer bloque de src/generador.js. Que tipo de lista debo crear? y con que objetos?"* y *"Para este generador no puedo simplemente importar src/datos.js?"*.
- **Cómo se construyó y qué se aprendió:**
  - Se creó `productos` como un arreglo de objetos con propiedades en minúscula (`nombre` y `precio`), manteniendo cada artículo unido a su precio unitario real. Se dejó el peso integrado en el nombre (como en el Día 1) porque accesorios como *Prensa francesa* o *Molino manual* no llevan peso.
  - Se creó `ciudades` como un arreglo simple de cadenas de texto limpias (`Medellín`, `Bogotá`, `Cali`, `Pereira`).
  - **Decisión de diseño:** No se importó `src/datos.js` porque contiene un historial de muestra con datos sucios intencionales (espacios extra, minúsculas, una venta con cantidad `0` y productos repetidos que sesgarían el muestreo), mientras que el generador necesita catálogos limpios e independientes.

#### 2. Función auxiliar `azar(min, max)`
- **Prompts utilizados:** *"Ayudame a crear esta función paso por paso, no se bien como estructurarla. Soy muy begginer de javascript, necesito que me lleves de la mano..."* y *"o sea que la constante cantidadOpciones sería un (if(min === 1 && max === 5))?"*.
- **Cómo se construyó y qué se aprendió:**
  - Se comprendió la estructura básica de una función (`function`, nombre, parámetros, llaves y `return`) y por qué los parámetros permiten resolver cualquier rango con una operación directa sin depender de condicionales `if` fijos.
  - Se implementó `azar(min, max)` en tres pasos intermedios claros: calcular el total de opciones inclusivas, multiplicar por `Math.random()` aplicando `Math.floor()` para obtener un entero desde `0`, y sumarle `min` en el `return` para cubrir exactamente el rango completo.

#### 3. Construcción del ciclo en `generarVentas(n)`
- **Prompts utilizados durante la construcción paso a paso:**
  - *"vamos con el ciclo, que debo hacer, explicame como funcionará"*
  - *"const indiceProductos = productos.length; así entonces sería mi primer constante?"* → *"const indiceProductos = azar(0, length) - 1?"* → *"entonces sería azar(0, productos.length - 1)?"*
  - *"algo así? const productoElegido = productos[0]"*
  - *"const cantidad = azar(1, 5)?"*
  - *"if (dia < 10) { fecha = (\"2026-09-0\" + dia); } else { fecha = (\"2026-09-\" + dia); }?"*
  - *"A que te refieres con eso? Si ya tengo mi constante de productos no es suficiente?"*
- **Cómo se construyó y qué se aprendió:**
  - **Cálculo de clientes distintos (`totalClientes`):** Se usó `Math.max(1, Math.floor(n / 3))` antes del ciclo para garantizar al menos `1` cliente cuando `n < 3` y generar clientes recurrentes realistas entre `1` y `n / 3`.
  - **Índices aleatorios dinámicos:** Se aprendió por qué `productos.length` por sí solo entrega un número fijo (`5`, fuera de rango) y por qué restar `- 1` afuera de `azar(...)` podría producir `-1` cuando sale `0`. La solución correcta fue pasar `productos.length - 1` como tope máximo dentro de `azar(0, productos.length - 1)` y usar esa constante como índice dinámico `productos[indiceProductos]` (y de igual forma para `ciudades`).
  - **Valores aleatorios y formato de fecha (`AAAA-MM-DD`):** Se sorteó `cantidad` con `azar(1, 5)` y `cliente` uniendo `"C"` con `azar(1, totalClientes)`. Al construir `fecha`, se corrigieron dos errores conceptuales clave: en JavaScript no se puede asignar un `if` directamente a una variable (`let fecha = if ...`), y usar `return` dentro del ciclo `for` detendría toda la función en la primera venta. Por eso se declaró `let fecha = ""` antes del condicional y dentro del `if / else` se asignó el cero inicial cuando `dia < 10`.
  - **Armado del objeto `venta` e inserción en el arreglo:** Se comprendió la diferencia entre el catálogo `productos` (el menú) y cada objeto `venta` (el recibo con las 7 propiedades exactas de `datos.js` que esperan las funciones de `analitica.js`). Se corrigió el orden de acceso a propiedades (`productoElegido.precio` en vez de `precio.productoElegido`) y el uso de `ventas.push(venta)` en lugar de `venta()` (ya que `venta` es un objeto y no una función), retornando finalmente `ventas` fuera del ciclo y exportando con `module.exports = generarVentas`.

#### 4. Prueba y verificación en consola
- **Prompts utilizados:** *"pero antes de eso, quiero ver en consola como quedó funcionando. Que linea de código uso? un console.log?"*, *"console.table(generarVentas[0])?"* y *"Quedó así, según los minretos así debe quedar el generador?"*.
- **Cómo se verificó y qué se aprendió:**
  - Se reforzó la diferencia entre corchetes `[]` (acceder a posiciones de un arreglo) y paréntesis `()` (ejecutar una función pasándole argumentos).
  - Al ejecutar `console.table(generarVentas(10))`, se comprobó en consola que el generador produce exactamente `10` registros válidos con `id` del `1` al `10`, fechas formateadas, clientes repetidos dentro del rango `C1`–`C3`, cantidades entre `1` y `5`, y precios consistentes con cada producto.

### Funciones instrumentadas con contador en `src/analitica.js`

#### 1. `totalVendidoOp(listaVentas, contador)`
  - **Prompts utilizados:**
    - *"const totalVendidoOp = { listaVentas, } Quedaría así?"*
    - *"Puedo crear otra variable llamada total dentro de estas llaves? Creería que debo poner un nombre distinto"*
    - *"total += totalVendidoOp(contador); Así?"* → *"Se que está mal pero que es lo que tengo que rectificar especificamente"* → *"Así?"*
    - *"1. total = valorVenta + venta?"*
  - **Cómo se va construyendo y qué se aprendió:**
    - **Encabezado de la función:** Se aclaró la diferencia entre declarar un objeto de datos (`const ... = { }`) y declarar una función (`function nombre(...) { }`). Se definió el encabezado `function totalVendidoOp(listaVentas, contador)` recibiendo tanto el arreglo de ventas como el objeto `contador` por referencia para registrar operaciones sin alterar la función original `totalVendido`.
    - **Alcance local (*scope*) y recorrido base:** Se comprendió que las variables declaradas dentro de una función (como `let total = 0`) viven únicamente dentro de sus llaves y no chocan con variables del mismo nombre en otras funciones. Con eso se estructuró el acumulador `total`, el ciclo `for...of` sobre `listaVentas` y el `return total`.
    - **Incremento del objeto contador (`contador.operaciones++`) y acumulación (`+=`):** Se identificó por qué no se debe mezclar el acumulador de dinero (`total`) con el conteo de pasos ni llamar recursivamente a `totalVendidoOp` dentro de sí misma. También se reforzó la diferencia entre reasignar (`=`) y acumular (`+=`), y entre sumar una referencia de función (`valorVenta + venta`) frente a invocarla (`valorVenta(venta)`), dejando las dos instrucciones separadas dentro del ciclo (`contador.operaciones++` y `total += valorVenta(venta)`).
    - **Cierre y exportación:** Se completó la función con `return total` fuera del ciclo y su exportación en `module.exports`, comprobando con las 12 ventas base que retorna `985000` y registra exactamente `12` operaciones.

#### 2. `ventaMayorOp(listaVentas, contador)`
- **Prompts utilizados:**
  - *"no quiero que me digas que mire las lineas... muestrame el código para no tener que scrollear a ver las funciones ya hechas"*
  - *"tengo esto, que me falta"*
  - *"if (valorVenta > valorVenta.mayor) ... Así?"* → *"Ok, entonces dices que deje los () del if vacios?"* → *"miralo ahora"*
- **Cómo se va construyendo y qué se aprendió:**
  - **Validación de arreglo vacío e inicialización del máximo:** Tomando como referencia visual `ventaMayor`, se estructuró el encabezado `function ventaMayorOp(listaVentas, contador)`, aclarando que en JavaScript ningún `if ()` puede quedar con paréntesis vacíos y por qué es importante validar `listaVentas.length === 0` antes de leer `listaVentas[0]` (para retornar `null` en lugar de `undefined`).
  - **Ubicación del contador e invocación de funciones al comparar:** Se ubicó `contador.operaciones++` dentro del `for...of` antes del condicional `if`, ya que la comparación se ejecuta en cada elemento recorrido aunque no supere al máximo actual. Además, se corrigió `valorVenta > valorVenta.mayor` invocando `valorVenta(venta) > valorVenta(mayor)`, exportando `ventaMayorOp` en `module.exports` y comprobando que retorna el registro `id: 10` con `12` operaciones sobre la muestra base.

#### 3. `totalPorCiudadOp(listaVentas, contador)`
- **Prompts utilizados:**
  - *"quiero que me expliques como si fuese la primera vez que hago este tipo de funciones"*
  - *"Explicame paso por paso que hacer"*
  - *"no entiendo lo de el if"* → *"Si, me quedó un poco mas claro, lo que pasa es que empezaste a hablar de alcancía y no entendí muy bien. Revisa mi condicional ahora."*
- **Cómo se va construyendo y qué se aprendió:**
  - **Estructura inicial y objeto diccionario (`totales`):** Se abordó el agrupamiento desde cero usando un objeto vacío (`const totales = {}`) y un ciclo `for...of`, corrigiendo el código que había quedado fuera de la función y dejando bien estructurado `function totalPorCiudadOp(listaVentas, contador)`.
  - **Conteo y normalización en cada vuelta:** Dentro del ciclo se añadió primero `contador.operaciones++` para registrar cada elemento visitado y luego `const ciudad = nombreCiudad(venta.ciudad)` para unificar nombres como `"medellín "` y `"Medellín"` bajo una misma propiedad limpia.
  - **Inicialización explícita de propiedades dinámicas (`=== undefined`):** Dejando de lado analogías confusas y explicándolo directamente desde el comportamiento de JavaScript, se comprendió que si una propiedad aún no existe en `totales`, su valor es `undefined` (y sumarle un número produciría `NaN`). Por eso se implementó `if (totales[ciudad] === undefined) { totales[ciudad] = 0; }` de forma explícita y legible en lugar del atajo con `!`.
  - **Acumulación, retorno y exportación:** Justo después del condicional se acumuló el subtotal con `totales[ciudad] += valorVenta(venta)`, se retornó `totales` fuera del ciclo y se exportó `totalPorCiudadOp` en `module.exports`, comprobando que devuelve los montos exactos de las 4 ciudades con `12` operaciones.

#### 4. `primeraVentaOp(listaVentas, contador)`
- **Prompts utilizados:** *"Listo, que sigue"* → *"Algo así?"*.
- **Cómo se construyó y qué se aprendió:**
  - Se implementó una función sin ciclos que incrementa `contador.operaciones++` una única vez, valida arreglo vacío (`if (listaVentas.length === 0) return null`), retorna directamente `listaVentas[0]` y se exporta en `module.exports`, sirviendo como referencia de complejidad constante `O(1)` frente a las tres funciones con recorrido completo.

### Predicciones antes de medir (si `n` se multiplica por `10`)
- **Prompts utilizados:** *"No se, dame pistas para responder estas predicciones"*.
- **Razonamiento y predicción propia previa a ejecutar `src/medir.js`:**
  1. **`primeraVentaOp`:** Se mantendrá exactamente igual (`1` operación sin importar el tamaño de `n`), ya que no hay ningún ciclo que recorrer en la función: únicamente entra, le suma `1` al contador y lee la primera posición.
  2. **`totalVendidoOp`, `ventaMayorOp` y `totalPorCiudadOp`:** Sus operaciones también se multiplicarán por `10` (por ejemplo, de `100` pasarán a `1.000` operaciones), porque así como con `12` datos el ciclo recorre `12` veces, al incrementar las ventas el ciclo recorrerá el total de registros que entren (`1.000`, `30.000` o cualquier cantidad `n`).

### Construcción y ejecución de `src/medir.js`
- **Cómo se construyó y qué se aprendió:**
  - **Ajuste previo en `src/generador.js`:** Se comentó con `//` la línea de prueba `console.table(generarVentas(10))` para que, al importar el módulo con `require("./generador")`, Node.js no imprimiera esa tabla automáticamente. También se estandarizó el espacio antes de `"g"` en los nombres de los cafés (`"Origen Huila 500 g"`, `"Origen Nariño 250 g"`, `"Origen Sierra 500 g"`) para mantener exactamente los mismos nombres que en `src/datos.js`.
  - **Importaciones según el tipo de `module.exports`:** En `src/medir.js` se importó `generarVentas` directamente sin llaves (`const generarVentas = require("./generador")`) porque ese archivo exporta una única función, mientras que `{ primeraVentaOp, totalVendidoOp, ventaMayorOp, totalPorCiudadOp }` se importaron con desestructuración de objeto desde `"./analitica"`.
  - **Recorrido de tamaños y contadores independientes por referencia:** Se definió el arreglo `tamanos = [100, 1000, 10000, 100000]` y un arreglo vacío `resultados = []`. En cada vuelta del ciclo `for...of`, se generaron `n` ventas con `generarVentas(n)` y se crearon cuatro objetos independientes con `{ operaciones: 0 }`. Como en JavaScript los objetos se pasan por referencia, usar objetos separados evita que el conteo de una función se mezcle o acumule con el de otra.
  - **Tabla de resultados obtenida al ejecutar `node src/medir.js`:**

| `n` (ventas generadas) | `primeraVentaOp` | `totalVendidoOp` | `ventaMayorOp` | `totalPorCiudadOp` |
| ---: | ---: | ---: | ---: | ---: |
| `100` | `1` | `100` | `100` | `100` |
| `1000` | `1` | `1000` | `1000` | `1000` |
| `10000` | `1` | `10000` | `10000` | `10000` |
| `100000` | `1` | `100000` | `100000` | `100000` |

### Comparación de predicciones frente a resultados reales
1. **`primeraVentaOp` (predicción cumplida):** Se predijo que siempre haría `1` operación y en la tabla marcó exactamente `1` para `n = 100`, `1.000`, `10.000` y `100.000`. Multiplicar los datos por `1.000` (de `100` a `100.000`) multiplicó las operaciones por `1` (no creció nada).
2. **`totalVendidoOp`, `ventaMayorOp` y `totalPorCiudadOp` (predicción cumplida):** Se predijo que al multiplicar `n` por `10` sus operaciones también se multiplicarían por `10`, y los números lo confirman de forma exacta: de `100` pasaron a `1.000` (`×10`), luego a `10.000` (`×10`) y finalmente a `100.000` (`×10`).

### Clasificación Big O de las funciones medidas

| Función | Complejidad temporal | Justificación en el código | Justificación con los números |
| :--- | :---: | :--- | :--- |
| `primeraVentaOp` | `O(1)` (constante) | No tiene ningún ciclo `for`. Solo verifica `listaVentas.length === 0` y accede de forma directa por índice a `listaVentas[0]`. | Con `100`, `1.000`, `10.000` y `100.000` ventas realiza siempre `1` operación. |
| `totalVendidoOp` | `O(n)` (lineal) | Tiene un único ciclo `for...of` que recorre una vez cada elemento de `listaVentas` sumando `valorVenta(venta)` (trabajo constante por vuelta). | Hace `100` operaciones con `n = 100` y `100.000` con `n = 100.000` (relación exacta `1` a `1` con `n`). |
| `ventaMayorOp` | `O(n)` (lineal) | Tiene un único ciclo `for...of` que visita cada venta una sola vez y ejecuta una comparación directa `valorVenta(venta) > valorVenta(mayor)`. | Crece en proporción directa al tamaño de entrada: cuando `n` sube `10` veces, las operaciones suben `10` veces (`100` → `1.000` → `10.000` → `100.000`). |
| `totalPorCiudadOp` | `O(n)` (lineal) | Tiene un único ciclo `for...of`; en cada venta normaliza el texto y accede/actualiza una propiedad del objeto `totales[ciudad]` en tiempo constante `O(1)` sin ciclos internos. | Registra exactamente `n` pasos (`100`, `1.000`, `10.000`, `100.000`). Ninguna de estas cuatro funciones es `O(n²)` porque ninguna anida un ciclo dentro de otro sobre `listaVentas`. |

## MiniReto 6: El reporte que se volvió lento (`clientesRecurrentes`)

### 1. Integración y verificación con las 12 ventas del Día 1
- Se agregó y exportó en `src/analitica.js` la función `clientesRecurrentes(ventas)` con sus dos ciclos `for` anidados (`i` desde `0` y `j` desde `i + 1`).
- Al ejecutarla en `src/medir.js` con el arreglo base de `src/datos.js` (`12` registros), devolvió exactamente `['C01', 'C02', 'C03']`, confirmando que el resultado funcional es correcto (`C01` tiene 3 compras, `C02` tiene 2, `C03` tiene 2 y del `C04` al `C08` solo tienen 1).

### 2. Traza manual con 5 ventas y generalización para `n` ventas
Tomando las primeras `5` ventas de `src/datos.js`:
- Posición `0`: `C01` | Posición `1`: `C02` | Posición `2`: `C03` | Posición `3`: `C01` | Posición `4`: `C04`

| Vuelta externa (`i`) | Cliente en `i` | Vueltas internas (`j = i + 1 ... 4`) | Pares comparados `(i, j)` | Comparaciones en esta vuelta | `recurrentes` al terminar |
| :---: | :---: | :--- | :--- | :---: | :--- |
| `0` | `C01` | `j = 1, 2, 3, 4` | `(0,1)`, `(0,2)`, `(0,3)` *(coincide)*, `(0,4)` | `4` | `["C01"]` |
| `1` | `C02` | `j = 2, 3, 4` | `(1,2)`, `(1,3)`, `(1,4)` | `3` | `["C01"]` |
| `2` | `C03` | `j = 3, 4` | `(2,3)`, `(2,4)` | `2` | `["C01"]` |
| `3` | `C01` | `j = 4` | `(3,4)` | `1` | `["C01"]` |
| `4` | `C04` | No entra (`j = 5` no es `< 5`) | Ninguno | `0` | `["C01"]` |

- **Total con `5` ventas:** `4 + 3 + 2 + 1 + 0 = 10` comparaciones.
- **Generalización para `n` ventas:** La primera vuelta compara `n - 1` veces, la segunda `n - 2`, la tercera `n - 3`, hasta llegar a `1` y `0`. La suma de los enteros desde `1` hasta `n - 1` es:
  $$\frac{n \times (n - 1)}{2} = \frac{n^2 - n}{2}$$
  Al eliminar constantes (`1/2`) y el término menor (`-n`), el orden de crecimiento es cuadrático: **`O(n²)`**.

### 3. Medición de tiempos reales con `console.time` y `console.timeEnd`

| `n` (ventas) | Comparaciones `n × (n - 1) / 2` | Tiempo medido | Factor de crecimiento al duplicar `n` |
| ---: | ---: | ---: | :---: |
| `1.000` | `499.500` | `4,482 ms` | — |
| `2.000` | `1.999.000` | `11,817 ms` | `×2,64` *(ajuste inicial del motor de Node.js)* |
| `4.000` | `7.998.000` | `44,180 ms` | `×3,74` (`≈ ×4`) |
| `8.000` | `31.996.000` | `220,497 ms` | `×4,99` (`≈ ×4`–`×5`) |
| `16.000` | `127.992.000` | `864,605 ms` | `×3,92` (`≈ ×4`) |

### 4. Análisis: ¿qué pasa con el tiempo cuando `n` se duplica?
- Cuando `n` se multiplica por `2` (por ejemplo de `2.000` a `4.000` y de `8.000` a `16.000`), el tiempo de ejecución no se duplica, sino que **se multiplica aproximadamente por `4`**.
- **Relación con `O(n²)`:** Si el trabajo es proporcional a $n^2$, al reemplazar $n$ por $2n$ obtenemos $(2n)^2 = 4n^2$. Es decir, duplicar los datos cuadruplica la cantidad de pares a revisar.

### 5. Estimación para `100.000` y `1.000.000` de ventas (y prueba real con `100.000`)
Tomando como base la medición estable de `n = 16.000` (`864,605 ms ≈ 0,865 s`):
1. **Estimación para `n = 100.000`:**
   - El tamaño crece $\frac{100.000}{16.000} = 6,25$ veces.
   - En un algoritmo `O(n²)`, el tiempo crece $(6,25)^2 = 39,0625$ veces:
     $$0,8646\text{ s} \times 39,0625 \approx 33,77\text{ segundos}$$
   - **Verificación real (`< 2 minutos`):** Como la estimación (`33,77 s`) fue menor a `2 minutos` (`120 s`), se ejecutó la prueba real con `100.000` ventas generadas (`4.999.950.000` comparaciones de pares). Tardó **`43,566 segundos`** y encontró `26.732` clientes recurrentes; los ~`10 s` adicionales sobre el cálculo puro cuadrático se deben a las búsquedas repetidas de `.includes()` sobre el arreglo `recurrentes`.
2. **Estimación para `n = 1.000.000`:**
   - Pasar de `100.000` a `1.000.000` multiplica `n` por `10`, por lo que en `O(n²)` el tiempo se multiplica por $10^2 = 100$:
   - Con la base de `16.000`: $0,8646\text{ s} \times (62,5)^2 \approx 3.377\text{ s} \approx \mathbf{56,3\text{ minutos}}$.
   - Con la medición real de `100.000` (`43,566 s × 100`): tardaría aproximadamente **`4.357 segundos` (`≈ 72,6 minutos`, más de 1 hora y 12 minutos)** para entregar un solo reporte.

### 6. El costo oculto de `recurrentes.includes(...)` en el peor caso
- En la condición `ventas[i].cliente === ventas[j].cliente && !recurrentes.includes(ventas[i].cliente)`, el método `.includes()` **no es gratuito (`O(1)`)**: internamente ejecuta otro recorrido lineal desde la posición `0` hasta el final del arreglo `recurrentes` para comprobar si el cliente ya fue guardado.
- Si ya se han detectado `r` clientes recurrentes (donde en nuestros datos generados `r` crece en proporción a `n`, por ejemplo `26.732` clientes cuando `n = 100.000`), cada llamada a `.includes()` cuesta `O(r) = O(n)`.
- **Impacto en el peor caso:** Si existen muchos clientes repetidos a lo largo de todo el historial, la primera parte del `&&` da `true` muchísimas veces (en el peor caso, en una fracción cuadrática de los pares cuando ya hay `O(n)` clientes distintos en `recurrentes`), ejecutando un recorrido `O(n)` dentro de dos ciclos anidados `O(n²)`. Eso puede llevar el peor caso teórico hasta **`O(n³)`**.

### 7. Conclusión sin tecnicismos para la gerente de Café Origen
> *"El reporte actual de clientes recurrentes funciona bien con pocos pedidos porque revisa la primera venta y la compara una por una contra todas las demás de la lista; luego toma la segunda venta y vuelve a compararla contra todas las siguientes, y además cada vez que encuentra un cliente repetido vuelve a leer de principio a fin la lista de clientes frecuentes para no anotarlo dos veces. Con las 12 ventas de prueba eso apenas toma 66 revisiones y es instantáneo, pero cuando los datos crecen el esfuerzo se dispara: cada vez que se duplican las ventas del mes, el computador tarda cuatro veces más. Con 100.000 ventas ya se demora unos 44 segundos, y cuando abramos en grandes superficies y el marketplace y lleguemos a un millón de ventas anuales, este único reporte dejaría la pantalla congelada más de una hora haciendo quinientos mil millones de comparaciones repetidas. Antes de salir a producción debemos cambiar la forma en que recordamos qué clientes ya vimos para leer el historial una sola vez."*

## MiniReto 7: Tiempo, memoria y cadenas de métodos

### 1. Implementación y verificación con `10.000` ventas generadas
- Se agregaron en `src/analitica.js` dos implementaciones equivalentes:
  - **`totalCiudadCadena(ventas, ciudad)`:** Encadena `.map()` (crea objetos con `ciudadNormalizada`, `cantidad` y `precio`) → `.filter()` (deja solo los que coinciden con `objetivo`) → `.map()` (calcula `valorVenta`) → `.reduce()` (suma desde `0`).
  - **`totalCiudadUnaPasada(ventas, ciudad)`:** Recorre `ventas` una sola vez con `for...of`, compara `normalizar(venta.ciudad) === objetivo` y acumula en una variable numérica `let total = 0`.
- **Verificación en `src/medir.js` con `n = 10.000` ventas:** Ambas funciones devolvieron exactamente el mismo monto (`503345000`, confirmado con `[OK]`), con `1,781 ms` en `totalCiudadCadena` frente a `0,675 ms` en `totalCiudadUnaPasada`.

### 2. Conteo de recorridos, arreglos nuevos y Big O (tiempo y espacio)

| Versión | Recorridos sobre datos | Arreglos nuevos creados | Complejidad temporal | Complejidad espacial (memoria adicional) |
| :--- | :---: | :---: | :---: | :---: |
| `totalCiudadCadena` | **`4` recorridos** (`map` sobre `n`, `filter` sobre `n`, `map` sobre los `m` filtrados y `reduce` sobre los `m` subtotales; hasta `4n` en el peor caso) | **`3` arreglos nuevos** (`1` arreglo de `n` objetos en el primer `map`, `1` arreglo en `filter` y `1` arreglo numérico en el segundo `map`; `reduce` no crea arreglo) | `O(n)` *(proviene de `O(4n)`)* | `O(n)` *(hasta `3n` posiciones + `n` objetos)* |
| `totalCiudadUnaPasada` | **`1` único recorrido** (`for...of` sobre los `n` registros) | **`0` arreglos nuevos** (solo usa las variables simples `objetivo` y `total`) | `O(n)` *(proviene de `O(1n)`)* | `O(1)` *(memoria fija constante)* |

### 3. ¿Por qué `O(4n)` y `O(1n)` se simplifican ambas a `O(n)`?
- La notación Big O describe la **tasa de crecimiento** del algoritmo cuando `n` tiende a valores muy grandes, ignorando factores constantes fijos que no dependen de `n`.
- Según la regla de eliminación de constantes multiplicativas, en `O(4n)` el número `4` es fijo (no cambia aunque `n` pase de `1.000` a `1.000.000`). Si `n` se multiplica por `10`, tanto `1n` como `4n` multiplican su trabajo exactamente por `10` (crecimiento lineal `O(n)`).
- Aun así, tener la misma clase `O(n)` en tiempo **no significa que gasten los mismos recursos reales**: la constante `4` más la creación en memoria de `3` arreglos intermedios explica por qué `totalCiudadCadena` tardó más del doble (`1,781 ms` vs `0,675 ms`) y pasa de `O(1)` a `O(n)` en memoria.

### 4. Clasificación de complejidad espacial de todas las funciones del motor

| Función(es) en `src/analitica.js` | Complejidad espacial | Justificación en el código |
| :--- | :---: | :--- |
| `valorVenta`, `normalizar`, `nombreCiudad` | `O(1)` | Operan sobre un único registro o cadena corta sin crear colecciones proporcionales a `n`. |
| `primeraVentaOp` | `O(1)` | Solo incrementa el contador existente y retorna la referencia `listaVentas[0]`. |
| `totalVendido`, `totalVendidoOp`, `unidadesVendidas`, `totalUnidades`, `unidadesVendidasM`, `totalUnidadesM` | `O(1)` | Solo mantienen un acumulador numérico (`total` / `unidades` / `acc` en `reduce`) sin crear arreglos intermedios. |
| `ventaMayor`, `ventaMayorOp`, `ventaMayorM` | `O(1)` | Guardan únicamente una referencia (`mayor`) a un objeto que ya existe dentro de `listaVentas`. |
| `ticketPromedio` | `O(1)` | Solo usa dos variables numéricas (`sumaValidas` y `conteoValidas`). |
| `ventasPorCiudad`, `totalCiudadUnaPasada` | `O(1)` | Solo usan la cadena `objetivo` y el acumulador numérico `totalCiudad` / `total`. |
| `totalVendidoM` | `O(n)` | `.map()` construye un arreglo nuevo con `n` subtotales antes de pasarlo a `.reduce()`. |
| `ticketPromedioM` | `O(n)` | `.filter()` crea el arreglo `validas` (hasta `n` elementos) y `totalVendidoM(validas)` crea otro arreglo con `.map()`. |
| `ventasPorCiudadM` | `O(n)` | `.filter()` y `.map()` crean dos arreglos intermedios que en el peor caso (todas las ventas en la misma ciudad) tienen tamaño `n`. |
| `totalCiudadCadena` | `O(n)` | Crea siempre un primer arreglo de `n` objetos nuevos con `.map()`, más los arreglos de `.filter()` y el segundo `.map()`. |
| `ventasDelDia`, `ventasDelDiaM` | `O(n)` | Construyen y retornan un arreglo con las ventas de esa fecha; en el peor caso (todas del mismo día) guarda `n` elementos. |
| `totalPorCiudad`, `totalPorCiudadM`, `totalPorCiudadOp` | `O(c)` → peor caso `O(n)` *(práctico `O(1)`)* | Crean un objeto diccionario con una propiedad por cada **ciudad distinta (`c`)**. En el peor caso teórico general donde cada venta fuera de una ciudad diferente (`c = n`), crece como `O(n)`; en el negocio real de Café Origen con catálogo fijo de `4` ciudades (`c ≪ n`), ocupa memoria prácticamente constante. |
| `unidadesPorProducto` | `O(p)` → peor caso `O(n)` *(práctico `O(1)`)* | Crea un objeto con una clave por cada **producto distinto (`p`)** (`O(n)` si hubiera `n` productos únicos; acotado a `5` claves con catálogo fijo). |
| `topProductosPorValor` | `O(p)` → peor caso `O(n)` *(práctico `O(1)`)* | Crea el objeto `totalesPorProducto` (`p` claves), el arreglo `Object.entries` (`p` pares), su copia `[...pares]` (`p` pares) y el corte `.slice(0, k)`. Depende del número de productos distintos `p`: en el peor caso teórico (`p = n`) es `O(n)`, pero con un catálogo pequeño fijo no crece al aumentar el millón de ventas. |
| `clientesRecurrentes` | `O(n)` | El arreglo `recurrentes` almacena cada cliente repetido (hasta `n / 2` clientes distintos en el peor caso, o `≈ n / 3` con el generador). |

### 5. Decisión técnica: ¿cuál versión de `totalCiudad` elegir para el motor?
- **Decisión:** Se elige **`totalCiudadUnaPasada`** (misma estrategia de recorrido único que `ventasPorCiudad`) como la versión principal para producción en el servidor del marketplace, dejando `totalCiudadCadena` exportada únicamente como referencia comparativa para `src/medir.js` y `RENDIMIENTO.md`.
- **Justificación (legibilidad vs. recursos):** Aunque `totalCiudadCadena` expresa cada transformación como una tubería declarativa, `totalCiudadUnaPasada` usa un `for...of` con un `if` simple que sigue siendo totalmente claro y legible para cualquier desarrollador del equipo. A cambio, reduce la memoria adicional de **`O(n)` (`3` arreglos nuevos + `n` objetos temporales) a `O(1)` (`0` arreglos creados)** y ejecuta una sola pasada en menos de la mitad del tiempo (`0,675 ms` frente a `1,781 ms` con `10.000` ventas), protegiendo la memoria limitada del servidor cuando el volumen suba a cientos de miles de transacciones.

## MiniReto 8: Analítica `v0.2` — El informe de rendimiento (`RENDIMIENTO.md`)

### 1. Medición integral del motor (`n = 10.000`) y creación de `RENDIMIENTO.md`
- Se corrigió una duplicación accidental de líneas al final de `src/medir.js` para asegurar que el script se ejecute limpio de principio a fin.
- Se midieron todas las funciones de `src/analitica.js` con una muestra uniforme de `10.000` ventas generadas y se documentó en la raíz del proyecto el archivo `RENDIMIENTO.md` incluyendo:
  1. **Tabla maestra de complejidades:** Función, propósito, complejidad temporal, complejidad espacial, justificación directa desde el código y operaciones/tiempo medido en `n = 10.000`.
  2. **Proyección a `1.000.000` de ventas:** Calculada multiplicando por `1` (`O(1)`), por `100` (`O(n)`, quedando todas por debajo de `0,25 s`) y por `10.000` (`O(n²)` en `clientesRecurrentes`, pasando de `316,84 ms` en `10.000` y `43,57 s` en `100.000` a entre **`53` y `73 minutos`** en `1.000.000`).
  3. **Priorización de riesgos:** Ordenados de mayor a menor impacto (`clientesRecurrentes` en primer lugar crítico, seguido de cadenas con arreglos intermedios `O(n)` en RAM, agrupaciones/filtros dependientes de cardinalidad, ciclos simples `O(1)` en espacio y utilidades `O(1)`).
  4. **Plan de optimización sin implementar:** Identificación de los dos trabajos repetidos en `clientesRecurrentes` (comparar pares con doble ciclo `for` y buscar linealmente con `.includes()`) y diseño conceptual para resolverlo en un único recorrido `O(n)` recordando en memoria los clientes ya vistos o su conteo de compras.

### 2. Revisión de un compañero y respuesta técnica
- **Observación recibida del compañero:**
  > *"Estuve revisando tu tabla en `RENDIMIENTO.md` y vi que en `topProductosPorValor` el tiempo para `1.000.000` de ventas lo proyectaste casi lineal (`< 0,25 s`), pero esa función usa `.sort()` adentro y en la sesión vimos que ordenar tiene complejidad `O(n log n)`, no `O(n)`. ¿No debería estar clasificada como `O(n log n)` y crecer más rápido que las lineales?"*
- **Respuesta y ajuste aplicado:**
  - Muy buena observación. Revisando línea por línea `topProductosPorValor` en `src/analitica.js`, la clave está en **qué arreglo recibe `.sort()`**: la función **no ordena las `n` ventas**, sino que primero recorre las `n` ventas con `.reduce()` en tiempo `O(n)` para agruparlas por nombre de producto, y después aplica `.sort()` únicamente sobre `copiaPares` (`Object.entries(totalesPorProducto)`), cuyo tamaño es `p` (la cantidad de productos distintos, que en Café Origen son `5` referencias fijas, no `1.000.000`).
  - Por lo tanto, la complejidad exacta se expresa con dos variables como **`O(n + p log p)`**:
    - Con un catálogo comercial fijo y pequeño (`p = 5`), `p log p` es constante y domina el recorrido lineal **`O(n)`**.
    - En cambio, en el peor caso teórico general donde cada venta correspondiera a un producto completamente distinto (`p = n`), sí pasaría a costar **`O(n log n)`** en tiempo y **`O(n)`** en memoria.
  - A raíz de esta observación, se dejó explícita la expresión `O(n + p log p)` (distinguiendo el caso de catálogo fijo frente al peor caso `p = n`) tanto en la tabla principal como en la sección de **Riesgos** de `RENDIMIENTO.md`.

## MiniReto 9: Clientes recurrentes en tiempo lineal (`Set` y `Map`)

### 1. Aplicación de las 6 fases del método de resolución de problemas
1. **Entender el problema:**
   - **Entrada:** Un arreglo `ventas` de tamaño `n`, donde cada elemento es un objeto con la propiedad `cliente` (`string`, por ejemplo `"C01"`).
   - **Salida:** Un arreglo de códigos de clientes únicos (sin duplicados) que hayan realizado **`2` o más compras** en el historial.
   - **Restricciones:** Debe procesar `100.000` ventas en **menos de `1 segundo`**, no debe mutar el arreglo `ventas` recibido y debe manejar casos borde sin fallar.
2. **Ejemplos y casos borde (calculados a mano):**
   - Muestra Día 1 (`12` ventas): `C01` (`3` veces), `C02` (`2` veces), `C03` (`2` veces) y `C04`–`C08` (`1` vez) → `["C01", "C02", "C03"]`.
   - Arreglo vacío `[]` → `[]`.
   - Una sola venta `[{ cliente: "C01", ... }]` → `[]` (ningún cliente puede tener `2` compras).
   - Todos distintos (`C01`, `C02`, `C03`) → `[]`.
   - Mismo cliente tres veces (`C01`, `C01`, `C01`) → `["C01"]` (aparece una sola vez en la respuesta).
3. **Fuerza bruta y su complejidad:**
   - La versión inicial `clientesRecurrentes(ventas)` usa dos ciclos `for` anidados (`i` y `j = i + 1`) para comparar todos los pares de ventas (`n × (n - 1) / 2`) y llama a `!recurrentes.includes(...)` para evitar repetidos: cuesta **`O(n²)`** en tiempo (hasta `O(n³)` en el peor caso por `.includes()`) y `O(n)` en espacio.
4. **Optimizar (eliminar trabajo repetido):**
   - El trabajo repetido consiste en volver a recorrer el resto del arreglo buscando el mismo cliente y volver a recorrer `recurrentes` con `.includes()`.
   - Reemplazamos las búsquedas en arreglos por estructuras hash de JavaScript (`Set` y `Map`), donde consultar si una clave existe (`.has()`) e insertarla/actualizarla (`.add()` / `.set()`) toma tiempo constante promedio **`O(1)`**, permitiendo resolver el problema en un solo recorrido lineal **`O(n)`**.
5. **Implementar (`src/analitica.js`):**
   - **`clientesRecurrentesSet(ventas)`:** Crea `vistos = new Set()` y `recurrentes = new Set()`. En un único `for...of`, si `vistos.has(cliente)` es verdadero lo agrega a `recurrentes` (que ignora duplicados automáticamente); si no, lo agrega a `vistos`. Al final retorna `[...recurrentes]`.
   - **`comprasPorCliente(ventas)` y `clientesRecurrentesMap(ventas)`:** La primera recorre `ventas` con un `Map` (`conteo`), iniciando en `1` o sumando `actual + 1` con `.get()` y `.set()`. La segunda recorre los pares `[cliente, cantidadCompras]` del `Map` y guarda en un arreglo aquellos con `cantidadCompras >= 2`.
6. **Probar y verificar orden (`src/verificar.js`):**
   - Como `clientesRecurrentesSet` inserta al cliente en su **segunda** compra mientras que `Map` y la versión original conservan el orden de la **primera** compra, en `src/verificar.js` se ordenaron copias con `[...resultado].sort()` antes de comparar.
   - Resultado: **`[OK]`** tanto con las `12` ventas del Día 1 como con `5.000` ventas generadas y con el arreglo vacío `[]`. Complejidad final verificada: **`O(n)` temporal** y **`O(n)` espacial**.

### 2. Medición comparativa de tiempos (`1.000`, `10.000` y `100.000` ventas)

| `n` (ventas) | Original `O(n²)` (`for` anidado + `includes`) | Versión `Set` `O(n)` | Versión `Map` `O(n)` | Mejora (`Original / Set`) |
| ---: | ---: | ---: | ---: | :---: |
| `1.000` | `2,362 ms` | `0,248 ms` | `0,276 ms` | `~9,5×` más rápida |
| `10.000` | `340,445 ms` | `1,315 ms` | `3,460 ms` | `~259×` más rápida |
| `100.000` | `43.566,000 ms` (`43,57 s`) | **`12,511 ms`** (`0,0125 s`) | **`16,385 ms`** (`0,0164 s`) | **`~3.482×` más rápida** |

- **Crecimiento lineal vs. cuadrático:** Al multiplicar `n` por `10` (de `10.000` a `100.000`), la versión original multiplicó su tiempo más de `127` veces (`0,34 s` → `43,57 s`), mientras que `clientesRecurrentesSet` creció linealmente `~9,5` veces (`1,32 ms` → `12,51 ms`), respondiendo en **12,5 milisegundos** (muy por debajo del límite de `1.000 ms` exigido por el marketplace).

### 3. Intercambio entre tiempo y memoria (*time–space trade-off*)
- Para bajar el tiempo de **`O(n²)`** a **`O(n)`**, la nueva solución asume un costo explícito de memoria adicional **`O(n)`** (más exactamente `O(u)`, donde `u` es el número de clientes distintos, que con el generador es `≈ n / 3`).
- En `clientesRecurrentesSet`, `vistos` llega a guardar todos los clientes únicos y `recurrentes` guarda los repetidos; en `comprasPorCliente`, el `Map` almacena una entrada `[cliente, conteo]` por cada cliente único. Ese espacio extra de unos pocos megabytes para `100.000` ventas es un intercambio completamente favorable porque evita bloquear el servidor durante `43` segundos (o más de una hora con un millón de ventas).

## MiniReto 10: Combos de regalo y conteo de frecuencias (`src/catalogo.js` y `Map`)

### 1. Catálogo de campaña y problema del combo exacto (`comboRegaloBruto` vs `comboRegalo`)
- Se creó `src/catalogo.js` exportando los `8` productos oficiales de la campaña con sus precios (`{ producto, precio }`).
- **Versión por fuerza bruta (`comboRegaloBruto`):** Usa dos ciclos `for` anidados (`i` y `j = i + 1`) probando todas las parejas posibles hasta encontrar `catalogo[i].precio + catalogo[j].precio === valor` (o retornar `null`). Su complejidad temporal es **`O(n²)`** (con `n` igual al tamaño del catálogo) y espacial **`O(1)`**.
- **Versión optimizada con complemento (`comboRegalo`):** Recorre el catálogo **una sola vez** usando un `Map` (`vistosPorPrecio`). En cada producto calcula `complemento = valor - item.precio`:
  - Primero verifica `vistosPorPrecio.has(complemento)`: si ya apareció antes, retorna el par `[productoAnterior, item]`.
  - Si no apareció, guarda `vistosPorPrecio.set(item.precio, item)` **después** del condicional `if` para garantizar que siempre se combinen dos productos distintos y nunca un producto consigo mismo.
- **Pruebas realizadas (`src/verificar.js`):**
  - `valor = 87000` → `[{ producto: "Origen Huila 500 g", precio: 42000 }, { producto: "Origen Sierra 500 g", precio: 45000 }]` (`42.000 + 45.000 = 87.000`).
  - `valor = 61000` → `[{ producto: "Origen Nariño 250 g", precio: 26000 }, { producto: "Taza de cerámica", precio: 35000 }]` (`26.000 + 35.000 = 61.000`).
  - `valor = 50000` (sin combinación posible) → `null`.

### 2. Traza manual de `comboRegalo(catalogo, 87000)`

| Paso | `item.producto` | `item.precio` | `complemento` (`87000 - precio`) | ¿`vistosPorPrecio.has(complemento)`? | Estado de `vistosPorPrecio` al final del paso | Retorno |
| :---: | :--- | ---: | ---: | :---: | :--- | :--- |
| `1` | `Origen Nariño 250 g` | `26000` | `61000` | No | `{ 26000 => "Origen Nariño 250 g" }` | Continúa |
| `2` | `Origen Huila 500 g` | `42000` | `45000` | No | `{ 26000 => "Origen Nariño 250 g", 42000 => "Origen Huila 500 g" }` | Continúa |
| `3` | `Origen Sierra 500 g` | `45000` | `42000` | **Sí** (`"Origen Huila 500 g"`) | *(retorna de inmediato en el paso 3 sin recorrer los 5 restantes)* | **`[Huila 500 g, Sierra 500 g]`** |

### 3. Producto estrella por ciudad (`productoEstrellaPorCiudad`) y regla de desempate
- Se construyó un `Map` principal `frecuenciasPorCiudad` donde cada clave es la ciudad limpia con `nombreCiudad(venta.ciudad)` y cada valor es otro `Map` interno que cuenta las apariciones de cada `venta.producto`.
- **Regla de desempate definida:** Al recorrer los conteos de cada ciudad se utiliza la comparación estricta `if (apariciones > maxApariciones)`. Así, cuando dos o más productos empatan en el máximo de apariciones dentro de una ciudad, **se conserva el primer producto que alcanzó esa frecuencia máxima en el orden cronológico del historial de ventas**.
  - En las `12` ventas del Día 1: `Medellín` → `"Origen Huila 500 g"` (`2`), `Bogotá` → `"Origen Nariño 250 g"` (`3`), `Pereira` → `"Origen Huila 500 g"` (`1`) y `Cali` (triple empate con `1` aparición cada uno) → `"Prensa francesa"` por ser la primera venta registrada en Cali (`id: 3`).

### 4. Primer cliente único para cupón (`primerClienteUnico`)
- Se resolvió con **dos recorridos secuenciales y un `Map`** (`conteo`):
  1. Primer `for...of`: cuenta el total de compras de cada cliente en todo el historial.
  2. Segundo `for...of`: vuelve a recorrer `ventas` en su orden original y retorna el primer `venta.cliente` cuyo `conteo.get(cliente) === 1` (o `null` si todos repitieron o el arreglo está vacío).
- Con los `12` datos del Día 1 devuelve exactamente **`"C04"`** (venta `id: 5`, ya que `C01`, `C02` y `C03` compraron más de una vez).

### 5. Clasificación de complejidad de las funciones del MiniReto 10

| Función | Complejidad temporal | Complejidad espacial | Justificación |
| :--- | :---: | :---: | :--- |
| `comboRegaloBruto(catalogo, valor)` | `O(n²)` | `O(1)` | Doble ciclo anidado que evalúa hasta `n × (n - 1) / 2` pares sin estructuras adicionales (`n` = productos del catálogo). |
| `comboRegalo(catalogo, valor)` | **`O(n)`** | **`O(n)`** | Un único recorrido sobre el catálogo con consultas e inserciones `O(1)` en el `Map` de precios vistos (guarda hasta `n` entradas). |
| `productoEstrellaPorCiudad(ventas)` | **`O(n)`** | **`O(c · p)` ≤ `O(n)`** | Un recorrido de `n` ventas actualizando mapas en `O(1)`, seguido de la revisión de los pares `(ciudad, producto)` únicos registrados (como máximo `n`). |
| `primerClienteUnico(ventas)` | **`O(n)`** | **`O(n)`** | Dos recorridos secuenciales independientes (`O(2n) = O(n)`) y un `Map` que almacena hasta `n` clientes únicos. |

## MiniReto 11: La mejor racha y el presupuesto exacto (Ventana deslizante y Dos punteros)

### 1. Mejor semana de septiembre (`mejorSemanaBruta` vs `mejorSemana`) y dibujo de las 3 primeras ventanas
- Se implementó `mejorSemanaBruta(dias, k)` sumando desde cero cada bloque de `k` días consecutivos, y `mejorSemana(dias, k)` con **ventana deslizante de tamaño fijo**: calcula una sola vez los primeros `k` días y en cada paso suma `dias[i]` (el día que entra por la derecha) y resta `dias[i - k]` (el día que sale por la izquierda), retornando `null` si `k <= 0` o `dias.length < k`.
- **Dibujo de las tres primeras posiciones de la ventana (`k = 7`) en `ventasDiarias` (miles de COP):**

```text
Arreglo inicial (primeros 9 días): [ 320, 410, 280, 390, 510, 620, 700, 300, 290, ... ]

Ventana 1 (índices 0..6, días 1 al 7):
[ 320 | 410 | 280 | 390 | 510 | 620 | 700 ]  300   290
  └────────────────── suma inicial = 3.230 ──────────────────┘

Ventana 2 (índices 1..7, días 2 al 8) -> sale 320, entra 300:
  320 [ 410 | 280 | 390 | 510 | 620 | 700 | 300 ]  290
        └──────── 3.230 + 300 - 320 = 3.210 ────────┘

Ventana 3 (índices 2..8, días 3 al 9) -> sale 410, entra 290:
  320   410 [ 280 | 390 | 510 | 620 | 700 | 300 | 290 ]
              └──────── 3.210 + 290 - 410 = 3.090 ────────┘
```

- **Resultado en septiembre (`k = 7`):** Ambas funciones coinciden (`[OK]`) e identifican que la **mejor semana inicia el día `24` de septiembre** (días `24` al `30`: `440 + 500 + 590 + 650 + 720 + 400 + 370`), con un total de **`3.670` miles de pesos (`$3.670.000`)**.
- **Comparación con `100.000` días generados al azar (`src/medir.js`):**
  - Con `k = 7`: ambas coinciden exactamente (`[OK]`); fuerza bruta tardó `1,909 ms` y ventana deslizante `1,313 ms`.
  - Con `k = 90` (trimestre móvil): ambas coinciden exactamente (`[OK]`); fuerza bruta subió a `6,100 ms` por recalcular `90` sumas en cada posición, mientras que la ventana deslizante bajó a **`0,161 ms`** (`~38×` más rápida) porque siempre hace solo una suma y una resta por paso sin importar el valor de `k`.

### 2. Presupuesto corporativo con dos punteros (`parMasCercano`) y traza para `$100.000`
- Se copió el catálogo con `[...precios]` para no mutar el arreglo original y se ordenó de menor a mayor precio:
  - `[0]` Filtros (`18.000`), `[1]` Nariño 250 g (`26.000`), `[2]` Taza (`35.000`), `[3]` Huila 500 g (`42.000`), `[4]` Sierra 500 g (`45.000`), `[5]` Huila 1 kg (`79.000`), `[6]` Prensa francesa (`95.000`), `[7]` Molino manual (`120.000`).
- **Resultados de prueba:**
  - Presupuesto `$100.000` → `Filtros de papel x100 ($18.000)` + `Origen Huila 1 kg ($79.000)` = **`$97.000`**.
  - Presupuesto `$140.000` → `Origen Sierra 500 g ($45.000)` + `Prensa francesa ($95.000)` = **`$140.000`** (exacto).
  - Presupuesto `$40.000` → **`null`** (sin solución: los dos productos más económicos suman `18.000 + 26.000 = $44.000`, superando el presupuesto).

#### Traza de punteros para `parMasCercano(catalogo, 100000)`

| Paso | `izq` (producto y precio) | `der` (producto y precio) | `sumaActual` | ¿`> 100.000`? | `mejorSuma` / `mejorPar` | Movimiento y razón |
| :---: | :--- | :--- | ---: | :---: | :--- | :--- |
| `1` | `0`: Filtros (`18.000`) | `7`: Molino (`120.000`) | `138.000` | Sí | `null` | **`der--` (`→ 6`)**: la suma se pasa del presupuesto; como el arreglo está ordenado, la única forma de bajar la suma es reducir el precio mayor. |
| `2` | `0`: Filtros (`18.000`) | `6`: Prensa (`95.000`) | `113.000` | Sí | `null` | **`der--` (`→ 5`)**: aún supera `100.000`, se descarta `Prensa` hacia la izquierda. |
| `3` | `0`: Filtros (`18.000`) | `5`: Huila 1 kg (`79.000`) | `97.000` | No (`<=`) | **`97.000` (`Filtros + Huila 1 kg`)** | **`izq++` (`→ 1`)**: suma válida y nuevo máximo; se avanza el puntero izquierdo buscando una suma mayor que se acerque más a `100.000`. |
| `4` | `1`: Nariño (`26.000`) | `5`: Huila 1 kg (`79.000`) | `105.000` | Sí | `97.000` (`Filtros + Huila 1 kg`) | **`der--` (`→ 4`)**: `105.000` excede el tope, así que hay que disminuir el extremo derecho. |
| `5` | `1`: Nariño (`26.000`) | `4`: Sierra (`45.000`) | `71.000` | No (`<=`) | `97.000` *(no mejora)* | **`izq++` (`→ 2`)**: cabe en el presupuesto pero `71.000 < 97.000`; se sube `izq` para intentar aumentar la suma. |
| `6` | `2`: Taza (`35.000`) | `4`: Sierra (`45.000`) | `80.000` | No (`<=`) | `97.000` *(no mejora)* | **`izq++` (`→ 3`)**: `80.000 < 97.000`; se vuelve a avanzar `izq` buscando mayor valor. |
| `7` | `3`: Huila 500 g (`42.000`) | `4`: Sierra (`45.000`) | `87.000` | No (`<=`) | `97.000` *(no mejora)* | **`izq++` (`→ 4`)**: `87.000 < 97.000`; al subir `izq` queda `izq === der` (`4 === 4`), termina el `while` y retorna `[Filtros, Huila 1 kg]`. |

### 3. Clasificación de complejidad de las funciones del MiniReto 11

| Función | Complejidad temporal | Complejidad espacial | Justificación |
| :--- | :---: | :---: | :--- |
| `mejorSemanaBruta(dias, k)` | `O(n · k)` | `O(1)` | Por cada una de las `n - k + 1` posiciones iniciales recorre internamente `k` elementos sumando desde cero. |
| `mejorSemana(dias, k)` | **`O(n)`** | **`O(1)`** | Suma los primeros `k` días una vez y luego avanza desde `k` hasta `n - 1` haciendo solo `1` suma y `1` resta por día (`k + (n - k) = n` pasos totales) y usando variables simples. |
| `parMasCercano(precios, presupuesto)` | **`O(n log n)`** | **`O(n)`** | Copiar y ordenar `[...precios].sort(...)` cuesta `O(n log n)` y el ciclo `while (izq < der)` recorre el arreglo a lo sumo una vez (`O(n)`); al sumar `O(n log n) + O(n)` domina **`O(n log n)`**. En memoria usa `O(n)` por la copia ordenada (el recorrido de punteros por sí solo es `O(1)`). |