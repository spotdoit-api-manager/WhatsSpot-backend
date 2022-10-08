/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const glob = require("glob");

/**
 * @param {any} err The date
 * @param {string[]} filesAndFolders The string
 */
async function replace(err, filesAndFolders) {
    if(err) {
        console.log("Patch Error", err);
    for(const filePath of filesAndFolders) {
        if(fs.lstatSync(filePath).isDirectory() ) {
            continue;
        }
        console.log("patching ",filePath);
        const content = fs.readFileSync(filePath).toString();
        const newContent = content.replace(/baileys/ig, "Whatsapp");
        fs.rmSync(filePath);
        fs.writeFileSync(filePath,newContent);
    }
}
}

// glob("./node_modules/@adiwajshing/baileys/lib/**/*", replace);
glob("./node_modules/@adiwajshing/baileys-md/lib/**/*", replace);
