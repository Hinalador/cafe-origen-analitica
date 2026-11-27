const ventasDia1 = require("./datos");
const catalogo = require("./catalogo");
const generarVentas = require("./generador");
const {
    valorVenta,
    totalVendido,
    unidadesVendidas,
    ventaMayor,
    ticketPromedio,
    ventasDelDia,
    totalPorCiudad,
    unidadesPorProducto,
    topProductosPorValor,
    clientesRecurrentesSet,
    productoEstrellaPorCiudad,
    comboRegalo,
    primerClienteUnico,
    ventasDiarias,
    mejorSemana,
    parMasCercano
} = require("./analitica");

function formatoCOP(valor) {
    return "$" + Math.round(valor).toLocaleString("es-CO");
}

function contarVentasValidas(listaVentas) {
    let validas = 0;
    for (const venta of listaVentas) {
        if (venta.cantidad > 0) {
            validas++;
        }
    }
    return validas;
}

function imprimirReporte(titulo, listaVentas, incluirCampanaYRacha) {
    const cantidadValidas = contarVentasValidas(listaVentas);
    const total = totalVendido(listaVentas);
    const unidades = unidadesVendidas(listaVentas);
    const ticket = ticketPromedio(listaVentas);
    const mayor = ventaMayor(listaVentas);

    console.log("========================================");
    console.log(titulo);
    console.log("========================================");

    // 1. Resumen general
    console.log("\n1. Resumen general");
    console.log("- Registros totales: " + listaVentas.length);
    console.log("- Ventas válidas (cantidad > 0): " + cantidadValidas);
    console.log("- Total vendido: " + formatoCOP(total));
    console.log("- Unidades vendidas: " + unidades);
    console.log("- Ticket promedio: " + formatoCOP(ticket));
    if (mayor) {
        console.log(
            "- Venta mayor: #" + mayor.id + " (" + mayor.producto + " · " + mayor.cantidad + " und · " + formatoCOP(valorVenta(mayor)) + ")"
        );
    } else {
        console.log("- Venta mayor: ninguna");
    }

    // 2. Ventas por ciudad
    console.log("\n2. Ventas por ciudad");
    const porCiudad = totalPorCiudad(listaVentas);
    const ciudades = Object.entries(porCiudad);
    if (ciudades.length === 0) {
        console.log("- Sin ventas por ciudad");
    } else {
        for (const par of ciudades) {
            const ciudad = par[0];
            const monto = par[1];
            console.log("- " + ciudad + ": " + formatoCOP(monto));
        }
    }

    // 3. Unidades por producto
    console.log("\n3. Unidades por producto");
    const porProducto = unidadesPorProducto(listaVentas);
    const productos = Object.entries(porProducto);
    if (productos.length === 0) {
        console.log("- Sin unidades vendidas");
    } else {
        for (const par of productos) {
            const producto = par[0];
            const cant = par[1];
            let etiquetaUnidad = "unidades";
            if (cant === 1) {
                etiquetaUnidad = "unidad";
            }
            console.log("- " + producto + ": " + cant + " " + etiquetaUnidad);
        }
    }

    // 4. Top 3 productos por valor
    console.log("\n4. Top 3 productos por valor");
    const top3 = topProductosPorValor(listaVentas, 3);
    if (top3.length === 0) {
        console.log("- Sin productos en ranking");
    } else {
        for (let i = 0; i < top3.length; i++) {
            const producto = top3[i][0];
            const monto = top3[i][1];
            console.log((i + 1) + ". " + producto + ": " + formatoCOP(monto));
        }
    }

    // 5. Clientes recurrentes (optimizado con Set en O(n))
    console.log("\n5. Clientes recurrentes");
    const recurrentes = clientesRecurrentesSet(listaVentas);
    if (recurrentes.length === 0) {
        console.log("- Sin clientes recurrentes");
    } else if (recurrentes.length <= 10) {
        console.log("- Total: " + recurrentes.length + " (" + recurrentes.join(", ") + ")");
    } else {
        const muestraRecurrentes = recurrentes.slice(0, 10).join(", ");
        console.log("- Total: " + recurrentes.length + " clientes recurrentes (primeros 10: " + muestraRecurrentes + ", ...)");
    }

    // 6. Producto estrella por ciudad (conteo de frecuencias con Map en O(n))
    console.log("\n6. Producto estrella por ciudad");
    const estrellas = productoEstrellaPorCiudad(listaVentas);
    const entradasEstrellas = Object.entries(estrellas);
    if (entradasEstrellas.length === 0) {
        console.log("- Sin producto estrella (no hay ventas)");
    } else {
        for (const par of entradasEstrellas) {
            console.log("- " + par[0] + ": " + par[1]);
        }
    }

    // 7. Cliente para cupón de regreso (dos recorridos + Map en O(n))
    console.log("\n7. Cliente sugerido para cupón de regreso (primera compra única)");
    const clienteCupon = primerClienteUnico(listaVentas);
    if (clienteCupon === null) {
        console.log("- Ningún cliente con compra única");
    } else {
        console.log("- Primer cliente con una sola compra: " + clienteCupon);
    }

    if (incluirCampanaYRacha) {
        // 8. Combo de regalo sugerido ($87.000) y presupuesto corporativo ($100.000)
        console.log("\n8. Combos sugeridos del catálogo");
        const sugerenciaRegalo = comboRegalo(catalogo, 87000);
        if (sugerenciaRegalo === null) {
            console.log("- Tarjeta regalo ($87.000): sin combinación exacta");
        } else {
            const p1 = sugerenciaRegalo[0];
            const p2 = sugerenciaRegalo[1];
            console.log(
                "- Tarjeta regalo ($87.000): " + p1.producto + " (" + formatoCOP(p1.precio) + ") + " + p2.producto + " (" + formatoCOP(p2.precio) + ")"
            );
        }

        const sugerenciaCorporativa = parMasCercano(catalogo, 100000);
        if (sugerenciaCorporativa !== null) {
            const c1 = sugerenciaCorporativa[0];
            const c2 = sugerenciaCorporativa[1];
            const sumaCorp = c1.precio + c2.precio;
            console.log(
                "- Presupuesto corporativo (máx. $100.000): " + c1.producto + " + " + c2.producto + " = " + formatoCOP(sumaCorp)
            );
        }

        // 9. Mejor semana del mes (ventana deslizante en O(n))
        console.log("\n9. Mejor semana de ventas (serie diaria de septiembre, k = 7)");
        const racha = mejorSemana(ventasDiarias, 7);
        if (racha === null) {
            console.log("- Datos insuficientes para calcular semana");
        } else {
            const diaFin = racha.diaInicio + 6;
            console.log(
                "- Inicia el día " + racha.diaInicio + " al día " + diaFin + " de septiembre · Total: " + formatoCOP(racha.total * 1000)
            );
        }
    }

    console.log("\n----------------------------------------");
    console.log(
        "Resumen corto: " + cantidadValidas + " ventas · total " + formatoCOP(total) + " · ticket " + formatoCOP(ticket)
    );
    console.log("========================================\n");
}

