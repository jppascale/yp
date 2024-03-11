from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

class YP():
    def __init__(self):
        self.database = 'yp_prueba'
        self.host = 'localhost'
        self.user = 'root'
        self.password = ''

        self.conn = mysql.connector.connect(host = self.host, user = self.user, password = self.password, database = self.database)
        self.cursor = self.conn.cursor(dictionary=True)

        #Se intenta conectar a la DB. Si no existe, se crea.
        try:
            self.cursor.execute(f'USE {self.database}')
            nueva_instancia = False #Se utiliza para insertar los maestros por defecto
        except mysql.connector.error as err:
            #No se pudo conectar
            if err.err_no == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                self.cursor.execute(f'CREATE DATABASE {self.database}')
                self.conn.database = self.database
                nueva_instancia = True
            else:
                raise err
            
        #Creación de tablas
        sql = '''CREATE TABLE IF NOT EXISTS talle (
                idTalle varchar(10) NOT NULL,
                nombre varchar(45) NOT NULL,
                PRIMARY KEY (idTalle)
                );
            '''
        self.cursor.execute(sql)
        self.conn.commit

        sql = '''
            CREATE TABLE IF NOT EXISTS color (
            idColor int(2) NOT NULL,
            nombre varchar(50) NOT NULL,
            codigoHEX varchar(10) DEFAULT NULL,
            PRIMARY KEY (idColor)
            ) COMMENT='Colores de los productos';
        '''
        self.cursor.execute(sql)
        self.conn.commit
        
        sql = '''
            CREATE TABLE IF NOT EXISTS categoria (
            idCategoria int(2) NOT NULL,
            nombre varchar(50) NOT NULL,
            PRIMARY KEY (idCategoria)
            ) COMMENT='Categoría de productos';
            '''
        self.cursor.execute(sql)
        self.conn.commit

        sql = '''
            CREATE TABLE IF NOT EXISTS producto (
            idProducto int(11) NOT NULL AUTO_INCREMENT,
            nombre varchar(50) NOT NULL COMMENT 'Nombre del producto',
            precio decimal(10,2) DEFAULT 0.00 COMMENT 'Precio en moneda local',
            idCategoria int(11) NOT NULL COMMENT 'Categoría del producto',
            descripcion varchar(2000) NOT NULL COMMENT 'Detalle descriptivo del producto',
            imagenPrincipal varchar(100) DEFAULT NULL COMMENT 'Imagen de presentación',
            textoAlt varchar(50) DEFAULT NULL COMMENT 'Texto alternativo a la imagen',
            fechaAlta datetime DEFAULT NULL COMMENT 'Fecha de ingreso del producto',
            PRIMARY KEY (idProducto),
            KEY FK_Producto01 (idCategoria),
            CONSTRAINT FK_Producto01 FOREIGN KEY (idCategoria) REFERENCES categoria (idCategoria)
            ) COMMENT='Artículos comercializados';
            '''
        self.cursor.execute(sql)
        self.conn.commit

        sql = '''
            CREATE TABLE IF NOT EXISTS usuario (
                idUsuario varchar(50) NOT NULL,
                nombre varchar(100) NOT NULL COMMENT 'Nombre completo del usuario',
                clave varchar(20) NOT NULL COMMENT 'Clave de acceso',
                esAdmin tinyint(1) NOT NULL DEFAULT 0,
                fecAlta datetime NOT NULL COMMENT 'Fecha de alta',
                fecUltConexion datetime NOT NULL COMMENT 'Fecha de último login'
            ) COMMENT 'Usuarios registrados en el sitio';
            '''
        self.cursor.execute(sql)
        self.conn.commit

        if nueva_instancia:
            #Datos iniciales
            sql = '''
                INSERT INTO talle VALUES ('S', 'Small');
                INSERT INTO talle VALUES ('M', 'Medium');
                INSERT INTO talle VALUES ('L', 'Large');
                INSERT INTO talle VALUES ('XL', 'X-Large');
                INSERT INTO talle VALUES ('1', '1');
                INSERT INTO talle VALUES ('2', '2');
                INSERT INTO talle VALUES ('3', '3');
                INSERT INTO talle VALUES ('4', '4');

                INSERT INTO color VALUES (1, 'Amarillo', '#f1c40f');
                INSERT INTO color VALUES (2, 'Verde', '#1abc9c');
                INSERT INTO color VALUES (3, 'Azul', '#2980b9');
                INSERT INTO color VALUES (4, 'Rojo', '#c0392b');
                INSERT INTO color VALUES (5, 'Negro', '#2c3e50');
                INSERT INTO color VALUES (6, 'Gris', '#bdc3c7');

                INSERT INTO categoria VALUES (1, 'Camisas');
                INSERT INTO categoria VALUES (2, 'Remeras');
                INSERT INTO categoria VALUES (3, 'Pantalones');
                INSERT INTO categoria VALUES (4, 'Vestidos');
                INSERT INTO categoria VALUES (5, 'Accesorios');
                INSERT INTO categoria VALUES (6, 'Conjuntos');
                '''
            self.cursor.execute(sql)
            self.conn.commit

    def __del__(self):
        self.conn.close()

    def listar_productos(self, idCategoria, idColor, idTalle, texto):
        sql = '''
            SELECT 
                prod.idProducto,
                prod.nombre,
                prod.precio,
                cat.idCategoria,
                cat.nombre as nomCategoria,
                prod.descripcion,
                prod.imagenPrincipal,
                prod.textoAlt
            FROM
                producto prod, categoria cat
            WHERE
                cat.idCategoria = prod.idCategoria 
            '''
        
        if idCategoria:
            sql += f' AND cat.idCategoria = {idCategoria}'
        if texto:
            sql += f' AND UPPER(concat(prod.nombre,cat.nombre,prod.descripcion)) like "%{texto.upper()}%" '
        
        self.cursor.execute(sql)

        return self.cursor.fetchall()
    
    def get_categorias(self):
        sql = 'SELECT idCategoria, nombre FROM categoria;'
        self.cursor.execute(sql)
        return self.cursor.fetchall()
    
    def get_colores(self):
        sql = 'SELECT idColor, nombre, codigoHEX FROM color;'
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def get_talles(self):
        sql = 'SELECT idTalle, nombre FROM talle;'
        self.cursor.execute(sql)
        return self.cursor.fetchall()


app = Flask(__name__)
CORS(app)

@app.route('/productos', methods=['GET'])
def get_productos():
    yp = YP()
    idCategoria = request.args.get('idCategoria')
    idColor = request.args.get('idColor')
    idTalle = request.args.get('idTalle')
    texto = request.args.get('texto')
    return jsonify(yp.listar_productos(idCategoria, idColor, idTalle, texto)), 200

@app.route('/', methods=['GET'])
def prueba():
    return 'API YP'

@app.route('/maestros', methods=['GET'])
def get_maestros():
    yp = YP()
    maestros = {}
    maestros['colores'] = yp.get_colores()
    maestros['categorias'] = yp.get_categorias()
    maestros['talles'] = yp.get_talles()
    return maestros, 200



if __name__=='__main__':
    app.run(debug=True)
