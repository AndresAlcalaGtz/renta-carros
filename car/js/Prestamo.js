class Prestamo {
	constructor(fechaPrestamo, fechaDevolucion,curpCliente, codigoPrestamista, placas) {
		this.fechaPrestamo = fechaPrestamo;
		this.fechaDevolucion = fechaDevolucion;
		this.curpCliente = curpCliente;
		this.codigoPrestamista = codigoPrestamista;
		this.placas = placas;
	}
}

export { Prestamo};