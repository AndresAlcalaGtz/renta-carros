import{Cliente} from './Cliente.js'
import{Prestamo} from './Prestamo.js'


if (localStorage.getItem('nombre-empleado') === '') {
	location.replace("/RENTALOSMARQUESITOS");
}

document.getElementById('nombre-empleado').innerText = localStorage.getItem('nombre-empleado');
document.getElementById('apellido-empleado').innerText = localStorage.getItem('apellido-empleado')

var tipo = localStorage.getItem('tipo-empleado');
document.getElementById('tipo-empleado').innerText = tipo;

var codigo = localStorage.getItem('codigo-empleado');
document.getElementById('codigo-empleado').innerText = codigo;

var apCodigoPres = localStorage.getItem('codigo-empleado');
document.getElementById('ap-codigo-pres').innerText = apCodigoPres;
 

if (tipo.toLowerCase() === 'empleado'){
	document.getElementById('btn-empleado').style.display = 'none';
	document.getElementById('btn-alta-carro').style.display = 'none';
}



function ocultarBloqueActual(){
	var divs = document.querySelectorAll('div[id^=menu]');

	for (let div of divs) { 
		if (div.style.display === 'block'){
			div.style.display = 'none'; 
			break;
		}
 	}
}


var botonMenuEmpleado = document.getElementById('btn-empleado');
botonMenuEmpleado.addEventListener('click',function(){
	var formulario = document.getElementById('menu-empleado');
	ocultarBloqueActual();
	formulario.style.display = 'block';

});

var botonMenuAlta = document.getElementById('btn-renta');
botonMenuAlta.addEventListener('click',function(){
	var formAlta = document.getElementById('menu-registrado');
	ocultarBloqueActual();
	formAlta.style.display = 'block'; 
});

var botonMenuPrestamo = document.getElementById('btn-prestamo');
botonMenuPrestamo.addEventListener('click',function(){
	var formPres = document.getElementById('menu-alta-prestamo');
	ocultarBloqueActual();
	formPres.style.display = 'block';
});

var botonMenuAltaCliente = document.getElementById('btn-alta-cliente');
botonMenuAltaCliente.addEventListener('click',function(){
	var formCliente = document.getElementById('menu-alta-cliente');
	ocultarBloqueActual();
	formCliente.style.display = 'block';
});


var botonSalir =document.getElementById('salir');
botonSalir.addEventListener('click',function(){
	location.replace("/RENTALOSMARQUESITOS");
});



var buscarCliente = document.getElementById('buscar-curp');
buscarCliente.addEventListener('click',function(){
	var curp = document.getElementById('curp-cliente').value;
	var xhr = new XMLHttpRequest();
	xhr.open('POST','http://34.136.183.98:2420/buscar',true);
	xhr.setRequestHeader('Content-Type','application/json');
	xhr.send(JSON.stringify({curp}));
	xhr.onreadystatechange = function(){
	if(curp){
		if(xhr.readyState == XMLHttpRequest.DONE && xhr.status==200){
		var response = JSON.parse(xhr.responseText);
			if(response.status=='OK'){
				$('#prestamoModal').modal('show');
			}
			else{
				$('#exampleModal').modal('show');
				document.getElementById('alta-curp-cliente').innerText = curp;
			}
			document.getElementById('ap-curp').innerText = curp;
		}
	}
	else{
		alert('Las casillas no pueden estar vacías');
	}
	}

});

var altaPrestamo = document.getElementById('agregar-prestamo');
altaPrestamo.addEventListener('click',function(){
	var curpCli= document.getElementById('ap-curp').innerText;
	var placas = document.getElementById('ap-placas').value;
	var codigoPrestamista = document.getElementById("ap-codigo-pres").innerText;
	var fechaPrestamo = document.getElementById("ap-fecha-prestamo").innerText;
	var fechaDevolucion = document.getElementById("ap-fecha-devolucion").innerText;

	if(placas){	
		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://34.136.183.98:2420/prestamo', true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify(new Prestamo(fechaPrestamo, fechaDevolucion,curpCli, codigoPrestamista, placas)));
		xhr.onreadystatechange= function() {
		    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
		    	var response = JSON.parse(xhr.responseText);
		        if (response.status === 'OK') {
		        	alert('Se agrego correctamente');
		        	location.replace(".");
		        } else {
		        	alert('El carro está en renta en estos momnetos');

		        }
		    }
		}
	}
	 else {
		alert('Las casillas no pueden estar vacías');
	}

});





