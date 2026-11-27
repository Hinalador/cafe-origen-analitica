const ventasDia1 = require("./datos");
const generarVentas = require("./generador");
const {
    primeraVentaOp,
    totalVendidoOp,
    ventaMayorOp,
    totalPorCiudadOp,
    clientesRecurrentes,
    totalCiudadCadena,
    totalCiudadUnaPasada,
    clientesRecurrentesSet,
    clientesRecurrentesMap
} = require("./analitica");

// --- MiniReto 5: Conteo de operaciones ---
const tamanos = [100, 1000, 10000, 100000];
const resultados = [];

for (const n of tamanos) {
    const ventasPrueba = generarVentas(n);

    const contadorPrimera = { operaciones: 0 };
    const contadorTotal = { operaciones: 0 };
    const contadorMayor = { operaciones: 0 };
    const contadorCiudad = { operaciones: 0 };

    primeraVentaOp(ventasPrueba, contadorPrimera);
    totalVendidoOp(ventasPrueba, contadorTotal);
    ventaMayorOp(ventasPrueba, contadorMayor);
    totalPorCiudadOp(ventasPrueba, contadorCiudad);

    const fila = {
        n: n,
        primeraVentaOp: contadorPrimera.operaciones,
        totalVendidoOp: contadorTotal.operaciones,
        ventaMayorOp: contadorMayor.operaciones,
        totalPorCiudadOp: contadorCiudad.operaciones
    };

    resultados.push(fila);
}

console.log("=== MiniReto 5: Conteo de operaciones según n ===");
console.table(resultados);

// --- MiniReto 6: Verificación y tiempos de clientesRecurrentes ---
console.log("\n=== MiniReto 6: Clientes recurrentes (12 ventas Día 1) ===");
const recurrentesDia1 = clientesRecurrentes(ventasDia1);
console.log("Clientes recurrentes encontrados:", recurrentesDia1);

console.log("\n=== MiniReto 6: Tiempos de ejecución de clientesRecurrentes ===");
const tamanosTiempo = [1000, 2000, 4000, 8000, 16000];

for (const n of tamanosTiempo) {
    const ventasGeneradas = generarVentas(n);
    const etiqueta = "clientesRecurrentes (n = " + n + ")";

    console.time(etiqueta);
    clientesRecurrentes(ventasGeneradas);
    console.timeEnd(etiqueta);
}

// Prueba adicional ejecutada para n = 100000 (estimación < 2 min -> tardó ~43.6 s):
// const ventasCienMil = generarVentas(100000);
// console.time("clientesRecurrentes (n = 100000)");
// clientesRecurrentes(ventasCienMil);
// console.timeEnd("clientesRecurrentes (n = 100000)");

// --- MiniReto 7: Comparación de cadena de métodos vs una sola pasada ---
console.log("\n=== MiniReto 7: totalCiudadCadena vs totalCiudadUnaPasada (n = 10000) ===");
const ventasDiezMil = generarVentas(10000);

console.time("totalCiudadCadena (n = 10000)");
const resultadoCadena = totalCiudadCadena(ventasDiezMil, "Medellín");
console.timeEnd("totalCiudadCadena (n = 10000)");

console.time("totalCiudadUnaPasada (n = 10000)");
const resultadoUnaPasada = totalCiudadUnaPasada(ventasDiezMil, "Medellín");
console.timeEnd("totalCiudadUnaPasada (n = 10000)");

if (resultadoCadena === resultadoUnaPasada) {
    console.log("[OK] Ambas versiones devuelven exactamente el mismo valor:", resultadoCadena);
} else {
    console.log("[DIFERENTE] Cadena:", resultadoCadena, "| Una pasada:", resultadoUnaPasada);
}

// --- MiniReto 9: Comparación de tiempos Original O(n^2) vs Set O(n) vs Map O(n) ---
console.log("\n=== MiniReto 9: Clientes recurrentes (Original vs Set vs Map) ===");
const tamanosReto9 = [1000, 10000, 100000];

for (const n of tamanosReto9) {
    const muestra = generarVentas(n);
    console.log("\n--- Tamaño n = " + n + " ---");

    if (n <= 10000) {
        console.time("Original O(n^2) [n = " + n + "]");
        clientesRecurrentes(muestra);
        console.timeEnd("Original O(n^2) [n = " + n + "]");
    } else {
        console.log("Original O(n^2) [n = 100000]: omitida en corrida rápida (medida previa: 43.566s)");
    }

    console.time("Versión Set O(n) [n = " + n + "]");
    clientesRecurrentesSet(muestra);
    console.timeEnd("Versión Set O(n) [n = " + n + "]");

    console.time("Versión Map O(n) [n = " + n + "]");
    clientesRecurrentesMap(muestra);
    console.timeEnd("Versión Map O(n) [n = " + n + "]");
}


