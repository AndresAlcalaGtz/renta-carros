from flask import Flask, request, send_file
from flask_cors import CORS
import psycopg2
from reportlab.pdfgen import canvas       #Librerias para poder crear PDF
from reportlab.lib.pagesizes import letter  #Librerias para poder crear PDF
from datetime import datetime
from datetime import date
import os
import json
import base64
UPLOAD_FOLDER = '/root/images'


app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
cors = CORS(app)


conexion = psycopg2.connect(
    host="34.136.183.98",
    dbname="rentalosmarquesitos",
    user="postgres",
    password="12345",
    port="5432"
)
conexion.autocommit = True
cur = conexion.cursor()

@app.route('/login', methods = ['POST']) 
def authenticate():
	json_data = request.get_json()
	codigo = json_data['codigo']
	password = json_data['password']
	# Validacion de empleado con base de datos
	cur.execute("SELECT password, nombre, tipo, codigo, apellido FROM empleado WHERE codigo='%s'" % codigo)
	user = cur.fetchone()

	datos = {
		'status' : 'ERROR'
	}

	if user != None:
		if user[0] == password:
			datos = {
				'status' : 'OK',
				'name' : user[1],
				'tipo' : user[2],
				'codigo' : user[3],
				'apellido':user[4]
			}
	json_response = json.dumps(datos)
	
	return json_response

@app.route('/buscar', methods = ['POST'])
def search():
	json_data = request.get_json()
	curp = json_data['curp']
	cur.execute("SELECT curp FROM clientes WHERE curp = '%s'" % curp)
	user = cur.fetchone()

	datos = {

			'status' : 'ERROR'
		}
	if user != None:	
		 user[0] == curp
		 datos = {
				'status' : 'OK',
				'curp' : user[0]
			}
		
	json_response = json.dumps(datos)
	return json_response


@app.route('/agregarEmpleado', methods = ['POST'])
def add_empleado():
	try:
		json_data = request.get_json()
		nombre = json_data['nombre']
		apellido = json_data['apellido']
		codigo = json_data['codigo']
		password = json_data['password']
		tipo = json_data['tipo']
		cur.execute("INSERT INTO empleado(nombre, apellido, codigo, password, tipo) VALUES ('%s', '%s','%s','%s', '%s')" % (nombre, apellido, codigo, password,tipo))
		return 'OK'
	except Exception as e:
		return str(e)

@app.route('/altaClien',methods = ['POST'])
def add_cliente():
	try:
		json_data = request.get_json()
		nombre = json_data['nombre']
		apellido = json_data['apellido']
		curp = json_data['curp'] 
		edad = json_data['edad']
		direccion = json_data['direccion']
		cur.execute("INSERT INTO clientes(nombre, apellido, curp, edad, direccion)VALUES ('%s', '%s','%s','%s', '%s')" % (nombre, apellido, curp,edad,direccion))
		return 'OK'
	except Exception as e:
		return str(e)

@app.route('/prestamo',methods = ['POST'])
def add_prestamo():
	try:

		#para obtener id del carro a rentar
		json_data = request.get_json()
		curp = json_data['curpCliente']
		codigo_prestamista = json_data['codigoPrestamista']
		placas = json_data['placas']
		fecha_devolucion = json_data['fechaDevolucion']
		fecha_prestamo = json_data['fechaPrestamo']

		cur.execute("SELECT id, existencia FROM carros WHERE placas  = '%s'" % placas)
		user = cur.fetchone()
		if user != None:
			id_carro = user[0]
			existencia = user[1]
			print(id_carro)
		else:
			datos = {
				'status' : 'ERROR',
				'msg' : 'El carro que desea rentar no existe'

			}
			json_response = json.dumps(datos)
			return json_response
		
		#para obtener id del cliente
		cur.execute("SELECT id FROM clientes WHERE curp = '%s'" % curp)
		user = cur.fetchone()
		if user != None:
			id_cliente = user[0]
		else:
			datos = {
				'status' : 'ERROR',
				'msg' : 'El asociado no está registrado'
			}
		
			json_response = json.dumps(datos)
			return json_response

		#Obtener id del prestamista
		cur.execute("SELECT id FROM empleado WHERE codigo = '%s'" % codigo_prestamista)
		user = cur.fetchone()
		if user!= None:
			id_prestamista = user[0]
		else:
			datos = {
				'status' : 'ERROR',
				'msg' : 'El empleado no existe'
			}
			json_response = json.dumps(datos)
			return json_response

		if existencia == 0:
			datos = {
				'status' : 'ERROR',
				'msg' : 'Este carro no está disponible'
			}
			json_response = json.dumps(datos)
			return json_response

		cur.execute("INSERT INTO prestamos(fechaprestamo, fechadevolucion, idcliente, idprestamista, idcarro)  VALUES (to_date('%s', 'dd/mm/yyyy'), to_date('%s', 'dd/mm/yyyy'), %s, %s, %s)" % (fecha_prestamo, fecha_devolucion, id_cliente, id_prestamista, id_carro))
		cur.execute("UPDATE carros SET existencia=%s WHERE id = %s" % (existencia-1, id_carro))
		
		datos = {
			'status' : 'OK'
		}
		json_response = json.dumps(datos)
		return json_response

	except Exception as error:
		datos = {
				'status' : 'ERROR',
				'msg' : str(error)
		}
		json_response = json.dumps(datos)
		return json_response



