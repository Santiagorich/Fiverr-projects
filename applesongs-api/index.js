const fetch = require("node-fetch");
const jsdom = require("jsdom");
const express = require("express");

const app = express();

app.get("/api", async (req, res) => {
  const songs = await fetch(
    `https://www.popvortex.com/music/charts/${req.query.path}`
  )
    .then((res) => res.text())
    .then((body) => {
      const parser = new jsdom.JSDOM(body);
      const document = parser.window.document;
      const songs = document.querySelectorAll(".feed-item");
      const songList = [];
      songs.forEach((song) => {
        songList.push({
          song: song.querySelector("audio > source").getAttribute("src"),
          title: song.querySelector(".chart-content > .title-artist > .title")
            .textContent,
          artist: song.querySelector(".chart-content > .title-artist > .artist")
            .textContent,
        });
      });
      return songList;
    });
  res.json(songs);
});

app.listen(3000, () => {
  console.log("App listening on port 3000");
});
