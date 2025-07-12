import { date_converter, file_date } from './dateUtil.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class fileUtils {
    static saveNewsToFile(data) {
        try {
            const fileDate = file_date(); 
            const filePath = path.join(__dirname, `${fileDate}.json`);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        } catch (err) {
            console.log('Failed to save news to file: ', err);
        }
    }
};


// File Date and File Path handled here. To be used by services so none of this occurs in the the server.js file