import requests
import os, sys, time

'''
 Resumen: Printea un logo para el cliente
 Inputs: Ninguno
 Devuelve: Nada
'''
def mostrar_logo():
    print("  ####    #####   ##   ##  ##   ##  ##   ##  ##   ##  ##   ##   ####             ###  ##  #######  ##   ##")
    print(" ##  ##  ##   ##  ### ###  ### ###  ##   ##  ###  ##  ###  ##    ##               ##  ##   ##   #  ###  ##")
    print("##       ##   ##  #######  #######  ##   ##  #### ##  #### ##    ##               ## ##    ## #    #### ##")
    print("##       ##   ##  #######  #######  ##   ##  ## ####  ## ####    ##     ######    ####     ####    ## ####")
    print("##       ##   ##  ## # ##  ## # ##  ##   ##  ##  ###  ##  ###    ##               ## ##    ## #    ##  ###")
    print(" ##  ##  ##   ##  ##   ##  ##   ##  ##   ##  ##   ##  ##   ##    ##               ##  ##   ##   #  ##   ##")
    print("  ####    #####   ##   ##  ##   ##   #####   ##   ##  ##   ##   ####             ###  ##  #######  ##   ##\n\n")

'''
 Resumen: Realiza una consulta a la api para verificar que el usuario pasado por parámetro exista en la bd y coincida su clave con la clave pasada por parámetro
 Inputs: String usuario, String clave
 Devuelve: Boolean: True si el inicio de sesión fue exitoso (existe el usuario y clave es igual a la clave del usuario en la bd), False en caso contrario
'''
def iniciar_sesion(usuario, clave):
    url = 'http://localhost:3000/api/informacion/'+usuario

    respuesta = requests.get(url).json() # Obtiene de inmediato un diccionario en la var respuesta con el JSON que devuelve el servidor

    if respuesta["estado"] == 200:
        if respuesta["usuario"]["clave"] == clave:
            print("Inicio de sesión exitoso :D\n")
            return True
        else:
            print("Revisa que tu contraseña sea la correcta -.-\n")
            return False
    else:
        print("Este correo no existe >:c\n")
        return False

'''
 Resumen: Interactúa con la api dependiendo del parámtro operacion.
 Inputs: String operacion, String usuario, String clave
 Devuelve: Nada, sólo hace prints
'''
def consumir_api(operacion, usuario, clave):
    url = 'http://localhost:3000/api/'+operacion
    
    if operacion == "informacion":
        usuario = input("\nIngrese el correo del usuario: ")
        url = url+"/"+usuario
        respuesta = requests.get(url).json()

        if respuesta["estado"] == 200:
            print("\nInformación de " + usuario)
            for key in respuesta["usuario"]: # respuesta["usuario"] es un diccionario con la informacion del usuario en el formato {"id": id, "correo": correo, "clave": clave, "descripcion": descripcion}
                if key != "id" and key != "clave": # Se decidió no mostrar ni el ID ni la Clave de un usuario a otros que consulten por la información de este
                    print(key+" -> "+str(respuesta["usuario"][key]))
        else:
            print("\nAlgo salió mal :C (no se encontró el correo)")

    elif operacion == "favoritos":
        url = url + "/" + usuario
        respuesta = requests.get(url).json() # Es de la forma {"estado": estado, "mensaje": mensaje, "arreglo_correos": arreglo con los correos favoritos del usuario}

        if respuesta["estado"] == 200:
            print("\nTienes", len(respuesta["arreglo_correos"]), "correos marcados como favoritos") # respuesta["arreglo_correos"] es de la forma {"id": id, "asunto": asunto, "cuerpo": cuerpo, "fecha": fecha, "remitente": correo del remitente, "destinatario": correo del destinatario}
            if len(respuesta["arreglo_correos"]) > 0: # Desplegará la info sólo si tiene correos favoritos
                print("Tus correos marcados son:")
                for correo in respuesta["arreglo_correos"]:
                    print("\nDe: " + correo["remitente"] + "  Para: " + correo["destinatario"])
                    print("Asunto: " + correo["asunto"])
                    print("Cuerpo: " + correo["cuerpo"])
                    print("ID:", correo["id"])
                    print("Fecha: " + correo["fecha"][:10])
        else:
            print("Algo salió mal :(")
            

    elif operacion == "marcarcorreo":
        id_correo_favorito = int(input("\nIngrese el ID del correo: "))
        data = {"correo": usuario, "clave": clave, "id_correo_favorito": int(id_correo_favorito)}
        respuesta = requests.post(url, json=data).json()

        if respuesta["estado"] == 200:
            print("Agregaste el correo",id_correo_favorito,"a tus favoritos ;)")
        else:
            if respuesta["mensaje"] == "El correo a marcar como favorito no existe":
                print("El correo que estás intentando agregar no está dentro de los correos que hayas enviado o que te hayan llegado :/")
            else:
                print("Ocurrió un error con tu solicitud. Fíjate si el correo que estás intentando agregar se encuentra actualmente en tu lista ;)")


print("\n-------- BIENVENIDO AL SISTEMA DE CORREOS COMMUNIKEN --------\n\n")
mostrar_logo()
print("Por favor, inicie sesión\n")
intentos = 1
puedo_pasar = False
while not puedo_pasar and intentos<=3:
    correo = input("Correo: ")
    clave = input("Contraseña: ")
    puedo_pasar = iniciar_sesion(correo, clave)
    intentos+=1

if intentos > 3 and not puedo_pasar:
    print("3 intentos fallidos, cerrando el programa")
    sys.exit(1)

# Desición estética para el cliente
time.sleep(3)
os.system("cls")

mostrar_logo()
print("Menú de opciones:")
print("1.- Ver información de una dirección de correo electrónico")
print("2.- Ver correos marcados como favoritos")
print("3.- Marcar correo como favorito")
print("4.- Terminar con la ejecución del cliente")

opcion = int(input("\nIngrese opción: "))
opciones = ["informacion","favoritos","marcarcorreo"]

while opcion != 4:
    consumir_api(opciones[opcion-1], correo, clave)
    opcion = int(input("\nIngrese opción: "))

print("Hasta la próxima ;D")