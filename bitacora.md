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

## Hallazgos de la exploración y decisiones

* **Venta 8 con `cantidad: 0`:** No se debe contar como venta válida al calcular el ticket promedio para evitar distorsionar el resultado.
* **Ciudades con mayúsculas/minúsculas o espacios extra (`"medellín "` y `"Bogotá "`):** Se deben normalizar los textos (por ejemplo, limpiando espacios con `.trim()` y estandarizando mayúsculas/minúsculas) antes de comparar o agrupar.
* **Clientes repetidos (`C01`, `C02`, `C03`):** Es un comportamiento válido porque un mismo cliente puede realizar múltiples compras en distintos días o productos.

## MiniReto 2: Métricas con ciclos (`for...of`)

### Funciones implementadas en `src/analitica.js`
* **`valorVenta(venta)`**: Calcula el valor total de un registro multiplicando `venta.cantidad * venta.precio`.
* **`normalizar(texto)`**: Convierte el texto a cadena, elimina espacios en blanco a los lados con `.trim()` y pasa a minúsculas con `.toLowerCase()`.
* **`totalVendido(listaVentas)`**: Recorre las ventas con `for...of` y acumula `valorVenta(venta)` (con los datos iniciales da `$985.000`).
* **`totalUnidades(listaVentas)`**: Recorre las ventas con `for...of` y suma `venta.cantidad` (con los datos iniciales da `21` unidades).
* **`ventaMayor(listaVentas)`**: Compara el valor de cada venta con `for...of` y retorna el objeto completo con mayor subtotal (`id: 10`, cliente `C07`, por `$168.000` en los datos iniciales).
* **`ticketPromedio(listaVentas)`**: Acumula el valor y la cantidad de registros únicamente donde `venta.cantidad > 0`, dividiendo al final entre el número de ventas válidas (`89545.45...` en los datos iniciales).
* **`ventasPorCiudad(listaVentas, ciudadBuscada)`**: Filtra y acumula usando `normalizar()` tanto en la ciudad del registro como en la ciudad buscada (`$356.000` para `"Medellín"`).
* **`ventasDelDia(listaVentas, fechaBuscada)`**: Recorre las ventas con `for...of` y devuelve las que coinciden exactamente con la fecha solicitada.

### Casos borde y decisiones
* **Arreglo vacío (`[]`):** `totalVendido([])` y `totalUnidades([])` retornan `0`; `ventaMayor([])` retorna `null` para evitar acceder a índices inexistentes; `ticketPromedio([])` retorna `0` para evitar `0 / 0` (`NaN`).
* **Arreglo de un solo elemento:** Funciona de forma directa retornando el subtotal o registro único sin errores de índice.
* **Venta con `cantidad: 0` (`id: 8`):** Se excluye del conteo de ventas válidas en `ticketPromedio` para no bajar artificialmente el promedio.