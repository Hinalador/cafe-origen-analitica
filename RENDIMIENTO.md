# 📊 Informe de Rendimiento — Motor de Analítica Café Origen (`v1.0`)

Documento técnico de evaluación de complejidad temporal, complejidad espacial, mediciones empíricas, comparación evolutiva (`v0.1` / `v0.2` vs. `v1.0`) y escalabilidad del motor de analítica (`src/analitica.js`) para su integración con la plataforma de marketplace nacional.

- **Entorno de medición:** Node.js sobre Linux (`x86_64`), datos sintéticos generados con `generarVentas(n)` (`src/generador.js`, `n / 3` clientes posibles, `5` productos y `4` ciudades) y catálogo comercial de `8` productos (`src/catalogo.js`).
- **Notación:** `n` = cantidad de ventas; `c` = ciudades distintas (`c <= n`); `p` = productos distintos (`p <= n`); `m` = tamaño del catálogo (`8`); `d` = días del periodo (`30` en septiembre).

---

## 1. Clasificación Completa de Todas las Funciones del Motor (`v0.1` → `v1.0`)

| Función | Qué hace | Complejidad temporal | Complejidad espacial | Justificación basada en el código | Evidencia medida (`n = 10.000`) |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `valorVenta(venta)` | Multiplica `cantidad * precio` de un registro. | `O(1)` | `O(1)` | Una sola multiplicación aritmética sin ciclos ni estructuras auxiliares. | `1` op (`~0,020 ms`) |
| `normalizar(texto)` | Limpia espacios (`.trim()`) y pasa a minúsculas un texto. | `O(1)`* | `O(1)`* | Opera sobre un texto corto de ciudad (*constante respecto a `n`*). | `~0,049 ms` |
| `nombreCiudad(texto)` | Estandariza el nombre de una ciudad en formato título. | `O(1)`* | `O(1)`* | Limpia y capitaliza un único nombre de ciudad sin depender de `n`. | `~0,053 ms` |
| `primeraVentaOp(lista, cont)` | Retorna `lista[0]` o `null` si está vacío. | `O(1)` | `O(1)` | Sin ciclos: valida `length === 0` y accede por índice directo `lista[0]`. | `1` operación (`0,054 ms`) |
| `totalVendido(lista)` / `totalVendidoOp` | Suma el valor monetario de todas las ventas con `for...of`. | `O(n)` | `O(1)` | Un ciclo `for...of` que visita `n` elementos acumulando en una variable escalar `total`. | `10.000` ops / `0,345 ms` |
| `totalVendidoM(lista)` | Suma el valor de las ventas encadenando `.map()` y `.reduce()`. | `O(n)` | `O(n)` | Dos recorridos (`O(2n) = O(n)`); `.map()` crea un arreglo nuevo de `n` números. | `0,484 ms` |
| `unidadesVendidas(lista)` / `totalUnidades` | Suma todas las unidades vendidas con `for...of`. | `O(n)` | `O(1)` | Un ciclo `for...of` acumulando `venta.cantidad` en `unidades`. | `0,379 ms` |
| `unidadesVendidasM(lista)` / `totalUnidadesM` | Suma todas las unidades vendidas con `.reduce()`. | `O(n)` | `O(1)` | Un recorrido `.reduce()` acumulando un número desde `0` sin arreglos nuevos. | `0,241 ms` |
| `ventaMayor(lista)` / `ventaMayorOp` | Retorna el registro completo de mayor subtotal (`for...of`). | `O(n)` | `O(1)` | Un ciclo `for...of` que guarda solo la referencia al objeto `mayor`. | `10.000` ops / `1,496 ms` |
| `ventaMayorM(lista)` | Retorna la venta de mayor subtotal con `.reduce()`. | `O(n)` | `O(1)` | Un recorrido `.reduce()` conservando la referencia al registro ganador. | `0,367 ms` |
| `ticketPromedio(lista)` | Promedia las ventas válidas (`cantidad > 0`) con `for...of`. | `O(n)` | `O(1)` | Un ciclo `for...of` con dos contadores numéricos (`sumaValidas` y `conteoValidas`). | `0,498 ms` |
| `ticketPromedioM(lista)` | Promedia ventas válidas con `.filter()` + `totalVendidoM()`. | `O(n)` | `O(n)` | Tres pasadas (`filter` + `map` + `reduce`) y `2` arreglos intermedios de hasta `n` datos. | `0,567 ms` |
| `ventasPorCiudad(lista, ciudad)` | Suma en una pasada `for...of` el total vendido en una ciudad. | `O(n)` | `O(1)` | Un ciclo `for...of` y variables simples (`objetivo`, `totalCiudad`). | `0,804 ms` |
| `ventasPorCiudadM(lista, ciudad)` | Suma el total de una ciudad con `.filter().map().reduce()`. | `O(n)` | `O(n)` | Tres recorridos y `2` arreglos nuevos de hasta `n` elementos. | `0,891 ms` |
| `totalCiudadCadena(ventas, ciudad)` | Normaliza con `map`, filtra con `filter`, mapea subtotal y reduce. | `O(n)` | `O(n)` | Cuatro recorridos (`O(4n) = O(n)`), `3` arreglos nuevos y `n` objetos temporales. | `1,703 ms – 1,940 ms` |
| `totalCiudadUnaPasada(ventas, ciudad)` | Calcula el total de una ciudad en un único `for...of`. | `O(n)` | `O(1)` | Un solo recorrido (`O(1n) = O(n)`) y `0` arreglos creados. | `0,639 ms – 0,985 ms` |
| `ventasDelDia(lista, fecha)` | Filtra con `for...of` las ventas de una fecha dada. | `O(n)` | `O(n)` | Visita `n` ventas y retorna un arreglo nuevo de hasta `n` elementos. | `0,751 ms` |
| `ventasDelDiaM(lista, fecha)` | Filtra con `.filter()` las ventas de una fecha dada. | `O(n)` | `O(n)` | Recorre `n` ventas y construye un arreglo nuevo de hasta `n` elementos. | `0,306 ms` |
| `totalPorCiudad(lista)` / `totalPorCiudadM` / `totalPorCiudadOp` | Agrupa el total vendido por ciudad normalizada en un objeto. | `O(n)` | `O(c)` → peor caso `O(n)` | Un recorrido de `n` ventas; almacena `c` llaves (`4` con catálogo fijo; `O(n)` si todas fueran distintas). | `10.000` ops / `2,275 ms` |
| `unidadesPorProducto(lista)` | Agrupa y suma las unidades vendidas por producto. | `O(n)` | `O(p)` → peor caso `O(n)` | Un recorrido `.reduce()` con una propiedad por cada producto distinto `p`. | `0,595 ms` |
| `topProductosPorValor(lista, k)` | Agrupa valor por producto, ordena copia sin mutar y corta `k`. | `O(n + p log p)` *(fijo: `O(n)`; peor caso: `O(n log n)`)* | `O(p)` → peor caso `O(n)` | Agrupa `n` ventas en `O(n)` y ordena con `.sort()` únicamente los `p` productos distintos. | `0,770 ms` |
| `clientesRecurrentes(ventas)` *(legado v0.2)* | Busca clientes repetidos con doble `for` anidado + `.includes()`. | `O(n²)` *(peor caso `O(n³)`)* | `O(n)` | Evalúa `n(n-1)/2` pares y recorre linealmente `recurrentes` con `.includes()`. *(Retirada del reporte final).* | `316,84 ms – 340,45 ms` |
| **`clientesRecurrentesSet(ventas)`** *(v1.0)* | Obtiene clientes con `>= 2` compras usando dos `Set` (`vistos`, `recurrentes`). | **`O(n)`** | **`O(n)`** | Un único recorrido `for...of` con búsquedas e inserciones hash `.has()` / `.add()` en `O(1)`. | **`1,241 ms – 1,315 ms`** |
| **`comprasPorCliente(ventas)`** / **`clientesRecurrentesMap`** *(v1.0)* | Cuenta compras por cliente en un `Map` y filtra conteos `>= 2`. | **`O(n)`** | **`O(n)`** | Un recorrido para llenar el `Map` en `O(1)` por venta y otro sobre los clientes únicos (`<= n`). | **`3,190 ms – 3,460 ms`** |
| `comboRegaloBruto(catalogo, valor)` *(referencia)* | Busca dos productos que sumen `valor` con doble ciclo anidado. | `O(m²)` | `O(1)` | Prueba todos los pares `m(m-1)/2` del catálogo de tamaño `m`. | `< 0,05 ms` (`m = 8`) |
| **`comboRegalo(catalogo, valor)`** *(v1.0)* | Busca dos productos que sumen `valor` usando `Map` de complementos. | **`O(m)`** | **`O(m)`** | Una sola pasada consultando `valor - precio` en `O(1)` dentro de un `Map`. | **`< 0,02 ms` (`m = 8`)** |
| **`productoEstrellaPorCiudad(ventas)`** *(v1.0)* | Halla el producto más frecuente de cada ciudad con `Map` anidados. | **`O(n)`** | **`O(c · p)` ≤ `O(n)`** | Cuenta apariciones en una pasada `O(n)` y revisa los pares `(ciudad, producto)` únicos (`<= n`). | **`~1,80 ms`** |
| **`primerClienteUnico(ventas)`** *(v1.0)* | Encuentra en orden el primer cliente con exactamente `1` compra. | **`O(n)`** | **`O(n)`** | Dos recorridos secuenciales (`O(2n) = O(n)`) apoyados en un `Map` de frecuencias. | **`~1,95 ms`** |
| `mejorSemanaBruta(dias, k)` *(referencia)* | Suma cada bloque de `k` días consecutivos desde cero. | `O(d · k)` | `O(1)` | Para cada inicio recorre `k` posiciones internas (`1,91 ms` con `d = 100.000, k = 7`; `6,10 ms` con `k = 90`). | `< 0,05 ms` (`d = 30`) |
| **`mejorSemana(dias, k)`** *(v1.0)* | Halla los `k` días consecutivos de mayor venta con ventana deslizante. | **`O(d)`** | **`O(1)`** | Suma la primera ventana y desliza haciendo `1` suma y `1` resta por día (`0,16 ms` en `100.000` días, `k = 90`). | **`< 0,02 ms` (`d = 30`)** |
| **`parMasCercano(precios, presupuesto)`** *(v1.0)* | Halla los dos productos de mayor suma `<= presupuesto` con dos punteros. | **`O(m log m)`** | **`O(m)`** | Copia y ordena precios en `O(m log m)` y recorre con `izq` y `der` desde los extremos en `O(m)`. | **`< 0,05 ms` (`m = 8`)** |

