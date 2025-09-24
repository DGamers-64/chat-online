import json
import os

def crearSala(salasInfo):
    print("------------------------------------")
    nombre_clave = input("Nombre en clave de la sala > ")
    nombre_normal = input("Nombre familiar de la sala > ")
    visibilidad = input("Visibilidad (publico o privado) > ")
    salasInfo[nombre_clave] = {
        "nombre": nombre_normal,
        "administradores": [
            "127.0.0.1"
        ],
        "visibilidad": visibilidad,
        "archivo": f"./salas/chat-{nombre_clave}.json",
        "blacklist": [],
        "whitelist": []
    }

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    with open(os.path.join(BASE_DIR, "listas", "salas.json"), "w", encoding="utf-8") as f:
        json.dump(salasInfo, f, indent=4, ensure_ascii=False)

    with open(os.path.join(BASE_DIR, "salas", f"chat-{nombre_clave}.json"), "w", encoding="utf-8") as f:
        json.dump([], f, indent=4, ensure_ascii=False)

def borrarSala(salasInfo, sala):
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    os.remove(os.path.join(BASE_DIR, salasInfo[sala]["archivo"].lstrip("./")))
    del salasInfo[sala]

    with open(os.path.join(BASE_DIR, "listas", "salas.json"), "w", encoding="utf-8") as f:
        json.dump(salasInfo, f, indent=4, ensure_ascii=False)

def editarSala(salasInfo, sala):
    pass

salasInfo = {}

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

with open(os.path.join(BASE_DIR, "listas", "salas.json"), "r", encoding="utf-8") as f:
    salasInfo = json.load(f)

print("ADMINISTRADOR DE SALAS - CHAT ONLINE")
print("------------------------------------")
print("1. Crear sala")
print("2. Borrar sala")
print("3. Editar sala")
print("4. Cerrar")
opcion = int(input("Elige una opción > "))

match opcion:
    case 1:
        crearSala(salasInfo)
        quit()

    case 4:
        quit()

for x, y in salasInfo.items():
    print(f"{x}")

sala = input("Elige una clave de sala > ")

match opcion:
    case 2:
        borrarSala(salasInfo, sala)

    case 3:
        editarSala(salasInfo, sala)

    case _:
        quit()