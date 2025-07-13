const date_converter = () => {
  // PG gives dates like: "2025-06-23 15:11:16.973997" can I remove time?
  // JS gives dates like: 2025-6-1. Need leading zeros for months and date
  // 
  const currentDate = new Date();
  let month = currentDate.getMonth() + 1; // given as 0-11
  let day = currentDate.getDate(); 
  const year = currentDate.getFullYear();
  month = (month < 10) ? ('0' + month) : month;
  day = (day < 10) ? ('0' + day) : day;
  return (`${year}-${month}-${day}`);
}

const standardizeDate = () => {
    const now = new Date();
    const isoString = now.toISOString();
    return isoString.split('T')[0]; // YYYY-MM-DD
}

export { date_converter, standardizeDate };
