const ventas = require("./datos");
const {
    totalVendido,
    totalVendidoM,
    unidadesVendidas,
    unidadesVendidasM,
    ventaMayor,
    ventaMayorM,
    ticketPromedio,
    ticketPromedioM,
    ventasPorCiudad,
    ventasPorCiudadM,
    ventasDelDia,
    ventasDelDiaM,
    totalPorCiudad,
    unidadesPorProducto,
    topProductosPorValor
} = require("./analitica");

function verificarIgualdad(nombre, esperado, obtenido) {
    const textoEsperado = JSON.stringify(esperado);
    const textoObtenido = JSON.stringify(obtenido);

    if (textoEsperado === textoObtenido) {
        console.log("[OK]", nombre);
    } else {
        console.log("[DIFERENTE]", nombre);
        console.log("  Esperado:", esperado);
        console.log("  Obtenido:", obtenido);
    }
}

verificarIgualdad("totalVendido", totalVendido(ventas), totalVendidoM(ventas));
verificarIgualdad("unidadesVendidas", unidadesVendidas(ventas), unidadesVendidasM(ventas));
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
console.log("Total por ciudad:", totalPorCiudad(ventas));
console.log("Unidades por producto:", unidadesPorProducto(ventas));
console.log("Top 3 productos por valor:", topProductosPorValor(ventas, 3));

console.log("\n--- Verificación de no mutación ---");
console.log("Cantidad original de ventas:", ventas.length, "| Primer id sigue siendo:", ventas[0].id);

console.log("\n--- Casos borde ---");
console.log("Arreglo vacío -> totalVendido:", totalVendido([]));
console.log("Arreglo vacío -> unidadesVendidas:", unidadesVendidas([]));
console.log("Arreglo vacío -> ventaMayor:", ventaMayor([]));
console.log("Arreglo vacío -> ticketPromedio:", ticketPromedio([]));
console.log("Un elemento -> ticketPromedio:", ticketPromedio([ventas[0]]));