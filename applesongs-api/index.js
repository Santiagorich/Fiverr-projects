const fetch = require("node-fetch");
const jsdom = require("jsdom");

//CORS
const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  return await fn(req, res);
};

module.exports = allowCors(async (req, res) => {
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
        let genre = "";
        let release = "";
        let songEl = song.querySelector("audio > source");
        song.querySelectorAll(".chart-content > ul > li").forEach((li) => {
          if (li.textContent.includes("Genre")) {
            genre = li.textContent.replace("Genre: ", "");
          }
          if (li.textContent.includes("Release Date")) {
            release = li.textContent.replace("Release Date: ", "");
          }
        });
        songList.push({
          song: songEl
            ? song.querySelector("audio > source").getAttribute("src")
            : "",
          title: song.querySelector(".chart-content > .title-artist > .title")
            .textContent,
          artist: song.querySelector(".chart-content > .title-artist > .artist")
            .textContent,
          image: song.querySelector(".cover-art > img[class='cover-image']")
            .src,
          genre: genre,
          release: release,
          number: song.querySelector(".cover-art > .chart-position")
            .textContent,
        });
      });
      return songList;
    });
  return res.json(songs);
});