> **Garantía de producción `v1.0`:** Ninguna función invocada por `src/reporte.js` tiene complejidad cuadrática `O(n²)`.

---

## 2. Comparación de Rendimiento: `v0.1` / Sin Optimizar vs. `v1.0` (`10.000` y `100.000` ventas)

| Escenario evaluado | Secciones incluidas | Tiempo con `n = 10.000` | Tiempo con `n = 100.000` | Cumple SLA (`< 5 s` en `100k`) |
| :--- | :--- | ---: | ---: | :---: |
| **Motor `v0.1` (solo métricas base del Día 1 con cadenas)** | `4` secciones iniciales (`filter` / `map` / `reduce`) | `5,834 ms` | `38,956 ms` | Sí *(pero incompleto: sin recurrentes ni campaña)* |
| **Motor con fuerza bruta (`v0.2` sin optimizar)** | `9` secciones usando `clientesRecurrentes` `O(n²)`, `totalCiudadCadena`, `comboRegaloBruto` y `mejorSemanaBruta` | `323,407 ms` | **`~43.605 ms` (`43,61 s`)** | **NO (excede por `~9×` el tope de `5 s`)** |
| **Motor `v1.0` optimizado (cálculo puro)** | **Las `9` secciones completas** con una pasada, `Set`, `Map`, ventana deslizante y dos punteros | **`14,506 ms`** | **`73,434 ms` (`0,073 s`)** | **SÍ (`~594×` más rápido que sin optimizar)** |
| **Comando completo `node src/reporte.js n` (cálculo + impresión)** | **Las `9` secciones formateadas en consola (COP)** | **`37,982 ms`** | **`106,082 ms` (`0,106 s`)** | **SÍ (`47×` por debajo del límite de `5 s`)** |

