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
    for (let i = 1; i <= n;) {
    }
}