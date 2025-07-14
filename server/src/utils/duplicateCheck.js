import { standardizeDate } from "./dateUtil.js";
import { Article } from "../services/databaseService.js";

export async function duplicateDate() {
    let now = standardizeDate();
    console.log("Now: ", now);
    
    let rows = await Article.findByDate(now);
    console.log("Rows: ", rows);

    return rows && rows.length > 0;
}