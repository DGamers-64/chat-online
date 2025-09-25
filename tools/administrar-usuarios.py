import json
import os

def editarAdmin(modo, administradores, ip):
    if modo == 1:
        administradores.append(ip)
    else:
        administradores.remove(ip)
    return administradores

def editarBlacklist(modo, blacklist, ip):
    if modo == 1:
        blacklist.append(ip)
    else:
        blacklist.remove(ip)
    return blacklist

def editarWhitelist(modo, whitelist, ip):
    if modo == 1:
        whitelist.append(ip)
    else:
        whitelist.remove(ip)
    return whitelist

administradores = []
blacklist = []
whitelist = []

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

with open(os.path.join(BASE_DIR, "listas", "administradores.json"), "r", encoding="utf-8") as f:
    administradores = json.load(f)

with open(os.path.join(BASE_DIR, "listas", "blacklist.json"), "r", encoding="utf-8") as f:
    blacklist = json.load(f)

with open(os.path.join(BASE_DIR, "listas", "whitelist.json"), "r", encoding="utf-8") as f:
    whitelist = json.load(f)

print("ADMINISTRADOR DE USUARIOS - CHAT ONLINE")
print("---------------------------------------")
print("1. Añadir administrador")
print("2. Borrar administrador")
print("3. Añadir usuario baneado")
print("4. Borra usuario baneado")
print("5. Añade usuario whitelisteado")
print("6. Borrar usuario whitelisteado")
print("7. Cerrar")
opcion = int(input("Elige una opción > "))
print("---------------------------------------")

if opcion >= 1 and opcion <= 6:
    ip = input("Escriba la ip a editar > ")
    match opcion:
        case 1:
            administradores = editarAdmin(1, administradores, ip)

        case 2:
            administradores = editarAdmin(0, administradores, ip)

        case 3:
            blacklist = editarBlacklist(1, blacklist, ip)

        case 4:
            blacklist = editarBlacklist(0, blacklist, ip)

        case 5:
            whitelist = editarWhitelist(1, whitelist, ip)

        case 6:
            whitelist = editarWhitelist(0, whitelist, ip)
    
    with open(os.path.join(BASE_DIR, "listas", "administradores.json"), 'w', encoding="utf-8") as f:
        json.dump(administradores, f, indent=4, ensure_ascii=False)
    
    with open(os.path.join(BASE_DIR, "listas", "blacklist.json"), 'w', encoding="utf-8") as f:
        json.dump(blacklist, f, indent=4, ensure_ascii=False)
    
    with open(os.path.join(BASE_DIR, "listas", "whitelist.json"), 'w', encoding="utf-8") as f:
        json.dump(whitelist, f, indent=4, ensure_ascii=False)