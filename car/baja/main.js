

var botonEliminar = document.getElementById('baja-emp');
botonEliminar.addEventListener('click',function(){
	var codigo = document.getElementById('codigo-baja').value;
	if(codigo){
		var xhr = new XMLHttpRequest();
		xhr.open('DELETE', 'http://34.136.183.98:2420/eliminarEmpleado', true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({codigo}));
		xhr.onload = function() {
		    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
		    	var response = JSON.parse(xhr.responseText);
		        if (response.status === 'OK') {
		        	alert('Se eliminó correctamente');
		        	location.replace("../");
		        } else {
		        	if(response.msg==='23503'){
			        	$('#bajaModal').modal('show');
			        }
			        else{
			        	alert(`Error al eliminar: ${response.msg}`);
			        }
		        }
		    }
		}

	}
	else{
		alert('No puedes dejar la casilla vacia');
	}
});
var botonAsignarPrestamo = document.getElementById('btn-asignar-prestamos');
botonAsignarPrestamo.addEventListener('click',function(){
	var eliminarEmpl = document.getElementById('menu-baja-empleado');
	eliminarEmpl.style.display = 'none';
	var formularioEliminar = document.getElementById('menu-asignar');
	formularioEliminar.style.display = 'block';

});

var botonAsignar = document.getElementById('boton-asignar');
botonAsignar.addEventListener('click',function(){
	var codigoOrigen= document.getElementById('codigo-origen').value;
	var codigoDestino = document.getElementById('codigo-destino').value;

	if(codigoOrigen && codigoDestino){
		var xhr = new XMLHttpRequest();
		xhr.open('PUT', 'http://34.136.183.98:2420/asignarEmpleado', true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({codigoOrigen,codigoDestino}));
		xhr.onload = function() {
		    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
		    	var response = JSON.parse(xhr.responseText);
		        if (response.status === 'OK') {
		        	alert('Se asignó correctamente');
		        	location.replace("../");
		        } else {		        	
			        alert(`Error al Asignar: ${response.msg}`);				        			        
		        }
		    }
		}
	
	}
	else{
		alert('No puedes dejar la casilla vacia');

	}

});




