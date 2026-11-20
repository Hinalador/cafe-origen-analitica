function valorVenta(venta) {
    return venta.cantidad * venta.precio;
}

function normalizar(texto) {
    return String(texto).trim().toLowerCase();
}

function totalVendido(listaVentas) {
    let total = 0;
    for (const venta of listaVentas) {
        total += valorVenta(venta);
    }
    return total;
}

function totalUnidades(listaVentas) {
    let unidades = 0;
    for (const venta of listaVentas) {
        unidades += venta.cantidad;
    }
    return unidades;
}

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

function ventasDelDia(listaVentas, fechaBuscada) {
    const delDia = [];
    for (const venta of listaVentas) {
        if (venta.fecha === fechaBuscada) {
            delDia.push(venta);
        }
    }
    return delDia;
}

function totalVendidoM(listaVentas) {
    return listaVentas.reduce((acc, venta) => acc + valorVenta(venta), 0);
}

function totalUnidadesM(listaVentas) {
    return listaVentas.reduce((acc, venta) => acc + venta.cantidad, 0);
}

function ventaMayorM(listaVentas) {
    if (listaVentas.length === 0) return null;
    return listaVentas.reduce((mayor, venta) =>
        valorVenta(venta) > valorVenta(mayor) ? venta : mayor
    );
}

function ticketPromedioM(listaVentas) {
    const validas = listaVentas.filter((venta) => venta.cantidad > 0);
    if (validas.length === 0) return 0;
    return totalVendidoM(validas) / validas.length;
}

function ventasPorCiudadM(listaVentas, ciudadBuscada) {
    const objetivo = normalizar(ciudadBuscada);
    return listaVentas
        .filter((venta) => normalizar(venta.ciudad) === objetivo)
        .reduce((acc, venta) => acc + valorVenta(venta), 0);
}

function ventasDelDiaM(listaVentas, fechaBuscada) {
    return listaVentas.filter((venta) => venta.fecha === fechaBuscada);
}

function nombreCiudad(texto) {
    const limpio = String(texto).trim().toLowerCase();
    if (!limpio) return "";
    return limpio.charAt(0).toUpperCase() + limpio.slice(1);
}

function totalPorCiudadM(listaVentas) {
    return listaVentas.reduce((totales, venta) => {
        const ciudad = nombreCiudad(venta.ciudad);
        totales[ciudad] = (totales[ciudad] || 0) + valorVenta(venta);
        return totales;
    }, {});
}

function unidadesPorProducto(listaVentas) {
    return listaVentas.reduce((acc, venta) => {
        acc[venta.producto] = (acc[venta.producto] || 0) + venta.cantidad;
        return acc;
    }, {});
}

function topProductosPorValor(listaVentas, k = 3) {
    const totalesPorProducto = listaVentas.reduce((acc, venta) => {
        acc[venta.producto] = (acc[venta.producto] || 0) + valorVenta(venta);
        return acc;
    }, {});

    return Object.entries(totalesPorProducto)
        .sort((a, b) => b[1] - a[1])
        .slice(0, k);
}

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
    ventasDelDiaM,
    nombreCiudad,
    totalPorCiudadM,
    unidadesPorProducto,
    topProductosPorValor
};