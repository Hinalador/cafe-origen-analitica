const ventas = require("./datos");
const generarVentas = require("./generador");
const catalogo = require("./catalogo");
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
    topProductosPorValor,
    clientesRecurrentes,
    clientesRecurrentesSet,
    clientesRecurrentesMap,
    comboRegaloBruto,
    comboRegalo,
    productoEstrellaPorCiudad,
    primerClienteUnico
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

console.log("\n--- MiniReto 9: Clientes recurrentes (Original vs Set vs Map) ---");
const origDia1 = [...clientesRecurrentes(ventas)].sort();
const setDia1 = [...clientesRecurrentesSet(ventas)].sort();
const mapDia1 = [...clientesRecurrentesMap(ventas)].sort();

verificarIgualdad("clientesRecurrentes Día 1 (Original vs Set)", origDia1, setDia1);
verificarIgualdad("clientesRecurrentes Día 1 (Original vs Map)", origDia1, mapDia1);

const ventasCincoMil = generarVentas(5000);
const orig5000 = [...clientesRecurrentes(ventasCincoMil)].sort();
const set5000 = [...clientesRecurrentesSet(ventasCincoMil)].sort();
const map5000 = [...clientesRecurrentesMap(ventasCincoMil)].sort();

verificarIgualdad("clientesRecurrentes n=5000 (Original vs Set)", orig5000, set5000);
verificarIgualdad("clientesRecurrentes n=5000 (Original vs Map)", orig5000, map5000);
verificarIgualdad("clientesRecurrentes arreglo vacío []", clientesRecurrentesSet([]), []);

console.log("\n--- MiniReto 10: Combos de regalo y frecuencias ---");
verificarIgualdad("comboRegalo 87.000 (Bruto vs Map)", comboRegaloBruto(catalogo, 87000), comboRegalo(catalogo, 87000));
verificarIgualdad("comboRegalo 61.000 (Bruto vs Map)", comboRegaloBruto(catalogo, 61000), comboRegalo(catalogo, 61000));
verificarIgualdad("comboRegalo 50.000 sin solución", comboRegalo(catalogo, 50000), null);
console.log("Combo sugerido $87.000:", comboRegalo(catalogo, 87000));
console.log("Combo sugerido $61.000:", comboRegalo(catalogo, 61000));
console.log("Producto estrella por ciudad (Día 1):", productoEstrellaPorCiudad(ventas));
verificarIgualdad("primerClienteUnico (Día 1 === C04)", primerClienteUnico(ventas), "C04");
verificarIgualdad("primerClienteUnico arreglo vacío []", primerClienteUnico([]), null);

