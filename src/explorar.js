const ventas = require("./datos");
const {
    valorVenta,
    normalizar,
    totalVendido,
    totalUnidades,
    ventaMayor,
    ticketPromedio,
    ventasPorCiudad,
    ventasDelDia,
    totalVendidoM,
    totalUnidadesM,
    ventaMayorM,
    ticketPromedioM,
    ventasPorCiudadM,
    ventasDelDiaM,
    nombreCiudad,
    totalPorCiudadM
} = require("./analitica");

console.log("Registros", ventas.length);
console.log("Primero:", ventas[0]);
console.log("Ultimo:", ventas[ventas.length - 1]);
console.log("Producto en la posición 4:", ventas[4].producto);
console.table(ventas);
console.log("Ciudades:", ventas.map(v => `[${v.ciudad}]`).join(" "));

console.log(valorVenta(ventas[2]));
console.log(normalizar("   BOGOTÁ    "));
console.log(totalVendido(ventas));
console.log(totalUnidades(ventas));
console.log(ventaMayor(ventas));
console.log(ticketPromedio(ventas));
console.log(ventasPorCiudad(ventas, "medellín"));
console.log(ventasDelDia(ventas, "2026-09-01"));

console.log(totalVendidoM(ventas));
console.log(totalUnidadesM(ventas));
console.log(ventaMayorM(ventas));
console.log(ticketPromedioM(ventas));
console.log(ventasPorCiudadM(ventas, "bogotá"));
console.log(ventasDelDiaM(ventas, "2026-09-01").length);
console.log(nombreCiudad("bogotá"));
console.log(totalPorCiudadM(ventas));