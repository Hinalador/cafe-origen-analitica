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

function totalCiudadCadena(ventas, ciudad) {
    const objetivo = normalizar(ciudad);

    return ventas
        .map(function (venta) {
            return {
                ciudadNormalizada: normalizar(venta.ciudad),
                cantidad: venta.cantidad,
                precio: venta.precio
            };
        })
        .filter(function (venta) {
            return venta.ciudadNormalizada === objetivo;
        })
        .map(function (venta) {
            return valorVenta(venta);
        })
        .reduce(function (acumulado, subtotal) {
            return acumulado + subtotal;
        }, 0);
}

function totalCiudadUnaPasada(ventas, ciudad) {
    const objetivo = normalizar(ciudad);
    let total = 0;

    for (const venta of ventas) {
        if (normalizar(venta.ciudad) === objetivo) {
            total += valorVenta(venta);
        }
    }

    return total;
}

function clientesRecurrentesSet(ventas) {
    const vistos = new Set();
    const recurrentes = new Set();

    for (const venta of ventas) {
        const cliente = venta.cliente;

        if (vistos.has(cliente)) {
            recurrentes.add(cliente);
        } else {
            vistos.add(cliente);
        }
    }

    return [...recurrentes];
}

function comprasPorCliente(ventas) {
    const conteo = new Map();

    for (const venta of ventas) {
        const cliente = venta.cliente;

        if (conteo.has(cliente)) {
            const actual = conteo.get(cliente);
            conteo.set(cliente, actual + 1);
        } else {
            conteo.set(cliente, 1);
        }
    }

    return conteo;
}

function clientesRecurrentesMap(ventas) {
    const conteo = comprasPorCliente(ventas);
    const recurrentes = [];

    for (const par of conteo) {
        const cliente = par[0];
        const cantidadCompras = par[1];

        if (cantidadCompras >= 2) {
            recurrentes.push(cliente);
        }
    }

    return recurrentes;
}

function comboRegaloBruto(catalogo, valor) {
    for (let i = 0; i < catalogo.length; i++) {
        for (let j = i + 1; j < catalogo.length; j++) {
            if (catalogo[i].precio + catalogo[j].precio === valor) {
                return [catalogo[i], catalogo[j]];
            }
        }
    }
    return null;
}

function comboRegalo(catalogo, valor) {
    const vistosPorPrecio = new Map();

    for (const item of catalogo) {
        const complemento = valor - item.precio;

        if (vistosPorPrecio.has(complemento)) {
            const productoAnterior = vistosPorPrecio.get(complemento);
            return [productoAnterior, item];
        }

        vistosPorPrecio.set(item.precio, item);
    }

    return null;
}

function productoEstrellaPorCiudad(ventas) {
    const frecuenciasPorCiudad = new Map();

    for (const venta of ventas) {
        const ciudad = nombreCiudad(venta.ciudad);
        const producto = venta.producto;

        if (!frecuenciasPorCiudad.has(ciudad)) {
            frecuenciasPorCiudad.set(ciudad, new Map());
        }

        const mapaProductos = frecuenciasPorCiudad.get(ciudad);

        if (mapaProductos.has(producto)) {
            const conteoActual = mapaProductos.get(producto);
            mapaProductos.set(producto, conteoActual + 1);
        } else {
            mapaProductos.set(producto, 1);
        }
    }

    const estrellas = {};

    for (const parCiudad of frecuenciasPorCiudad) {
        const ciudad = parCiudad[0];
        const mapaProductos = parCiudad[1];

        let mejorProducto = null;
        let maxApariciones = 0;

        for (const parProducto of mapaProductos) {
            const producto = parProducto[0];
            const apariciones = parProducto[1];

            if (apariciones > maxApariciones) {
                maxApariciones = apariciones;
                mejorProducto = producto;
            }
        }

        estrellas[ciudad] = mejorProducto;
    }

    return estrellas;
}

function primerClienteUnico(ventas) {
    const conteo = new Map();

    for (const venta of ventas) {
        const cliente = venta.cliente;

        if (conteo.has(cliente)) {
            const actual = conteo.get(cliente);
            conteo.set(cliente, actual + 1);
        } else {
            conteo.set(cliente, 1);
        }
    }

    for (const venta of ventas) {
        if (conteo.get(venta.cliente) === 1) {
            return venta.cliente;
        }
    }

    return null;
}

const ventasDiarias = [
    320, 410, 280, 390, 510, 620, 700, 300, 290, 450,
    480, 530, 610, 680, 350, 330, 420, 470, 560, 640,
    710, 380, 360, 440, 500, 590, 650, 720, 400, 370
];

function mejorSemanaBruta(dias, k) {
    if (k <= 0 || dias.length < k) {
        return null;
    }

    let mayorTotal = 0;
    let mejorIndice = 0;

    for (let inicio = 0; inicio <= dias.length - k; inicio++) {
        let sumaBloque = 0;

        for (let j = inicio; j < inicio + k; j++) {
            sumaBloque += dias[j];
        }

        if (inicio === 0 || sumaBloque > mayorTotal) {
            mayorTotal = sumaBloque;
            mejorIndice = inicio;
        }
    }

    return {
        diaInicio: mejorIndice + 1,
        total: mayorTotal
    };
}

function mejorSemana(dias, k) {
    if (k <= 0 || dias.length < k) {
        return null;
    }

    let sumaVentana = 0;
    for (let i = 0; i < k; i++) {
        sumaVentana += dias[i];
    }

    let mayorTotal = sumaVentana;
    let mejorIndice = 0;

    for (let i = k; i < dias.length; i++) {
        const diaQueEntra = dias[i];
        const diaQueSale = dias[i - k];
        sumaVentana = sumaVentana + diaQueEntra - diaQueSale;

        const indiceActual = i - k + 1;
        if (sumaVentana > mayorTotal) {
            mayorTotal = sumaVentana;
            mejorIndice = indiceActual;
        }
    }

    return {
        diaInicio: mejorIndice + 1,
        total: mayorTotal
    };
}

function parMasCercano(precios, presupuesto) {
    if (precios.length < 2) {
        return null;
    }

    const ordenados = [...precios].sort(function (a, b) {
        return a.precio - b.precio;
    });

    let izq = 0;
    let der = ordenados.length - 1;
    let mejorSuma = 0;
    let mejorPar = null;

    while (izq < der) {
        const sumaActual = ordenados[izq].precio + ordenados[der].precio;

        if (sumaActual > presupuesto) {
            der--;
        } else {
            if (mejorPar === null || sumaActual > mejorSuma) {
                mejorSuma = sumaActual;
                mejorPar = [ordenados[izq], ordenados[der]];
            }
            izq++;
        }
    }

    return mejorPar;
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
    clientesRecurrentes,
    totalCiudadCadena,
    totalCiudadUnaPasada,
    clientesRecurrentesSet,
    comprasPorCliente,
    clientesRecurrentesMap,
    comboRegaloBruto,
    comboRegalo,
    productoEstrellaPorCiudad,
    primerClienteUnico,
    ventasDiarias,
    mejorSemanaBruta,
    mejorSemana,
    parMasCercano
};