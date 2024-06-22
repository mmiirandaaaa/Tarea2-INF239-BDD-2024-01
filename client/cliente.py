import requests
import os, sys, time

def iniciar_sesion(correo, clave):
    url = 'http://localhost:3000/api/informacion/'+correo

    respuesta = requests.get(url).json()

    if respuesta["estado"] == 200:
        if respuesta["usuario"]["clave"] == clave:
            print("\nInicio de sesión exitoso :D")
            return True
        else:
            print("\nRevisa que tu contraseña sea la correcta -.-")
            return False
    else:
        print("\nEste correo no existe >:c")
        return False


def consumir_api(operacion, correo, clave):
    url = 'http://localhost:3000/api/'+operacion
    
    if operacion == "informacion":
        correo = input("\nIngrese el correo del usuario: ")
        url = url+"/"+correo
        respuesta = requests.get(url)
        respuesta = respuesta.json()

        if respuesta["estado"] == 200:
            for key in respuesta["usuario"]:
                print(key+": "+str(respuesta["usuario"][key]))
        else:
            print("\nAlgo salió mal :C (no se encontró el correo)")

    elif operacion == "marcarcorreo":
        id_correo_favorito = int(input("\nIngrese el ID del correo: "))
        data = {"correo": correo, "clave": clave, "id_correo_favorito": id_correo_favorito}
        respuesta = requests.post(url, data=data)    


#print("-------- BIENVENIDO AL SISTEMA DE CORREOS COMMUNIKEN --------\n")
print("  ####    #####   ##   ##  ##   ##  ##   ##  ##   ##  ##   ##   ####             ###  ##  #######  ##   ##")
print(" ##  ##  ##   ##  ### ###  ### ###  ##   ##  ###  ##  ###  ##    ##               ##  ##   ##   #  ###  ##")
print("##       ##   ##  #######  #######  ##   ##  #### ##  #### ##    ##               ## ##    ## #    #### ##")
print("##       ##   ##  #######  #######  ##   ##  ## ####  ## ####    ##     ######    ####     ####    ## ####")
print("##       ##   ##  ## # ##  ## # ##  ##   ##  ##  ###  ##  ###    ##               ## ##    ## #    ##  ###")
print(" ##  ##  ##   ##  ##   ##  ##   ##  ##   ##  ##   ##  ##   ##    ##               ##  ##   ##   #  ##   ##")
print("  ####    #####   ##   ##  ##   ##   #####   ##   ##  ##   ##   ####             ###  ##  #######  ##   ##\n\n")

print("Por favor, inicie sesión\n")
intentos = 1
puedo_pasar = False
while not puedo_pasar and intentos<=3:
    correo = input("Correo: ")
    clave = input("Contraseña: ")
    puedo_pasar = iniciar_sesion(correo, clave)
    intentos+=1

if intentos > 3:
    print("3 intentos fallidos, cerrando el programa")
    time.sleep(1)
    sys.exit(1)

time.sleep(3)
os.system("cls")

print("Menú de opciones:")
print("1.- Ver información de una dirección de correo electrónico")
print("2.- Ver correos marcados como favoritos")
print("3.- Marcar correo como favorito")
print("4.- Terminar con la ejecución del cliente")

opcion = int(input("\nIngrese opción: "))
opciones = ["informacion","a","marcarcorreo"]

while opcion != 4:
    consumir_api(opciones[opcion-1], correo, clave)
    opcion = int(input("\nIngrese opción: "))