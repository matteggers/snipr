const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();
console.log("Loading API key:", process.env.SECRET_KEY);
const fs = require("fs");
const path = require("path");



const app = express();
const port = 3000;
const api_key = process.env.SECRET_KEY;
const url = `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${api_key}`;

const getNews = async() => {
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

getNews();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
