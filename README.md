# ☕ Café Origen — Motor de Analítica de Ventas (`v1.0`)

Motor de análisis comercial y evaluación de rendimiento construido en **JavaScript (Node.js)** para **Café Origen**. Procesa historiales reales o simulados de hasta cientos de miles de transacciones en milisegundos, respondiendo preguntas clave de facturación, ciudades, productos, fidelización de clientes y campañas comerciales sin algoritmos cuadráticos (`O(n²)`).

---

## ❓ Preguntas de Negocio que Responde el Producto

1. **Resumen general:** ¿Cuánto se vendió en total, cuántas unidades salieron, cuál es el ticket promedio de compras efectivas (`cantidad > 0`) y cuál fue la venta individual más alta? (`totalVendido`, `unidadesVendidas`, `ticketPromedio`, `ventaMayor`)
2. **Desempeño geográfico:** ¿Cuánto vende cada ciudad del país (unificando nombres con mayúsculas o espacios inconsistentes) y cuánto vendió una ciudad puntual? (`totalPorCiudad`, `totalCiudadUnaPasada`, `ventasPorCiudad`)
3. **Desempeño de catálogo y Top 3:** ¿Cuántas unidades salieron de cada artículo y cuáles son los `k` productos que más dinero generan? (`unidadesPorProducto`, `topProductosPorValor`)
4. **Fidelización en tiempo lineal:** ¿Cuáles clientes son recurrentes (`2` o más compras) en historiales de `100.000`+ ventas? (`clientesRecurrentesSet`, `comprasPorCliente`, `clientesRecurrentesMap`)
5. **Preferencias locales:** ¿Cuál es el producto estrella (más frecuente) en cada ciudad? (`productoEstrellaPorCiudad`)
6. **Campaña de recompra:** ¿Cuál fue el primer cliente de la temporada que compró una sola vez para enviarle un cupón de regreso? (`primerClienteUnico`)
7. **Combos comerciales y corporativos:** ¿Qué par de productos suma exactamente una tarjeta regalo de \$87.000 y qué par aprovecha al máximo un presupuesto corporativo sin pasarse? (`comboRegalo`, `parMasCercano`)
8. **Estacionalidad:** ¿Cuál fue la mejor racha de `7` días consecutivos de ventas del mes? (`mejorSemana`)
9. **Corte diario:** ¿Cómo se comportó un día específico con movimiento o sin ventas? (`ventasDelDia`)

---

## 📁 Estructura del Proyecto

```text
cafe-origen-analitica/
├── README.md           # Documentación del producto, ejecución y arquitectura (v1.0)
├── RENDIMIENTO.md      # Informe técnico Big O (tiempo y espacio), proyecciones y v0.1 vs v1.0
├── bitacora.md         # Registro completo de los 12 MiniRetos, trazas, pruebas y decisiones
└── src/
    ├── datos.js        # Muestra histórica inicial (12 ventas con casos borde reales)
    ├── catalogo.js     # Catálogo oficial de productos y precios para combos y presupuestos
    ├── analitica.js    # Motor de funciones analíticas (ciclos, métodos, Set, Map, punteros y ventana)
    ├── generador.js    # Generador de historiales sintéticos realistas de n ventas
    ├── reporte.js      # Punto de entrada principal: reporte ejecutivo v1.0 (datos reales o n ventas)
    ├── explorar.js     # Exploración inicial del dataset base
    ├── verificar.js    # Suite de verificación automática de equivalencia, orden y casos borde
    └── medir.js        # Conteo de operaciones y benchmarks de tiempo (Big O)
```

---

## 🚀 Cómo Clonar y Ejecutar desde Cero

### Requisitos previos
- **Node.js** (versión LTS recomendada, `v18+` o superior). No requiere dependencias externas (`npm install` no es necesario; usa únicamente módulos nativos de Node.js).

### 1. Clonar el repositorio
```bash
git clone https://github.com/Hinalador/cafe-origen-analitica.git
cd cafe-origen-analitica
```

### 2. Ejecutar el reporte final `v1.0`
- **Con los datos reales de muestra (Día 1 + corte de día con ventas + simulación de día sin ventas):**
  ```bash
  node src/reporte.js
  ```
- **Con `n` ventas generadas dinámicamente (por ejemplo `100.000` ventas en `~0,1 s`):**
  ```bash
  node src/reporte.js 100000
  ```

### 3. Ejecutar la suite de verificación automática
Comprueba con `[OK]` que todas las versiones (ciclos vs. métodos, fuerza bruta vs. `Set`/`Map`, fuerza bruta vs. ventana deslizante) entreguen resultados idénticos, respeta la no mutación de los arreglos originales y valida casos borde (`[]`, `1` elemento, presupuestos sin solución):
```bash
node src/verificar.js
```

### 4. Ejecutar mediciones de operaciones y tiempos (Big O)
Muestra la tabla de operaciones (`100` a `100.000`), la curva cuadrática vs. lineal y la comparación de rendimiento entre versiones:
```bash
node src/medir.js
```

### 5. Exploración inicial de datos crudos
```bash
node src/explorar.js
```

---

## ⚡ Resumen de Optimización (`v0.1` / `v0.2` → `v1.0`)

- **Cero funciones `O(n²)` en producción:** `clientesRecurrentes` pasó de dos ciclos anidados con `.includes()` (`43,57 s` en `100.000` ventas) a `clientesRecurrentesSet` con tablas hash `Set` (`12,51 ms` en `100.000` ventas, **`~3.482×` más rápida**).
- **Cuidado de memoria en servidor (`O(1)` espacial):** El reporte `v1.0` reemplaza cadenas de métodos que duplicaban arreglos intermedios por recorridos de una sola pasada.
- **Estrategias algorítmicas aplicadas:** Conjuntos (`Set`), mapas de frecuencias y de complementos (`Map`), ventana deslizante de tamaño fijo (`O(n)`) y dos punteros sobre copia ordenada (`O(n log n)`).
- **Tiempo total de `node src/reporte.js 100000`:** **`~106 ms`** con todas las 9 secciones impresas en consola (límite exigido: `< 5.000 ms`).
