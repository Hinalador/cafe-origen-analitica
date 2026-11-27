# 📊 Informe de Rendimiento — Motor de Analítica Café Origen (`v0.2`)

Documento técnico de evaluación de complejidad temporal, complejidad espacial, mediciones empíricas y escalabilidad del motor de analítica (`src/analitica.js`) previo a su integración con la plataforma de marketplace nacional.

- **Entorno de medición:** Node.js sobre Linux (`x86_64`), datos sintéticos generados con `generarVentas(n)` (`src/generador.js`, `n / 3` clientes posibles, `5` productos y `4` ciudades).
- **Notación:** `n` = cantidad de registros de ventas; `c` = cantidad de ciudades distintas (`c <= n`); `p` = cantidad de productos distintos (`p <= n`).

---

## 1. Clasificación Completa de Funciones y Evidencia (`n = 10.000` ventas)

| Función | Qué hace | Complejidad temporal | Complejidad espacial | Justificación basada en el código | Evidencia con `10.000` ventas |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `valorVenta(venta)` | Multiplica `cantidad * precio` de un registro. | `O(1)` | `O(1)` | Ejecuta una sola multiplicación aritmética sin ciclos ni estructuras adicionales. | `1` op (`~0,020 ms` por llamada) |
| `normalizar(texto)` | Limpia espacios (`.trim()`) y pasa a minúsculas un texto. | `O(1)`* | `O(1)`* | Opera sobre una cadena corta de ciudad (*constante respecto a la cantidad de ventas `n`*). | `~0,049 ms` por llamada |
| `nombreCiudad(texto)` | Estandariza el nombre de una ciudad en formato título. | `O(1)`* | `O(1)`* | Limpia y capitaliza un único nombre de ciudad sin depender del tamaño `n` del arreglo. | `~0,053 ms` por llamada |
| `primeraVentaOp(lista, cont)` | Retorna el primer registro (`lista[0]`) o `null` si está vacío. | `O(1)` | `O(1)` | Sin ciclos: verifica `length === 0` y accede por índice directo `lista[0]`. | `1` operación (`0,054 ms`) |
| `totalVendido(lista)` / `totalVendidoOp` | Suma el valor monetario de todas las ventas con `for...of`. | `O(n)` | `O(1)` | Un solo ciclo `for...of` que visita los `n` elementos acumulando en una variable numérica `total`. | `10.000` ops / `0,345 ms` |
| `totalVendidoM(lista)` | Suma el valor de todas las ventas con `.map()` y `.reduce()`. | `O(n)` | `O(n)` | Hace `2` recorridos lineales (`O(2n) = O(n)`); `.map()` crea un arreglo nuevo de `n` números en memoria. | `0,484 ms` (`2` pasadas) |
| `unidadesVendidas(lista)` / `totalUnidades` | Suma todas las unidades vendidas con `for...of`. | `O(n)` | `O(1)` | Un solo ciclo `for...of` acumulando `venta.cantidad` en una variable escalar `unidades`. | `0,379 ms` (`10.000` pasos) |
| `unidadesVendidasM(lista)` / `totalUnidadesM` | Suma todas las unidades vendidas usando `.reduce()`. | `O(n)` | `O(1)` | Un único recorrido `.reduce()` acumulando un número desde `0`, sin crear arreglos intermedios. | `0,241 ms` (`1` pasada) |
| `ventaMayor(lista)` / `ventaMayorOp` | Encuentra y retorna el objeto de venta con mayor subtotal (`for...of`). | `O(n)` | `O(1)` | Recorre una vez `lista` comparando subtotales y guardando solo la referencia al objeto `mayor`. | `10.000` ops / `1,496 ms` |
| `ventaMayorM(lista)` | Encuentra la venta de mayor subtotal usando `.reduce()`. | `O(n)` | `O(1)` | Un recorrido `.reduce()` que conserva únicamente la referencia al registro ganador sin copiar el arreglo. | `0,367 ms` (`1` pasada) |
| `ticketPromedio(lista)` | Promedia el valor de las ventas válidas (`cantidad > 0`) con `for...of`. | `O(n)` | `O(1)` | Un solo ciclo `for...of` que actualiza dos variables numéricas (`sumaValidas` y `conteoValidas`). | `0,498 ms` (`1` pasada) |
| `ticketPromedioM(lista)` | Promedia ventas válidas filtrando con `.filter()` y llamando a `totalVendidoM`. | `O(n)` | `O(n)` | Hace `3` recorridos (`filter` + `map` + `reduce` → `O(n)`) y crea `2` arreglos nuevos de hasta `n` elementos. | `0,567 ms` (`3` pasadas) |
| `ventasPorCiudad(lista, ciudad)` | Suma con `for...of` el total vendido en una ciudad normalizada. | `O(n)` | `O(1)` | Un solo ciclo `for...of` y dos variables simples (`objetivo` y `totalCiudad`), sin arreglos auxiliares. | `0,804 ms` (`1` pasada) |
| `ventasPorCiudadM(lista, ciudad)` | Suma el total de una ciudad encadenando `.filter().map().reduce()`. | `O(n)` | `O(n)` | Recorre `lista` con `filter` y luego los filtrados con `map` y `reduce`; crea `2` arreglos de hasta `n` datos. | `0,891 ms` (`3` pasadas) |
| `totalCiudadCadena(ventas, ciudad)` | Normaliza con `map`, filtra con `filter`, calcula subtotal con `map` y suma con `reduce`. | `O(n)` | `O(n)` | Ejecuta `4` recorridos (`O(4n) = O(n)`) y construye `3` arreglos nuevos más `n` objetos temporales. | `1,703 ms` – `1,781 ms` |
| `totalCiudadUnaPasada(ventas, ciudad)` | Calcula el total de una ciudad en un único ciclo `for...of`. | `O(n)` | `O(1)` | Un solo recorrido (`O(1n) = O(n)`) y `0` arreglos creados; solo mantiene `objetivo` y `total`. | `0,675 ms` – `0,985 ms` |
| `ventasDelDia(lista, fecha)` | Filtra con `for...of` y `push` las ventas de una fecha dada. | `O(n)` | `O(n)` | Visita los `n` registros; en el peor caso (todas las ventas del mismo día) `delDia` almacena `n` elementos. | `0,751 ms` |
| `ventasDelDiaM(lista, fecha)` | Filtra con `.filter()` las ventas de una fecha dada. | `O(n)` | `O(n)` | Recorre los `n` elementos y retorna un nuevo arreglo que en el peor caso contiene `n` registros. | `0,306 ms` |
| `totalPorCiudad(lista)` / `totalPorCiudadM` / `totalPorCiudadOp` | Agrupa el monto vendido por cada ciudad normalizada en un objeto diccionario. | `O(n)` | `O(c)` → peor caso `O(n)` | Un recorrido de `n` ventas actualizando llaves en un objeto. Guarda `c` propiedades (`4` con catálogo fijo; `O(n)` si cada venta tuviera ciudad única). | `10.000` ops / `2,275 ms` |
| `unidadesPorProducto(lista)` | Agrupa y suma en un objeto las unidades vendidas por producto. | `O(n)` | `O(p)` → peor caso `O(n)` | Un recorrido `.reduce()` que almacena una propiedad por cada producto distinto `p` (`5` fijos hoy; hasta `n` en el peor caso). | `0,595 ms` |
| `topProductosPorValor(lista, k)` | Agrupa ingresos por producto, ordena de mayor a menor sin mutar y toma `k`. | `O(n + p log p)` *(catálogo fijo: `O(n)`; peor caso `p = n`: `O(n log n)`)* | `O(p)` → peor caso `O(n)` | Agrupa las `n` ventas en `O(n)` y ordena con `.sort()` únicamente los `p` productos distintos (`Object.entries` + copia `[...]`). | `0,770 ms` |
| `clientesRecurrentes(ventas)` | Busca clientes con `2` o más compras usando dos ciclos `for` anidados e `.includes()`. | `O(n²)` *(peor caso con `.includes()`: hasta `O(n³)`)* | `O(n)` | Por cada venta `i` recorre todas las siguientes `j > i` (`n(n-1)/2` pares) y además recorre `recurrentes` linealmente con `.includes()`. | `49.995.000` pares / **`316,835 ms`** |

