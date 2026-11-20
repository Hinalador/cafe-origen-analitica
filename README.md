# ☕ Café Origen — Analítica de Ventas (`v0.1`)

Sistema de análisis y generación de reportes en **JavaScript (Node.js)** para procesar registros de ventas de **Café Origen**. El proyecto explora la manipulación de arreglos de objetos, limpieza y normalización de datos, cálculo de métricas comerciales (tanto con ciclos imperativos `for...of` como con métodos declarativos `reduce`, `filter`, `sort`, `slice`) y manejo seguro de casos borde.

---

## 📁 Estructura del Proyecto

```text
cafe-origen-analitica/
├── README.md           # Documentación general del proyecto
├── bitacora.md         # Registro de hallazgos, diccionario de datos y errores depurados
└── src/
    ├── datos.js        # Dataset base con los registros de ventas de Café Origen
    ├── analitica.js    # Módulo principal con las funciones de limpieza, métricas y agrupaciones
    ├── explorar.js     # Script de exploración inicial y pruebas rápidas por consola
    ├── verificar.js    # Script de validación entre implementaciones (for...of vs métodos de Array) y casos borde
    └── reporte.js      # Generador del reporte analítico formateado en consola (COP)
```

---

## 📊 Estructura de los Datos (`src/datos.js`)

Cada registro del arreglo `ventas` representa una transacción con las siguientes propiedades:

| Propiedad | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `id` | `number` | Identificador único de la venta | `1` |
| `fecha` | `string` | Fecha en formato `AAAA-MM-DD` | `"2026-09-01"` |
| `cliente` | `string` | Código identificador del cliente | `"C01"` |
| `producto` | `string` | Nombre del café o accesorio | `"Origen Huila 500 g"` |
| `ciudad` | `string` | Ciudad de la venta (puede contener espacios o variación de mayúsculas) | `"Medellín"`, `"medellín "` |
| `cantidad` | `number` | Unidades vendidas (`0` indica registro sin unidades efectivas) | `2` |
| `precio` | `number` | Precio unitario en pesos colombianos (COP) | `42000` |

---

## ⚙️ Funciones del Módulo Analítico (`src/analitica.js`)

El módulo exporta funciones auxiliares, métricas implementadas con ciclos tradicionales (`for...of`) y su contraparte funcional con métodos de arreglos (sufijo `M`):

### 1. Utilidades y Normalización
* **`valorVenta(venta)`**: Calcula el subtotal de una venta (`cantidad * precio`).
* **`normalizar(texto)`**: Limpia espacios laterales (`.trim()`) y convierte a minúsculas (`.toLowerCase()`) para comparaciones insensibles a formato.
* **`nombreCiudad(texto)`**: Estandariza el nombre de una ciudad en formato título (ej. `"  medellín "` $\rightarrow$ `"Medellín"`).

### 2. Métricas con Ciclos (`for...of`) vs. Métodos de Arreglo (`M`)

| Operación | Versión `for...of` | Versión Métodos (`Array`) | Descripción |
| :--- | :--- | :--- | :--- |
| **Total vendido** | `totalVendido(lista)` | `totalVendidoM(lista)` | Suma el valor (`cantidad * precio`) de todas las ventas. |
| **Total unidades** | `totalUnidades(lista)` | `totalUnidadesM(lista)` | Suma el total de unidades vendidas. |
| **Venta mayor** | `ventaMayor(lista)` | `ventaMayorM(lista)` | Retorna el objeto de venta con mayor valor total (`null` si la lista está vacía). |
| **Ticket promedio** | `ticketPromedio(lista)` | `ticketPromedioM(lista)` | Promedio en dinero considerando **solo ventas válidas** (`cantidad > 0`). Retorna `0` si no hay ventas válidas. |
| **Ventas por ciudad** | `ventasPorCiudad(lista, ciudad)` | `ventasPorCiudadM(lista, ciudad)` | Calcula el monto total vendido en una ciudad específica (normalizada). |
| **Ventas del día** | `ventasDelDia(lista, fecha)` | `ventasDelDiaM(lista, fecha)` | Filtra y retorna el arreglo de ventas correspondientes a una fecha `AAAA-MM-DD`. |

### 3. Agrupaciones y Rankings
* **`totalPorCiudadM(listaVentas)`**: Agrupa y suma el valor total vendido por cada ciudad normalizada, retornando un objeto `{ Ciudad: montoTotal }`.
* **`unidadesPorProducto(listaVentas)`**: Calcula cuántas unidades físicas se vendieron de cada producto `{ Producto: totalUnidades }`.
* **`topProductosPorValor(listaVentas, k = 3)`**: Calcula el ingreso generado por cada producto y retorna los `k` productos con mayor facturación ordenados de mayor a menor (`[[producto, monto], ...]`).

---

## 🚀 Cómo Ejecutar el Proyecto

Asegúrate de tener **Node.js** instalado. Desde la carpeta `cafe-origen-analitica` (o indicando la ruta correspondiente), puedes ejecutar cualquiera de los tres scripts:

### 1. Exploración de datos y pruebas de funciones
Muestra la tabla de datos crudos y el resultado individual de cada función analítica:
```bash
node src/explorar.js
```

### 2. Verificación y casos borde
Compara automáticamente que las funciones con `for...of` y las funciones con métodos (`reduce`/`filter`) produzcan exactamente el mismo resultado (`[OK]`), además de probar arreglos vacíos `[]` y de un solo elemento:
```bash
node src/verificar.js
```

### 3. Reporte analítico en consola
Genera el informe ejecutivo **CAFÉ ORIGEN — REPORTE ANALÍTICO v0.1** con formato de moneda colombiana (COP), desglose por ciudad, unidades por producto, Top 3 productos y una simulación de un día sin ventas:
```bash
node src/reporte.js
```

---

## 🛡️ Decisiones Técnicas y Manejo de Casos Borde

1. **Exclusión de registros con `cantidad: 0` en el Ticket Promedio:** La venta `#8` tiene `cantidad: 0`. Si se incluyera en el denominador del promedio, reduciría artificialmente el ticket promedio. Por ello, `ticketPromedio` y `ticketPromedioM` filtran únicamente ventas con `cantidad > 0`.
2. **Prevención de `NaN` en días sin ventas:** Cuando se consulta una fecha sin registros o un arreglo vacío (`[]`), las funciones verifican si el conteo de ventas válidas es `0` antes de dividir, retornando `0` de forma segura.
3. **Limpieza de cadenas en ciudades:** Registros como `"medellín "` y `"Bogotá "` contienen espacios al final o minúsculas iniciales. Con `normalizar()` y `nombreCiudad()` se consolidan bajo una única clave por ciudad.
