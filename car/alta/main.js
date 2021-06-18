import{Empleado} from './Empleado.js'

var botonAltaEmpleado = document.getElementById('alta-emp');
botonAltaEmpleado.addEventListener('click',function(){

	var nombre = document.getElementById('nombre-emp').value;
	var apellido = document.getElementById('apellido-emp').value;
	var codigo = document.getElementById('codigo-emp').value;
	var password = document.getElementById('password-emp').value;
	var tipo = document.getElementById('tipo-emp').value;
	if(nombre && apellido && codigo&&password && tipo){
		var xhr = new XMLHttpRequest();
		xhr.open('POST','http://34.136.183.98:2420/agregarEmpleado',true);
		xhr.setRequestHeader('Content-Type','application/json');
		xhr.send(JSON.stringify(new Empleado(nombre, apellido, codigo, password, tipo)));
		xhr.onreadystatechange = function(){
			if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200){
				if(xhr.responseText === 'OK'){
					location.replace("../");
					alert('Se agregó correctamente');

				}
				else{
		        	alert(`Error al agregar: ${xhr.responseText}`);
				}
			}
		}

	}
	else{
		alert('Las casillas no pueden estar vacías');
	}

});