---

## 3. Proyección para `1.000.000` de Ventas (`v0.2` vs. `v1.0`)

Multiplicando `n` por `10` desde `100.000` (o por `100` desde `10.000`):

| Componente | En `v0.2` (antes de optimizar) | En `v1.0` (optimizado) |
| :--- | :--- | :--- |
| Métricas generales de una pasada (`totalVendido`, `unidadesVendidas`, `ticketPromedio`, `ventaMayor`, `totalCiudadUnaPasada`) | `~25 ms – 150 ms` (`O(n)`, memoria `O(1)`) | **`~25 ms – 150 ms`** (`O(n)`, memoria `O(1)`) |
| Agrupaciones y ranking (`totalPorCiudad`, `unidadesPorProducto`, `topProductosPorValor`) | `~60 ms – 230 ms` (`O(n)` con catálogo fijo) | **`~60 ms – 230 ms`** |
| **Clientes recurrentes** | **`53` a `73 minutos`** (`clientesRecurrentes` `O(n²)`) | **`~125 ms`** (`clientesRecurrentesSet` `O(n)`) |
| Nuevos análisis comerciales (`productoEstrellaPorCiudad`, `primerClienteUnico`, `comboRegalo`, `parMasCercano`, `mejorSemana`) | No existían en `v0.2` | **`~350 ms` en conjunto** (`O(n)` sobre ventas y `< 1 ms` sobre catálogo/mes) |
| **Tiempo total estimado del reporte completo (`1.000.000` ventas)** | **Más de `1 hora` (inviable)** | **`~0,8 a 1,1 segundos` (viable en producción)** |

