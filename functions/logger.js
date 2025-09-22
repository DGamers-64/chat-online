import fs from "fs";
import path from "path";

export function logger(texto) {
    fs.appendFile(path.join('./data/console.log'), texto, (err) => {
        if (err) {
            console.error('Error:', err)
        }
    })
}