---

## 2. Proyección para `1.000.000` de Ventas

Al escalar de `n = 10.000` a `n = 1.000.000`, el tamaño de entrada se multiplica por **`100`**. Aplicando el factor de crecimiento de cada clase de complejidad sobre nuestras mediciones reales:

- **En funciones `O(1)`:** factor `×1` (el tiempo no cambia).
- **En funciones `O(n)`:** factor `×100` (el tiempo se multiplica aproximadamente por `100`).
- **En funciones `O(n²)`:** factor $100^2 = \times 10.000$ (el tiempo se multiplica al menos por `10.000`).

| Grupo / Reporte | Complejidad temporal | Tiempo medido (`n = 10.000`) | Tiempo estimado (`n = 1.000.000`) | Viabilidad en el Marketplace |
| :--- | :---: | ---: | ---: | :--- |
| Consultas directas (`primeraVentaOp`, `valorVenta`) | `O(1)` | `~0,05 ms` | **`~0,05 ms`** | Instantáneo |
| Indicadores de una pasada (`totalVendido`, `unidadesVendidas`, `ticketPromedio`, `ventaMayorM`, `unidadesVendidasM`) | `O(n)` | `0,24 ms – 0,50 ms` | **`~24 ms – 50 ms`** (`< 0,05 s`) | Excelente (`O(1)` en memoria) |
| Total de una ciudad en una pasada (`ventasPorCiudad`, `totalCiudadUnaPasada`) | `O(n)` | `0,68 ms – 0,99 ms` | **`~68 ms – 99 ms`** (`< 0,10 s`) | Excelente (`O(1)` en memoria) |
| Total de una ciudad encadenado (`totalCiudadCadena`) | `O(n)` | `1,70 ms – 1,78 ms` | **`~170 ms – 180 ms`** *(+ pausas de memoria)* | Aceptable en tiempo, pero costoso en RAM (`3` arreglos + `1M` objetos) |
| Agrupaciones y ranking (`unidadesPorProducto`, `topProductosPorValor`, `totalPorCiudad`) | `O(n)` *(con catálogo fijo)* | `0,60 ms – 2,28 ms` | **`~60 ms – 228 ms`** (`< 0,25 s`) | Muy bueno para catálogos comerciales acotados |
| Filtro por fecha (`ventasDelDia`, `ventasDelDiaM`) | `O(n)` | `0,31 ms – 0,75 ms` | **`~31 ms – 75 ms`** | Rápido (vigilar tamaño del arreglo devuelto) |
| **Reporte de clientes recurrentes (`clientesRecurrentes`)** | **`O(n²)`** *(hasta `O(n³)`)* | **`316,84 ms`** *(y `43,57 s` reales en `n = 100.000`)* | **`~3.168 s` a `~4.357 s` (`53` a `73 minutos`)** | **INVIABLE — bloquea el servidor** |

