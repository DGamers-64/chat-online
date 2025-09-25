import json
import os

def crearSala(salasInfo):
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
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    print("1. Vaciar chat")
    print("2. Añadir administradores")
    print("3. Quitar administradores")
    print("4. Añadir blacklist")
    print("5. Quitar blacklist")
    print("6. Añadir whitelist")
    print("7. Quitar whitelist")
    print(f"8. Cambiar visibilidad (actual: {salasInfo[sala]["visibilidad"]})")
    opcion = int(input("Introduce una opción > "))
    print("------------------------------------")

    match opcion:
        case 1:
            with open(os.path.join(BASE_DIR, salasInfo[sala]["archivo"].lstrip("./")), 'w') as f:
                json.dump([], f, indent=4, ensure_ascii=False)
        
        case 2:
            administrador = input("Escribe la ip del administrador a añadir > ")
            salasInfo[sala]["administradores"].append(administrador)
            with open(os.path.join(BASE_DIR, "listas", "salas.json"), 'w', encoding="utf-8") as f:
                json.dump(salasInfo, f, indent=4, ensure_ascii=False)
        
        case 3:
            administrador = input("Escribe la ip del administrador a quitar > ")
            salasInfo[sala]["administradores"].remove(administrador)
            with open(os.path.join(BASE_DIR, "listas", "salas.json"), 'w', encoding="utf-8") as f:
                json.dump(salasInfo, f, indent=4, ensure_ascii=False)
        
        case 4:
            baneado = input("Escribe la ip del baneado a añadir > ")
            salasInfo[sala]["blacklist"].append(baneado)
            with open(os.path.join(BASE_DIR, "listas", "salas.json"), 'w', encoding="utf-8") as f:
                json.dump(salasInfo, f, indent=4, ensure_ascii=False)
        
        case 5:
            baneado = input("Escribe la ip del baneado a quitar > ")
            salasInfo[sala]["blacklist"].remove(baneado)
            with open(os.path.join(BASE_DIR, "listas", "salas.json"), 'w', encoding="utf-8") as f:
                json.dump(salasInfo, f, indent=4, ensure_ascii=False)
        
        case 6:
            whitlisteado = input("Escribe la ip del whitlisteado a añadir > ")
            salasInfo[sala]["whitelist"].append(whitlisteado)
            with open(os.path.join(BASE_DIR, "listas", "salas.json"), 'w', encoding="utf-8") as f:
                json.dump(salasInfo, f, indent=4, ensure_ascii=False)
        
        case 7:
            whitlisteado = input("Escribe la ip del whitlisteado a quitar > ")
            salasInfo[sala]["whitelist"].remove(whitlisteado)
            with open(os.path.join(BASE_DIR, "listas", "salas.json"), 'w', encoding="utf-8") as f:
                json.dump(salasInfo, f, indent=4, ensure_ascii=False)
        
        case 8:
            if salasInfo[sala]["visibilidad"] == "publico":
                salasInfo[sala]["visibilidad"] = "privado"
            else:
                salasInfo[sala]["visibilidad"] = "publico"

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
print("------------------------------------")

match opcion:
    case 1:
        crearSala(salasInfo)
        quit()

    case 4:
        quit()

for x, y in salasInfo.items():
    print(f"{x}")

sala = input("Elige una clave de sala > ")
print("------------------------------------")

match opcion:
    case 2:
        borrarSala(salasInfo, sala)

    case 3:
        editarSala(salasInfo, sala)

    case _:
        quit()