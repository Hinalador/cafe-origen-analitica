const ventas = require("./datos");

function valorVenta(venta) {
    return venta.cantidad * venta.precio;
}

console.log(valorVenta(ventas[0]));

function normalizar(texto) {
    return String(texto).trim().toLowerCase();
}

console.log(normalizar("   BOGOTÁ    "));

function totalVendido(listaVentas) {
    let total = 0;
    for (const venta of listaVentas) {
        total += valorVenta(venta);
    }
    return total;
}

console.log(totalVendido(ventas))

function totalUnidades(listaVentas) {
    let unidades = 0;
    for (const venta of listaVentas) {
        unidades += venta.cantidad;
    }
    return unidades;
}

console.log(totalUnidades(ventas));

function ventaMayor(listaVentas) {
    if (listaVentas.length === 0) {
        return null;
    }

    let mayor = listaVentas[0];
    for (const venta of listaVentas) {
        if (valorVenta(venta) > valorVenta(mayor)) {
            mayor = venta;
        }
    }
    return mayor;
}

console.log(ventaMayor(ventas));

function ticketPromedio(listaVentas) {
    let sumaValidas = 0;
    let conteoValidas = 0;

    for (const venta of listaVentas) {
        if (venta.cantidad > 0) {
            sumaValidas += valorVenta(venta);
            conteoValidas++;
        }
    }

    if (conteoValidas === 0) {
        return 0;
    }

    return sumaValidas / conteoValidas;
}

console.log(ticketPromedio(ventas));

function ventasPorCiudad(listaVentas, ciudadBuscada) {
    const objetivo = normalizar(ciudadBuscada);
    let totalCiudad = 0;

    for (const venta of listaVentas) {
        if (normalizar(venta.ciudad) === objetivo) {
            totalCiudad += valorVenta(venta);
        }
    }

    return totalCiudad;
}

console.log(ventasPorCiudad(ventas, "medellín"));

function ventasDelDia(listaVentas, fechaBuscada) {
    const delDia = [];
    for (const venta of listaVentas) {
        if (venta.fecha === fechaBuscada) {
            delDia.push(venta);
        }
    }
    return delDia;
}

console.log(ventasDelDia(ventas, "2026-10-01"));

module.exports = {
    valorVenta,
    normalizar,
    totalVendido,
    totalUnidades,
    ventaMayor,
    ticketPromedio,
    ventasPorCiudad,
    ventasDelDia
};