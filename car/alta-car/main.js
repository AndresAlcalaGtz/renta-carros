
import { Carro } from './Carro.js';

var botonAltaCarro = document.getElementById('agregar-carro');

botonAltaCarro.addEventListener('click',function(){

	var placas = document.getElementById('placas-car').value;
	var marca = document.getElementById('marca-car').value;
	var modelo = document.getElementById('modelo-car').value;
	var color = document.getElementById('color-car').value;
	var tipo = document.getElementById('tipo-car').value;

	var imagen =document.getElementById('imagen-car');
	var existencia = document.getElementById('existencia-car').value;
	var formData = new FormData();


	
	if(placas && marca && modelo && color && tipo && imagen.files.length && existencia){

		formData.append('placas', placas);
		formData.append('marca',marca);
		formData.append('modelo',modelo);
		formData.append('color',color);
		formData.append('tipo',tipo);
		formData.append('imagen',imagen.files[0]);
		formData.append('existencia',existencia);
		var xhr = new XMLHttpRequest();
		xhr.open('POST','http://34.136.183.98:2420/agregarCarro',true);
		xhr.send(formData);
		
		xhr.onreadystatechange = function(){
			if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200){
				if(xhr.responseText === 'OK'){
					location.replace("../");
					alert('Se agregó corectamente');
				}
				else{
					alert(`Error al agregar: ${xhr.responseText}`)
				}
			}
		}

	}
	else{
		alert('Las casillas no pueden estar vacías');
	}
});

