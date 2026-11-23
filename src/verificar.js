const ventas = require("./datos");
const {
    totalVendido,
    totalVendidoM,
    totalUnidades,
    totalUnidadesM,
    ventaMayor,
    ventaMayorM,
    ticketPromedio,
    ticketPromedioM,
    ventasPorCiudad,
    ventasPorCiudadM,
    ventasDelDia,
    ventasDelDiaM,
    totalPorCiudadM,
    unidadesPorProducto,
    topProductosPorValor
} = require("./analitica");

function verificarIgualdad(nombre, esperado, obtenido) {
    const textoEsperado = JSON.stringify(esperado);
    const textoObtenido = JSON.stringify(obtenido);

    if (textoEsperado === textoObtenido) {
        console.log("[OK]", nombre);
    } else {
        console.log("[FALLO]", nombre);
        console.log("  Esperado:", esperado);
        console.log("  Obtenido:", obtenido);
    }
}

verificarIgualdad("totalVendido", totalVendido(ventas), totalVendidoM(ventas));
verificarIgualdad("totalUnidades", totalUnidades(ventas), totalUnidadesM(ventas));
verificarIgualdad("ventaMayor", ventaMayor(ventas), ventaMayorM(ventas));
verificarIgualdad("ticketPromedio", ticketPromedio(ventas), ticketPromedioM(ventas));
verificarIgualdad(
    "ventasPorCiudad (Medellín)",
    ventasPorCiudad(ventas, "Medellín"),
    ventasPorCiudadM(ventas, "Medellín")
);
verificarIgualdad(
    "ventasDelDia (2026-09-01)",
    ventasDelDia(ventas, "2026-09-01"),
    ventasDelDiaM(ventas, "2026-09-01")
);

console.log("\n--- Agrupaciones y ranking ---");
console.log("Total por ciudad:", totalPorCiudadM(ventas));
console.log("Unidades por producto:", unidadesPorProducto(ventas));
console.log("Top 3 productos por valor:", topProductosPorValor(ventas, 3));

console.log("\n--- Casos borde ---");
console.log("Arreglo vacío -> totalVendidoM:", totalVendidoM([]));
console.log("Arreglo vacío -> ventaMayorM:", ventaMayorM([]));
console.log("Arreglo vacío -> ticketPromedioM:", ticketPromedioM([]));
console.log("Un elemento -> ticketPromedioM:", ticketPromedioM([ventas[0]]));