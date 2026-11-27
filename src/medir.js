const ventasDia1 = require("./datos");
const catalogo = require("./catalogo");
const generarVentas = require("./generador");
const {
    primeraVentaOp,
    totalVendidoOp,
    ventaMayorOp,
    totalPorCiudadOp,
    totalVendido,
    totalVendidoM,
    unidadesVendidas,
    unidadesVendidasM,
    ventaMayor,
    ventaMayorM,
    ticketPromedio,
    ticketPromedioM,
    totalPorCiudad,
    unidadesPorProducto,
    topProductosPorValor,
    clientesRecurrentes,
    totalCiudadCadena,
    totalCiudadUnaPasada,
    clientesRecurrentesSet,
    clientesRecurrentesMap,
    productoEstrellaPorCiudad,
    primerClienteUnico,
    comboRegalo,
    parMasCercano,
    ventasDiarias,
    mejorSemanaBruta,
    mejorSemana
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

// --- MiniReto 11: Fuerza bruta vs Ventana deslizante (100.000 días al azar) ---
console.log("\n=== MiniReto 11: mejorSemanaBruta vs mejorSemana (100.000 días) ===");
const diasAzar = [];
for (let i = 0; i < 100000; i++) {
    const ventaDelDia = Math.floor(Math.random() * 800) + 200;
    diasAzar.push(ventaDelDia);
}

console.time("mejorSemanaBruta (n = 100000, k = 7)");
const rachaBruta7 = mejorSemanaBruta(diasAzar, 7);
console.timeEnd("mejorSemanaBruta (n = 100000, k = 7)");

console.time("mejorSemana ventana (n = 100000, k = 7)");
const rachaVentana7 = mejorSemana(diasAzar, 7);
console.timeEnd("mejorSemana ventana (n = 100000, k = 7)");

if (rachaBruta7.diaInicio === rachaVentana7.diaInicio && rachaBruta7.total === rachaVentana7.total) {
    console.log("[OK] Coinciden en 100.000 días (k=7):", rachaVentana7);
} else {
    console.log("[DIFERENTE]", rachaBruta7, rachaVentana7);
}

console.time("mejorSemanaBruta (n = 100000, k = 90)");
const rachaBruta90 = mejorSemanaBruta(diasAzar, 90);
console.timeEnd("mejorSemanaBruta (n = 100000, k = 90)");

console.time("mejorSemana ventana (n = 100000, k = 90)");
const rachaVentana90 = mejorSemana(diasAzar, 90);
console.timeEnd("mejorSemana ventana (n = 100000, k = 90)");

if (rachaBruta90.diaInicio === rachaVentana90.diaInicio && rachaBruta90.total === rachaVentana90.total) {
    console.log("[OK] Coinciden en 100.000 días (k=90):", rachaVentana90);
} else {
    console.log("[DIFERENTE]", rachaBruta90, rachaVentana90);
}

// --- MiniReto 12: Comparación de tiempo total v0.1 vs v1.0 (10.000 y 100.000 ventas) ---
function ejecutarMotorV01(lista) {
    const validas = lista.filter(function (venta) {
        return venta.cantidad > 0;
    });
    totalVendidoM(lista);
    unidadesVendidasM(lista);
    ticketPromedioM(lista);
    ventaMayorM(lista);
    totalPorCiudad(lista);
    unidadesPorProducto(lista);
    topProductosPorValor(lista, 3);
    return validas.length;
}

function ejecutarMotorV10(lista) {
    let validas = 0;
    for (const venta of lista) {
        if (venta.cantidad > 0) {
            validas++;
        }
    }
    totalVendido(lista);
    unidadesVendidas(lista);
    ticketPromedio(lista);
    ventaMayor(lista);
    totalCiudadUnaPasada(lista, "Medellín");
    totalPorCiudad(lista);
    unidadesPorProducto(lista);
    topProductosPorValor(lista, 3);
    clientesRecurrentesSet(lista);
    productoEstrellaPorCiudad(lista);
    primerClienteUnico(lista);
    comboRegalo(catalogo, 87000);
    parMasCercano(catalogo, 100000);
    mejorSemana(ventasDiarias, 7);
    return validas;
}

console.log("\n=== MiniReto 12: Tiempo total del motor v0.1 vs v1.0 ===");
for (const n of [10000, 100000]) {
    const muestra = generarVentas(n);

    console.time("Motor v0.1 base [n = " + n + "]");
    ejecutarMotorV01(muestra);
    console.timeEnd("Motor v0.1 base [n = " + n + "]");

    console.time("Motor v1.0 completo (9 secciones) [n = " + n + "]");
    ejecutarMotorV10(muestra);
    console.timeEnd("Motor v1.0 completo (9 secciones) [n = " + n + "]");
}




