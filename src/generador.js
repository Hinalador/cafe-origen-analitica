const productos = [
    {
        nombre: "Origen Huila 500g",
        precio: 42000
    },
    {
        nombre: "Origen Nariño 250g",
        precio: 26000
    },
    {
        nombre: "Origen Sierra 500g",
        precio: 45000
    },
    {
        nombre: "Prensa francesa",
        precio: 95000
    },
    {
        nombre: "Molino manual",
        precio: 120000
    }
];

const ciudades = ["Medellín", "Bogotá", "Cali", "Pereira"];

function azar(min, max) {
    const cantidadOpciones = max - min + 1
    const salto = Math.floor(Math.random() * cantidadOpciones)
    return salto + min
}

function generarVentas(n) {
    const ventas = []
    const totalClientes = Math.max(1, Math.floor(n / 3))
    for (let i = 1; i <= n; i++) {
        const indiceProductos = azar(0, productos.length - 1);
        const productoElegido = productos[indiceProductos];

        const indiceCiudad = azar(0, ciudades.length - 1);
        const ciudadElegida = ciudades[indiceCiudad]

        const cantidad = azar(1, 5);
        const numeroCliente = azar(1, totalClientes);
        const cliente = "C" + numeroCliente;
        const dia = azar(1, 30);
        let fecha = "";
        if (dia < 10) {

            fecha = ("2026-09-0" + dia);

        } else {

            fecha = ("2026-09-" + dia);

        }

        const venta = { id: i, fecha: fecha, cliente: cliente, producto: productoElegido.nombre, ciudad: ciudadElegida, cantidad: cantidad, precio: productoElegido.precio }

        ventas.push(venta)
    }
    return (ventas)
}

console.table(generarVentas(10))

module.exports = generarVentas;