const download = require("download");
const fs = require("fs");
const args = process.argv.slice(2);
(async () => {
  if (fs.existsSync(args[0])) {
  let fileContent = fs.readFileSync(args[0], "utf8");
  let downloadList = fileContent.split("$$");
  console.log(downloadList);
  await Promise.all(
    downloadList.map((url, index) => {
      download(url.trim())
        .then((data) => {
          fs.writeFileSync(`${args[1]}/${index}.jpg`, data);
        })
        .catch((err) => {
          console.log(err);
        });
    })
  );
    fs.unlinkSync(args[0]);
  }
})();

