const generarVentas = require("./generador");
const {
    primeraVentaOp,
    totalVendidoOp,
    ventaMayorOp,
    totalPorCiudadOp
} = require("./analitica");

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

console.log("=== Conteo de operaciones según el tamaño de los datos (n) ===");
console.table(resultados);