@app.route('/eliminarEmpleado', methods = ['DELETE'])
def delete_user():

	try:
		json_data = request.get_json()
		codigo = json_data['codigo']
		cur.execute("SELECT id FROM empleado WHERE codigo='%s'" % codigo)
		user = cur.fetchone()
		if user != None:
			cur.execute("DELETE FROM empleado WHERE id= %s" % user[0])
			datos = {
				'status' : 'OK'
			}
			json_response = json.dumps(datos)
			return json_response
		else:
			datos = {
				'status' : 'ERROR',
				'msg' : 'El empleado no existe'
			}
			json_response = json.dumps(datos)
			return json_response
	except psycopg2.errors.ForeignKeyViolation as fkv:
		datos = {
			'status' : 'ERROR',
			'msg' : '23503'
		}
		json_response = json.dumps(datos)
		return json_response
	except Exception as error:
		datos = {
			'status' : 'ERROR',
			'msg' : str(error)
		}
		json_response = json.dumps(datos)
		return json_response


@app.route('/asignarEmpleado',methods = ['PUT'])
def assign():
	try:
		json_data = request.get_json()
		codigoOrigen = json_data['codigoOrigen']
		codigoDestino= json_data['codigoDestino']

		cur.execute("SELECT id FROM empleado WHERE codigo='%s'" % codigoOrigen)
		user = cur.fetchone()
		if user != None:
			id_empleado_origen = user[0]
		else:
			datos = {
				'status' : 'ERROR',
				'msg' : 'El empleado no existe'
			}
			json_response = json.dumps(datos)
			return json_response

		cur.execute("SELECT id FROM empleado WHERE codigo='%s'" % codigoDestino)
		user = cur.fetchone()

		if user != None:	
			id_empleado_destino = user[0]
		else:
			datos = {
				'status' : 'ERROR',
				'msg' : 'El empleado no existe'
			}
			json_response = json.dumps(datos)
			return json_response

		cur.execute("UPDATE prestamos SET idprestamista ='%s' WHERE idprestamista = %s" % (id_empleado_destino, id_empleado_origen))
		datos = {
			'status' : 'OK',
		}
		json_response = json.dumps(datos)
		return json_response

	except Exception as error:
		datos = {
			'status' : 'ERROR',
			'msg' : str(error)
		}
		json_response = json.dumps(datos)
		return json_response


@app.route('/agregarCarro', methods=['POST'])
def add_car():
	try:

		data = request.files['imagen']
		placas = request.form['placas']
		modelo = request.form['modelo']
		color = request.form['color']
		tipo = request.form['tipo']
		marca = request.form['marca']
		existencia = request.form['existencia']
		file_path = os.path.join(app.config['UPLOAD_FOLDER'],data.filename)
		data.save(file_path)

		cur.execute("INSERT INTO carros(placas, marca, modelo, color, clase_vehiculo,imagen,existencia) VALUES ('%s', '%s','%s','%s', '%s', '%s','%s')" % (placas, marca, modelo,color, tipo,file_path,existencia))
		return 'OK'
	except Exception as e:
		return str(e)


