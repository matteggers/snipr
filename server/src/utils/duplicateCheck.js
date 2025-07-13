import { standardizeDate } from "./dateUtil.js";
import { Article } from "../services/databaseService.js";

export async function duplicateDate() {
    let now = standardizeDate();
    
    let rows = await Article.findByDate(now);

    return rows && rows.length > 0;
}