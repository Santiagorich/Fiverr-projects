const download = require("download");
const puppeteer = require("puppeteer");
const fs = require("fs");
const { Cluster } = require("puppeteer-cluster");
var linkList = fs.readFileSync("linkList.txt", "utf8").split("\r\n");
process.on('uncaughtException', function (exception) {
  console.log("Out of memory!");
 });
(async () => {
  const productCluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 10,
    timeout: 18000000,
    puppeteerOptions: {
      headless: true,
      // viewport: {
      //   width: 1440,
      //   height: 900,
      // },
    },
  });
  productCluster.on('taskerror', (err, data) => {
    console.log('Error opening new browser, out of memory?');
  });
  await productCluster.task(
    async ({ page, data: { productDesign, artEnding } }) => {
      try {
        const currentProductList = productDesign.split("/");
        const productEnding = currentProductList[currentProductList.length - 1];
        await page.goto(productDesign, { waitUntil: "load", timeout: 0 });
        const mediaMap = await page.evaluate(() => {
          return __INITIAL_STATE.product.response.product.data.attributes
            .media_map;
        });
        const imageList = [
          ...Object.values(mediaMap).map((media) => {
            let url = media.src.xxl ? media.src.xxl : media.src.xl;
            if (!url) {
              url = media.src.lg ? media.src.lg : media.src.xs;
            }
            if (url.includes(artEnding)) {
              return url;
            }
          }),
        ];
        console.log("Downloading " + productEnding);
        imageList.forEach((image, index) => {
          if (image) {
            fs.promises
              .mkdir(artEnding + "\\" + productEnding + "\\", {
                recursive: true,
              })
              .then(() => {
                download(image).pipe(
                  fs.createWriteStream(
                    artEnding + "\\" + productEnding + "\\" + index + ".jpg"
                  )
                );
              });
          }
        });
      } catch (e) {
        console.log("Error on " + productDesign);
      }
    }
  );

  for (let link of linkList) {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    const linksplitted = link.split("/");
    const artEnding = linksplitted[linksplitted.length - 1];
    await page.goto(link, { waitUntil: "load", timeout: 0 });
    await page.waitForSelector(
      "div[class^='cards_productsWithThisDesignGrid']"
    );

    try {
      if (
        await page.waitForSelector(
          "button[class^='btnViewAllProducts_productsWithThisDesignGrid']",
          { timeout: 2000 }
        )
      ) {
        await page.click(
          "button[class^='btnViewAllProducts_productsWithThisDesignGrid']"
        );
      }
    } catch (error) {}
    const productDesignList = await page.evaluate(() => {
      return [
        ...document.querySelectorAll(
          "div[class^='cards_productsWithThisDesignGrid'] div[class^='card_card'] a[class^='link_card']"
        ),
      ].map((el) => el.href);
    });
    for (let productDesign of productDesignList) {
      productCluster.execute({ productDesign, artEnding }).catch((e) => {
        
      });
    }
    await browser.close();
  }
})();
