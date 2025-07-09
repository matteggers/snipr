import { date_converter } from './dateUtil';

const fs = require('fs');
const path = require('path');

// handle json saving here

class fileUtils {
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

module.exports = { fileUtils };

// File Date and File Path handled here. To be used by services so none of this occurs in the the server.js file