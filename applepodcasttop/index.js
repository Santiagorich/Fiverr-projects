const fetch = require("node-fetch");
const Parser = require("rss-parser");
const parser = new Parser();

const getPodcastInfo = async (id) => {
  const url = `https://itunes.apple.com/lookup?id=${id}`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
};

const getTopPodcasts = async (country) => {
  const url = `https://rss.applemarketingtools.com/api/v2/${country}/podcasts/top/100/podcasts.json`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
};

getTopPodcasts("us").then(async (data) => {
  for (let result of data.feed.results) {
    await getPodcastInfo(result.id).then(async (data) => {
        console.log(data.results[0]);
       await parser.parseURL(data.results[0].feedUrl, (err, feed) => {
         console.log({
            name: data.results[0].collectionName,
            email: feed.itunes?.owner.email,
            genres: data.results[0].genres,
            image: data.results[0].artworkUrl600,
         })
       });
    });
  }
});
