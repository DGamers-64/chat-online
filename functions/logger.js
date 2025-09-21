import fs from "fs";
import path from "path";

export function logger(texto) {
    console.log(texto)

    fs.appendFile(path.join('./registros/console.log'), texto, (err) => {
        if (err) {
            console.error('Error:', err)
        }
    })
}