// Opción por línea de comandos: node src/reporte.js [n]
const argumentoCantidad = process.argv[2];

if (argumentoCantidad !== undefined) {
    const n = Number(argumentoCantidad);

    if (Number.isNaN(n) || n <= 0) {
        console.log("Por favor ingresa un número válido de ventas mayor que 0. Ejemplo: node src/reporte.js 100000");
    } else {
        const ventasGeneradas = generarVentas(n);
        const etiquetaTiempo = "Tiempo total del reporte v1.0 (n = " + n + ")";

        console.time(etiquetaTiempo);
        imprimirReporte("CAFÉ ORIGEN — REPORTE ANALÍTICO v1.0 (" + n + " VENTAS GENERADAS)", ventasGeneradas, true);
        console.timeEnd(etiquetaTiempo);
    }
} else {
    // 1. Reporte general con las 12 ventas reales del Día 1
    imprimirReporte("CAFÉ ORIGEN — REPORTE ANALÍTICO v1.0 (DATOS DÍA 1)", ventasDia1, true);

    // 2. Resumen de un día con ventas
    const diaConVentas = ventasDelDia(ventasDia1, "2026-09-01");
    imprimirReporte("REPORTE DEL DÍA CON VENTAS (2026-09-01)", diaConVentas, false);

    // 3. Resumen de un día sin ventas
    const diaSinVentas = ventasDelDia(ventasDia1, "2026-09-10");
    imprimirReporte("SIMULACIÓN DÍA SIN VENTAS (2026-09-10)", diaSinVentas, false);
}
