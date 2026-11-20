const ventas = require("./datos");

function valorVenta(venta) {
    return venta.cantidad * venta.precio;
}

console.log(valorVenta(ventas[2]));

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

console.log(ventasDelDia(ventas, "2026-09-01"));

function totalVendidoM(listaVentas) {
    return listaVentas.reduce((acc, venta) => acc + valorVenta(venta), 0);
}

console.log(totalVendidoM(ventas));

function totalUnidadesM(listaVentas) {
    return listaVentas.reduce((acc, venta) => acc + venta.cantidad, 0);
}

console.log(totalUnidadesM(ventas));

function ventaMayorM(listaVentas) {
    if (listaVentas.length === 0) return null;
    return listaVentas.reduce((mayor, venta) =>
        valorVenta(venta) > valorVenta(mayor) ? venta : mayor
    );
}

console.log(ventaMayorM(ventas))

function ticketPromedioM(listaVentas) {
    const validas = listaVentas.filter((venta) => venta.cantidad > 0);
    if (validas.length === 0) return 0;
    return totalVendidoM(validas) / validas.length;
}

console.log(ticketPromedioM(ventas))

function ventasPorCiudadM(listaVentas, ciudadBuscada) {
    const objetivo = normalizar(ciudadBuscada);
    return listaVentas
        .filter((venta) => normalizar(venta.ciudad) === objetivo)
        .reduce((acc, venta) => acc + valorVenta(venta), 0);
}

console.log(ventasPorCiudadM(ventas, "bogotá"))

function ventasDelDiaM(listaVentas, fechaBuscada) {
    return listaVentas.filter((venta) => venta.fecha === fechaBuscada);
}

console.log(ventasDelDiaM(ventas, "2026-09-01").length)

function nombreCiudad(texto) {
    const limpio = String(texto).trim().toLowerCases();
    if (!limpio) return "";
    return limpio.charAt(0).toUpperCase() + limpio.slice(1);
}

console.log(nombreCiudad("bogotá"))

function totalPorCiudadM(listaVentas) {
    return listaVentas.reduce((totales, venta) => {
        const ciudad = nombreCiudad(venta.ciudad);
        totales[ciudad] = (totales[ciudad] || 0) + valorVenta(venta);
        return totales;
    }, {});
}

console.log(totalPorCiudadM(ventas));



console.table(ventas)

module.exports = {
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
    ventasDelDiaM
};