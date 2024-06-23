Algunas cosas que asumimos al momento de hacer la tarea:
    
    Desde el cliente, los usuarios no pueden ver las contraseñas ni el id de otros usuarios. Por lo tanto en la opción de ver informacion de un usuario sólo aparece su nombre, correo y descripción.

    Para que un usuario pueda marcar un correo como favorito debe haberlo mandado o haberlo recibido. Es por esto que el endpoint '/api/marcarcorreo' verifica que el id del usuario coincida con el id del remitente o del destinatario, en caso negativo no agrega el correo a favoritos. Además, en este caso, id_correo_favorito corresponde al id del correo en la tabla Correos.

    Para desmarcar un correo de favoritos verificamos que el usuario tenga ese correo en sus favoritos. Por otro lado, en este caso, id_correo_favorito corresponde al id del correo en la tabla Favoritos.

    Creamos un endpoint '/api/favoritos/:correo' además de los pedidos el cual devuelve un JSON con un arreglo con todos los correos marcados como favoritos por el usuario pasado por parámetro 

Como correr el cliente:

    1.- Asegurarse de que el servidor esté corriendo.
    2.- Abrir una terminal e ir a /client, para luego ejecutar 'py cliente.py'