var altaCliente = document.getElementById('boton-agregar-cliente');
altaCliente.addEventListener('click',function(){
	var nombre = document.getElementById('nombre-cliente').value;
	var apellido = document.getElementById('apellido-cliente').value;
	var curp = document.getElementById('alta-curp-cliente').innerText;
	var edad = document.getElementById('edad-cliente').value;
	var direccion = document.getElementById('dire-cliente').value;

	var xhr = new XMLHttpRequest();
	xhr.open('POST','http://34.136.183.98:2420/altaClien',true);
	xhr.setRequestHeader('Content-Type','application/json');
	xhr.send(JSON.stringify(new Cliente(nombre,apellido,curp,edad,direccion)));
	xhr.onreadystatechange = function(){
		if(nombre && apellido && curp && edad && direccion){
			if(xhr.readyState== XMLHttpRequest.DONE && xhr.status==200){
				if(xhr.responseText==='OK'){
					var menuAlta = document.getElementById('menu-alta-cliente');
					menuAlta.style.display = 'none';
					var altaPrestamoCliente = document.getElementById('menu-alta-prestamo');
					altaPrestamoCliente.style.display  = 'block';
				}
				else{
					alert(`Error al agregar: ${xhr.responseText}`);
				}
			}

		}
		else{
			alert('Las casillas no pueden estar vacías');
		}
	}

});

var listarCarro = document.getElementById('btn-carro-registrado');
listarCarro.addEventListener('click',function(){
	var xhr = new XMLHttpRequest();
	xhr.open('GET','http://34.136.183.98:2420/lista_carros',true);
	xhr.setRequestHeader('Accept','application/json');
	xhr.send();

	xhr.onload = function(){
		if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200){
			var response = JSON.parse(xhr.responseText);
			var divRow,divCol,divCard,img,divCardText,h5,p;

			if(response.status === 'OK'){
				var lista = document.getElementById('menu-lista-carro');
				while(lista.firstChild){
					lista.removeChild(lista.firstChild);
				}
				for(let i = 0; i < response.cars.length; i++){
					if(i%3 == 0){
						divRow = document.createElement('div');
		        		divRow.setAttribute('class', 'row');
		        		lista.appendChild(divRow);
					}
					divCol = document.createElement('div');
	        		divCol.setAttribute('class','col col-md');
	        		
	        		divCard = document.createElement('div');
	        		divCard.setAttribute('class','card');
	        		divCard.setAttribute('style',"width: 14rem;");

	        		img = document.createElement('img');
					img.src = 'data:image/jpeg;base64,'+ response.cars[i].imagen;


	        		divCardText = document.createElement('div');
					divCardText.setAttribute('class', 'card-body');
	        	
	        		h5 = document.createElement('h5');
	        		h5.setAttribute('class', 'card-title');
	        		h5.innerText = response.cars[i].marca;

	        		p = document.createElement('p');
	        		p.setAttribute('class', 'card-text');
	        		p.innerText = `Modelo: ${response.cars[i].modelo}\nColor: ${response.cars[i].color}\nTipo: ${response.cars[i].tipo}\nPlacas: ${response.cars[i].placas}`;

	        
					divCardText.appendChild(h5);
	        		divCardText.appendChild(p);
	        		divCard.appendChild(img);
	        		divCard.appendChild(divCardText);
	        		divCol.appendChild(divCard);
	        		divRow.appendChild(divCol); 


				}

			}
			else{
					alert(`Error al agregar: ${xhr.responseText}`);
				}
		}
		var formularioAgregar = document.getElementById('menu-lista-carro');
		ocultarBloqueActual();
		formularioAgregar.style.display = 'block';

	}


});

var botonMenuDevolver = document.getElementById('btton-devolver');
botonMenuDevolver.addEventListener('click',function(){
	var formularioEliminar = document.getElementById('menu-devolver');
	ocultarBloqueActual();
	formularioEliminar.style.display = 'block';
});



var botonDevolver = document.getElementById('boton-devolver');
botonDevolver.addEventListener('click',function(){
	var curp = document.getElementById('dp-curp').value;
	var placas = document.getElementById('dp-placas').value;
	if(codigo && placas){
		var xhr = new XMLHttpRequest();
		xhr.open('DELETE', 'http://34.136.183.98:2420/devolver', true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({curp, placas}));
		xhr.onload = function() {
		    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
		    	var response = JSON.parse(xhr.responseText);
		        if (response.status === 'OK') {
		        	alert('Carro devuelto ');
		        	if(response.taxes > 0){
		        		alert('Se produjo un cargo por exceder la fecha de devolución');
		        		solicitarPDF(curp);
		        	}

		        } else {
		        	alert(`Error al agregar: ${response.msg}`);
		        }
		    }
		}

	}
	else{
		alert('No puedes dejar casillas vacias');
	}

});

function guardarArchivo(texto, nombre, tipo) {
	var a = document.createElement('a');
	var archivo = new Blob([texto], {type: tipo});
	a.href = URL.createObjectURL(archivo);
	a.download = nombre;
	a.click();
}

function solicitarPDF(curp){
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'http://34.136.183.98:2420/impuesto', true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('Accept', '*/*');
	xhr.send(JSON.stringify({'curp': curp}));

	xhr.onload = function() {
	    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
	    	guardarArchivo(xhr.responseText, 'impuesto.pdf', 'text/plain');
	    }
	}
}