@app.route('/lista_carros', methods = ['GET'])
def list_car():
	cur.execute("SELECT modelo,color,clase_vehiculo,marca,placas,imagen FROM carros")
	cars = cur.fetchall()
	list_car=[]

	for car in cars:
		with open(car[5], "rb") as img_file:
	   		imagen = base64.b64encode(img_file.read())

		datos = {
			'modelo': car[0],
			'color':car[1],
			'tipo':car[2],
			'marca':car[3],
			'placas':car[4],
			'imagen': imagen.decode('utf-8')
			}

		list_car.append(datos)

	json_response = json.dumps({'status' : 'OK', 'cars': list_car}, default=str)
	return json_response




@app.route('/devolver', methods = ['DELETE'])
def return_car():
	try:
		json_data = request.get_json()
		curp = json_data['curp']
		placas = json_data['placas']


		#codigo del asociado sacar el id
		cur.execute("SELECT id FROM clientes WHERE curp='%s'" % curp)
		user = cur.fetchone()

		if user != None:	
			id_cliente = user[0]
		else:
			datos = {
				'status' : 'ERROR',
				'msg' : 'El cliente no existe'
			}
			json_response = json.dumps(datos)
			return json_response


		#sacar el id del las placas
		cur.execute("SELECT id, existencia, marca FROM carros WHERE placas='%s'" % placas)
		user = cur.fetchone()

		if user != None:	
			id_carro = user[0]
			existencia = user[1]
			marca = user[2]
		else:
			datos = {
				'status' : 'ERROR',
				'msg' : 'El carro no existe'
			}
			json_response = json.dumps(datos)
			return json_response

		#codigo para sacr fecha prestamo
		cur.execute("SELECT fechadevolucion, id FROM prestamos WHERE  (idcliente = '%s' and idcarro = '%s')" %(id_cliente,id_carro))
		user = cur.fetchone()
		if user != None:	
			fecha_devolucionn = user[0]
			id_prestamo = user[1]
		else:
			datos = {
				'status' : 'ERROR',
				'msg' : 'No se encontró el registro'
			}
			json_response = json.dumps(datos)
			return json_response

		
		cur.execute("DELETE FROM prestamos WHERE (idcliente = '%s' and idcarro= '%s'and id = '%s')" %(id_cliente,id_carro,id_prestamo))
		cur.execute("UPDATE CARROS SET existencia ='%s' WHERE id = %s" % (existencia+1, id_carro))
		impuesto=0
		now=date.today()
		if fecha_devolucionn < now:

			cont=(now-fecha_devolucionn)
			impuesto= cont*(150)
			filename = "impuesto_%s_%s.pdf" %(curp,now)
			c = canvas.Canvas(filename)
			#ancho linea
			c.setLineWidth(.3)
			#fuente y tamaño
			c.setFont('Helvetica',14)
			#dibuja texto en pos i e y por puntos, 1pt = 1/72 pulgadas
			c.drawString(120,800,"RENTA DE CARRO ""LOS MARQUESITOS"" ")
			c.drawString(120,780,"Importe por retraso ")
			c.drawString(120,760,"MARCA:  '%s' PLACAS: (%s)"%(marca,placas))
			c.line(0, 740, 120 + 500, 740)
			c.drawImage("carro.png",10,745,width=65, height=65)
			c.drawString(5,710, "Curp                  \t Importe          \t Dias retraso         \t Fecha           \t  Fecha Actual")
			c.drawString(5,670, "%s          $ %s            %s día(s)        %s          %s       " %(curp,impuesto.days,cont.days, fecha_devolucionn,now))
			c.line(0, 700, 120 + 500, 700)
			c.save()
			impuesto = impuesto.days
		datos = {
			'status' : 'OK',
			'taxes': impuesto
		}
		json_response = json.dumps(datos)

		return json_response

	except Exception as error:
		datos = {
			'status' : 'ERROR',
			'msg' : str(error)
		}
		json_response = json.dumps(datos)
		return json_response


@app.route('/impuesto', methods = ['POST'])
def regresar_impuesto():
	json_data = request.get_json()
	curp = json_data['curp']
	now=date.today()
	filename = "impuesto_%s_%s.pdf" %(curp,now)
	return send_file(filename, as_attachment=True)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=2420, debug=True)
