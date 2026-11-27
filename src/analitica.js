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

function unidadesVendidas(listaVentas) {
    let unidades = 0;
    for (const venta of listaVentas) {
        unidades += venta.cantidad;
    }
    return unidades;
}

function totalUnidades(listaVentas) {
    return unidadesVendidas(listaVentas);
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
    return listaVentas
        .map((venta) => valorVenta(venta))
        .reduce((acc, subtotal) => acc + subtotal, 0);
}

function unidadesVendidasM(listaVentas) {
    return listaVentas.reduce((acc, venta) => acc + venta.cantidad, 0);
}

function totalUnidadesM(listaVentas) {
    return unidadesVendidasM(listaVentas);
}

function ventaMayorM(listaVentas) {
    if (listaVentas.length === 0) {
        return null;
    }

    return listaVentas.reduce((mayor, venta) => {
        if (valorVenta(venta) > valorVenta(mayor)) {
            return venta;
        } else {
            return mayor;
        }
    });
}

function ticketPromedioM(listaVentas) {
    const validas = listaVentas.filter((venta) => venta.cantidad > 0);
    if (validas.length === 0) {
        return 0;
    }
    return totalVendidoM(validas) / validas.length;
}

function ventasPorCiudadM(listaVentas, ciudadBuscada) {
    const objetivo = normalizar(ciudadBuscada);
    return listaVentas
        .filter((venta) => normalizar(venta.ciudad) === objetivo)
        .map((venta) => valorVenta(venta))
        .reduce((acc, subtotal) => acc + subtotal, 0);
}

function ventasDelDiaM(listaVentas, fechaBuscada) {
    return listaVentas.filter((venta) => venta.fecha === fechaBuscada);
}

function nombreCiudad(texto) {
    const limpio = String(texto).trim().toLowerCase();
    if (!limpio) {
        return "";
    }
    return limpio.charAt(0).toUpperCase() + limpio.slice(1);
}

function totalPorCiudad(listaVentas) {
    return listaVentas.reduce((totales, venta) => {
        const ciudad = nombreCiudad(venta.ciudad);
        if (!totales[ciudad]) {
            totales[ciudad] = 0;
        }
        totales[ciudad] += valorVenta(venta);
        return totales;
    }, {});
}

function totalPorCiudadM(listaVentas) {
    return totalPorCiudad(listaVentas);
}

function unidadesPorProducto(listaVentas) {
    return listaVentas.reduce((acc, venta) => {
        if (!acc[venta.producto]) {
            acc[venta.producto] = 0;
        }
        acc[venta.producto] += venta.cantidad;
        return acc;
    }, {});
}

function topProductosPorValor(listaVentas, k = 3) {
    const totalesPorProducto = listaVentas.reduce((acc, venta) => {
        if (!acc[venta.producto]) {
            acc[venta.producto] = 0;
        }
        acc[venta.producto] += valorVenta(venta);
        return acc;
    }, {});

    const pares = Object.entries(totalesPorProducto);
    const copiaPares = [...pares];

    return copiaPares
        .sort((a, b) => b[1] - a[1])
        .slice(0, k);
}

function totalVendidoOp(listaVentas, contador) {
    let total = 0;
    for (const venta of listaVentas) {
        contador.operaciones++;
        total += valorVenta(venta);
    }
    return total;
}

function ventaMayorOp(listaVentas, contador) {
    if (listaVentas.length === 0) {
        return null;
    }

    let mayor = listaVentas[0]
    for (const venta of listaVentas) {
        contador.operaciones++

        if (valorVenta(venta) > valorVenta(mayor)) {
            mayor = venta
        }
    }
    return mayor;
}

function totalPorCiudadOp(listaVentas, contador) {
    const totales = {};
    for (const venta of listaVentas) {
        contador.operaciones++;
        const ciudad = nombreCiudad(venta.ciudad)

        if (totales[ciudad] === undefined) {
            totales[ciudad] = 0;
        }

        totales[ciudad] += valorVenta(venta)
    }
    return (totales)
}

function primeraVentaOp(listaVentas, contador) {
    contador.operaciones++
    if (listaVentas.length === 0) {
        return (null)
    }
    return (listaVentas[0])
}

function clientesRecurrentes(ventas) {
    const recurrentes = [];
    for (let i = 0; i < ventas.length; i++) {
        for (let j = i + 1; j < ventas.length; j++) {
            if (ventas[i].cliente === ventas[j].cliente &&
                !recurrentes.includes(ventas[i].cliente)) {
                recurrentes.push(ventas[i].cliente);
            }
        }
    }
    return recurrentes;
}

module.exports = {
    valorVenta,
    normalizar,
    totalVendido,
    unidadesVendidas,
    totalUnidades,
    ventaMayor,
    ticketPromedio,
    ventasPorCiudad,
    ventasDelDia,
    totalVendidoM,
    unidadesVendidasM,
    totalUnidadesM,
    ventaMayorM,
    ticketPromedioM,
    ventasPorCiudadM,
    ventasDelDiaM,
    nombreCiudad,
    totalPorCiudad,
    totalPorCiudadM,
    unidadesPorProducto,
    totalVendidoOp,
    topProductosPorValor,
    ventaMayorOp,
    totalPorCiudadOp,
    primeraVentaOp,
    clientesRecurrentes
};