> **Nota sobre la proyección de `clientesRecurrentes`:** Con la base de `10.000` ventas (`0,3168 s × 10.000`) se estiman `52,8 minutos`; al contrastar con la medición real hecha en `n = 100.000` (`43,566 s × 100`), donde el arreglo `recurrentes` ya acumula decenas de miles de clientes y encarece `.includes()`, la proyección sube a **`72,6 minutos` (más de 1 hora y 12 minutos)** realizando `499.999.500.000` comparaciones de pares.

---

## 3. Riesgos (Ordenados de Mayor a Menor)

**Criterio de priorización:** Se ordenan combinando (1) el orden de crecimiento temporal ante grandes volúmenes (riesgo de congelar el proceso principal de Node.js), (2) el crecimiento de memoria adicional en un servidor con RAM limitada y (3) el crecimiento potencial de claves distintas (`p` productos o `c` ciudades).

1. **Riesgo 1 (Crítico — Bloqueante): `clientesRecurrentes` (`O(n²)` en tiempo, hasta `O(n³)` por `.includes()`, `O(n)` en espacio)**
   - Es el único algoritmo cuadrático del motor. Con `100.000` ventas ya tarda `43,6 segundos` (incumpliendo cualquier tiempo de respuesta web) y con `1.000.000` de ventas dejaría bloqueado el servidor más de una hora.
