import {Login} from './Login.js'

localStorage.setItem('nombre-empleado', '');
localStorage.setItem('tipo-empleado', '');
localStorage.setItem('codigo-empleado', '');

var botonInicio = document.getElementById('boton-inicio');
botonInicio.addEventListener('click',function(){
	var codigo = document.getElementById('codigo-empleado').value;
	var password = document.getElementById('password-empleado').value;

	var xhr = new XMLHttpRequest();
	xhr.open('POST','http://34.136.183.98:2420/login',true);
	xhr.setRequestHeader('Content-Type','application/json');
	
	xhr.onreadystatechange = function(){
		if(xhr.readyState == XMLHttpRequest.DONE && xhr.status==200){
			var response = JSON.parse(xhr.responseText);
			if(response.status === 'OK'){
				localStorage.setItem('nombre-empleado', response.name);
				localStorage.setItem('tipo-empleado',response.tipo);
				localStorage.setItem('codigo-empleado',response.codigo);
				localStorage.setItem('apellido-empleado',response.apellido);
				location.replace("./car");
			}else{
				alert('Código o contraseña incorrecto.');
			}

		}
	
	}
	xhr.send(JSON.stringify(new Login(codigo,password)));
});