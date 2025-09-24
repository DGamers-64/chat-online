import json, os

blacklist = []
whitelist = []
chat_default = []
nombres = {}
salas = {
    "default": {
        "nombre": "Chat general",
        "administradores": [
            "127.0.0.1"
        ],
        "visibilidad": "publico",
        "archivo": "./salas/chat-default.json",
        "blacklist": [

        ],
        "whitelist": [
            
        ]
    }
}

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

with open(os.path.join(BASE_DIR, "listas", "blacklist.json"), 'w') as f:
    json.dump(blacklist, f, indent=4)

with open(os.path.join(BASE_DIR, "listas", "whitelist.json"), 'w') as f:
    json.dump(whitelist, f, indent=4)

with open(os.path.join(BASE_DIR, "salas", "chat-default.json"), 'w') as f:
    json.dump(chat_default, f, indent=4)

with open(os.path.join(BASE_DIR, "listas", "nombres.json"), 'w') as f:
    json.dump(nombres, f, indent=4)

with open(os.path.join(BASE_DIR, "listas", "salas.json"), 'w') as f:
    json.dump(salas, f, indent=4)