2. **Riesgo 2 (Medio-Alto — Presión de memoria RAM): Cadenas de métodos con arreglos intermedios (`totalCiudadCadena`, `ticketPromedioM`, `ventasPorCiudadM`, `totalVendidoM` — `O(n)` tiempo, `O(n)` espacio)**
   - Aunque escalan linealmente en tiempo, crean copias parciales o completas de tamaño `n` en cada ejecución. En especial, `totalCiudadCadena` reserva `1.000.000` de objetos nuevos y hasta `3` arreglos intermedios por consulta; si llegan varias peticiones simultáneas en un servidor con poca RAM, puede provocar recolecciones de basura pesadas o un error por falta de memoria (*Out of Memory*).
3. **Riesgo 3 (Medio — Crecimiento por cardinalidad o tamaño de salida): `ventasDelDia` / `ventasDelDiaM`, `topProductosPorValor`, `totalPorCiudad`, `unidadesPorProducto`**
   - `ventasDelDia` construye un arreglo con todas las coincidencias (`O(n)` espacio en días pico como promociones nacionales). Por su parte, `topProductosPorValor` (`O(n + p log p)`) y `totalPorCiudad` (`O(c)` espacio) hoy usan memoria mínima porque hay pocos productos y ciudades, pero si el catálogo creciera a decenas de miles de referencias únicas, el `.sort()` y los objetos agrupadores pasarían a pesar más.
4. **Riesgo 4 (Bajo): Métricas lineales de una sola pasada sin arreglos nuevos (`totalVendido`, `unidadesVendidas`, `unidadesVendidasM`, `ventaMayor`, `ventaMayorM`, `ticketPromedio`, `ventasPorCiudad`, `totalCiudadUnaPasada` — `O(n)` tiempo, `O(1)` espacio)**
   - Recorren los datos una única vez y mantienen un par de variables numéricas o una referencia; responden en menos de `0,15 s` incluso con un millón de ventas.
5. **Riesgo 5 (Mínimo / Nulo): Funciones auxiliares y de acceso directo (`primeraVentaOp`, `valorVenta`, `normalizar`, `nombreCiudad` — `O(1)` tiempo, `O(1)` espacio)**
   - Su costo es independiente del volumen de ventas.

---

## 4. Plan de Optimización para `clientesRecurrentes` (Diseño Conceptual)

*(Propuesta de rediseño previo a su implementación en la siguiente versión del motor).*

### ¿Qué trabajo se repite innecesariamente hoy?
1. **Relectura masiva de ventas en el ciclo anidado:** Para cada venta en la posición `i`, el ciclo interno `j` vuelve a recorrer todo el resto del arreglo buscando si el mismo código `cliente` aparece más adelante. Eso obliga a inspeccionar los mismos registros miles de veces (`n × (n - 1) / 2` comparaciones).
2. **Búsqueda lineal repetida en la lista de resultados:** Cada vez que dos ventas coinciden en el cliente, `!recurrentes.includes(ventas[i].cliente)` recorre desde cero el arreglo `recurrentes` elemento por elemento para comprobar si ese cliente ya había sido agregado antes.

### ¿Qué información se puede guardar para no buscarla de nuevo?
- En lugar de comparar cada venta contra todas las demás, podemos recorrer el arreglo `ventas` **una sola vez** de principio a fin e ir guardando en memoria **qué clientes ya hemos visto**:
  - **Alternativa A (conjuntos de acceso rápido):** Mantener una estructura de clientes `vistos` y otra de clientes `recurrentes` donde consultar si un código existe y agregarlo cueste tiempo constante **`O(1)`** (sin recorrer arreglos con `.includes()`). Al leer una venta: si el cliente no está en `vistos`, se guarda en `vistos`; si ya estaba en `vistos`, se guarda directamente en `recurrentes`.
  - **Alternativa B (diccionario/mapa de conteo de compras):** Mantener una tabla clave–valor `{ cliente -> cantidadDeCompras }` en una sola pasada `O(n)` sumando `1` por cada aparición, y luego extraer en una segunda pasada corta las claves cuyo conteo sea mayor o igual a `2`.
- **Resultado esperado:** Reducir la complejidad temporal de **`O(n²)`** (minutos/horas) a **`O(n)`** (milisegundos incluso con `100.000` ventas), a cambio de mantener `O(n)` de memoria adicional para recordar los clientes vistos.
