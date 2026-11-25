const ventas = require("./datos");
const {
    valorVenta,
    totalVendidoM,
    unidadesVendidasM,
    ventaMayorM,
    ticketPromedioM,
    ventasDelDia,
    totalPorCiudad,
    unidadesPorProducto,
    topProductosPorValor
} = require("./analitica");

function formatoCOP(valor) {
    return "$" + Math.round(valor).toLocaleString("es-CO");
}

function imprimirReporte(titulo, listaVentas) {
    const validas = listaVentas.filter((venta) => venta.cantidad > 0);
    const total = totalVendidoM(listaVentas);
    const unidades = unidadesVendidasM(listaVentas);
    const ticket = ticketPromedioM(listaVentas);
    const mayor = ventaMayorM(listaVentas);

    console.log("========================================");
    console.log(titulo);
    console.log("========================================");

    // 1. Resumen general
    console.log("\n1. Resumen general");
    console.log("- Registros totales: " + listaVentas.length);
    console.log("- Ventas válidas (cantidad > 0): " + validas.length);
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

    console.log("\n----------------------------------------");
    console.log(
        "Resumen corto: " + validas.length + " ventas · total " + formatoCOP(total) + " · ticket " + formatoCOP(ticket)
    );
    console.log("========================================\n");
}

// 1. Reporte general de Café Origen
imprimirReporte("CAFÉ ORIGEN — REPORTE ANALÍTICO v0.1", ventas);

// 2. Resumen de un día con ventas
const diaConVentas = ventasDelDia(ventas, "2026-09-01");
imprimirReporte("REPORTE DEL DÍA CON VENTAS (2026-09-01)", diaConVentas);

// 3. Resumen de un día sin ventas
const diaSinVentas = ventasDelDia(ventas, "2026-09-10");
imprimirReporte("SIMULACIÓN DÍA SIN VENTAS (2026-09-10)", diaSinVentas);