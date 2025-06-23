export const getNews = async() => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    fs.writeFileSync(
      path.join(__dirname, "tech_news.json"),
      JSON.stringify(data, null, 2)
    );

    if (!response.ok) {
      console.error("API Error", data);
      return;
    }
    data.articles.slice(0, 5).forEach((article, idx) => {
      console.log(`\n[${idx + 1}] ${article.title}`);
      console.log(article.description);
    });

  } catch (err) {
    console.error("Fetch failed:", err);
  }
}