---

## 4. Riesgos y Estado de Mitigación en `v1.0`

1. **Riesgo Crítico (MITIGADO en `v1.0`): `clientesRecurrentes` `O(n²)`**
   - *Antes:* Bloqueaba Node.js `43,6 s` en `100.000` ventas y más de una hora en `1.000.000`.
   - *Estado actual:* Reemplazada en `src/reporte.js` por `clientesRecurrentesSet` (`O(n)` tiempo, `12,5 ms` en `100.000` ventas). La función antigua solo permanece en `src/analitica.js` para pruebas comparativas en `verificar.js` y `medir.js`.
2. **Riesgo Medio-Alto (MITIGADO en `src/reporte.js`): Cadenas de métodos con arreglos intermedios (`totalCiudadCadena`, `ticketPromedioM`, `totalVendidoM`)**
   - *Criterio:* Uso de RAM `O(n)` por crear copias intermedias.
   - *Estado actual:* El reporte principal `v1.0` usa exclusivamente las versiones de **una sola pasada con memoria `O(1)`** (`totalVendido`, `unidadesVendidas`, `ticketPromedio`, `ventaMayor`, `contarVentasValidas`).
3. **Riesgo Medio (Vigilancia de memoria lineal `O(n)`): Estructuras `Set` / `Map` de clientes (`clientesRecurrentesSet`, `primerClienteUnico`) y `ventasDelDia`**
   - Guardan una entrada por cliente único (`≈ n / 3`), lo cual es óptimo en un solo proceso para cientos de miles de registros; si en el futuro el historial superara decenas de millones de filas, esa agregación deberá delegarse a índices de base de datos o procesamiento por lotes (*streaming*).
4. **Riesgo Bajo: `topProductosPorValor` (`O(n + p log p)`) y `parMasCercano` (`O(m log m)`)**
   - Ordenan únicamente el catálogo de productos (`p` / `m`), nunca el historial completo de `n` transacciones.

---

## 5. Plan de Optimización: Diagnóstico (`v0.2`) y Solución Aplicada (`v1.0`)

- **Trabajo repetido detectado en `v0.2`:** `clientesRecurrentes` comparaba cada venta `i` contra todas las ventas posteriores `j > i` (`n(n-1)/2` comparaciones) y además recorría linealmente el arreglo de salida con `.includes()` en cada coincidencia.
- **Información guardada para evitar rebuscar:** En `v1.0` se implementó `clientesRecurrentesSet(ventas)` manteniendo en memoria dos conjuntos hash (`vistos` y `recurrentes`) con consulta e inserción en tiempo constante `O(1)`. Así cada venta se lee **una única vez**, bajando el tiempo con `100.000` ventas de **`43.566 ms` a `12,51 ms` (`~3.482×` más rápido)**.
