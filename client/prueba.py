import os, sys
import requests

url = 'http://localhost:3000/api/informacion/correo@facil.com'

response = requests.get(url)

print(response.json()["usuario"])

sys.exit(1)

print("a")