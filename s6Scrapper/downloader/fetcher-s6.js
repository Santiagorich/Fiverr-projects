const _0x11027e = _0x2532;
(function (_0x1a1999, _0x2c2883) {
  const _0x563f3b = _0x2532,
    _0x178974 = _0x1a1999();
  while (!![]) {
    try {
      const _0x1bdb36 =
        -parseInt(_0x563f3b(0xcf)) / 0x1 +
        parseInt(_0x563f3b(0xca)) / 0x2 +
        -parseInt(_0x563f3b(0xd0)) / 0x3 +
        (-parseInt(_0x563f3b(0xcc)) / 0x4) *
          (-parseInt(_0x563f3b(0xb8)) / 0x5) +
        (parseInt(_0x563f3b(0xb9)) / 0x6) * (-parseInt(_0x563f3b(0xba)) / 0x7) +
        -parseInt(_0x563f3b(0xae)) / 0x8 +
        parseInt(_0x563f3b(0xc3)) / 0x9;
      if (_0x1bdb36 === _0x2c2883) break;
      else _0x178974["push"](_0x178974["shift"]());
    } catch (_0x8b7fb3) {
      _0x178974["push"](_0x178974["shift"]());
    }
  }
})(_0x71d7, 0x82c1c);
function _0x2532(_0xdde8, _0x25178e) {
  const _0x71d78 = _0x71d7();
  return (
    (_0x2532 = function (_0x2532e5, _0x2bb7ea) {
      _0x2532e5 = _0x2532e5 - 0xa4;
      let _0x5d9d02 = _0x71d78[_0x2532e5];
      return _0x5d9d02;
    }),
    _0x2532(_0xdde8, _0x25178e)
  );
}
const download = require(_0x11027e(0xb7)),
  puppeteer = require(_0x11027e(0xab)),
  fs = require("fs"),
  { Cluster } = require(_0x11027e(0xc5)),
  linkList = fs[_0x11027e(0xbd)](_0x11027e(0xc6), _0x11027e(0xbf))["split"](
    "\x0d\x0a"
  );
function _0x71d7() {
  const _0x5b3f76 = [
    "response",
    "close",
    ".jpg",
    "puppeteer",
    "split",
    "promises",
    "4888072zmcAcA",
    "xxl",
    "Error\x20on\x20",
    "CONCURRENCY_CONTEXT",
    "src",
    "forEach",
    "createWriteStream",
    "click",
    "goto",
    "download",
    "1220kQMtBY",
    "7902rckbEz",
    "189kGuvHL",
    "evaluate",
    "data",
    "readFileSync",
    "button[class^=\x27btnViewAllProducts_productsWithThisDesignGrid\x27]",
    "utf8",
    "querySelectorAll",
    "length",
    "task",
    "4391604jXYPrE",
    "attributes",
    "puppeteer-cluster",
    "linkList.txt",
    "then",
    "product",
    "map",
    "1853802EATfWq",
    "values",
    "8716RiKMPp",
    "mkdir",
    "launch",
    "385826fjuuZK",
    "1135677yGszfq",
    "log",
    "includes",
    "div[class^=\x27cards_productsWithThisDesignGrid\x27]",
    "idle",
  ];
  _0x71d7 = function () {
    return _0x5b3f76;
  };
  return _0x71d7();
}
(async () => {
  const _0x53432c = _0x11027e,
    _0x596f2b = await Cluster[_0x53432c(0xce)]({
      concurrency: Cluster[_0x53432c(0xb1)],
      maxConcurrency: 0xa,
      timeout: 0xea60,
      puppeteerOptions: {
        headless: !![],
        viewport: { width: 0x5a0, height: 0x384 },
      },
    });
  await _0x596f2b[_0x53432c(0xc2)](
    async ({
      page: _0x4468,
      data: { productDesign: _0x22db7a, artEnding: _0x556120 },
    }) => {
      const _0x16dde2 = _0x53432c;
      try {
        const _0x5c4196 = _0x22db7a["split"]("/"),
          _0x48ed56 = _0x5c4196[_0x5c4196["length"] - 0x1];
        await _0x4468[_0x16dde2(0xb6)](_0x22db7a);
        const _0xcf4846 = await _0x4468[_0x16dde2(0xbb)](() => {
            const _0x2d8fe7 = _0x16dde2;
            return __INITIAL_STATE[_0x2d8fe7(0xc8)][_0x2d8fe7(0xa8)][
              _0x2d8fe7(0xc8)
            ][_0x2d8fe7(0xbc)][_0x2d8fe7(0xc4)]["media_map"];
          }),
          _0x169c74 = [
            ...Object[_0x16dde2(0xcb)](_0xcf4846)[_0x16dde2(0xc9)](
              (_0xf14b71) => {
                const _0x3b9d0d = _0x16dde2;
                let _0x3c53da = _0xf14b71[_0x3b9d0d(0xb2)][_0x3b9d0d(0xaf)]
                  ? _0xf14b71[_0x3b9d0d(0xb2)]["xxl"]
                  : _0xf14b71["src"]["xl"];
                !_0x3c53da &&
                  (_0x3c53da = _0xf14b71["src"]["lg"]
                    ? _0xf14b71[_0x3b9d0d(0xb2)]["lg"]
                    : _0xf14b71[_0x3b9d0d(0xb2)]["xs"]);
                if (_0x3c53da[_0x3b9d0d(0xa5)](_0x556120)) return _0x3c53da;
              }
            ),
          ];
        console[_0x16dde2(0xa4)]("Downloading\x20" + _0x48ed56),
          _0x169c74[_0x16dde2(0xb3)]((_0x20f0f5, _0x2b0007) => {
            const _0x482fae = _0x16dde2;
            _0x20f0f5 &&
              fs[_0x482fae(0xad)]
                [_0x482fae(0xcd)](_0x556120 + "\x5c" + _0x48ed56 + "\x5c", {
                  recursive: !![],
                })
                ["then"](() => {
                  const _0x1fc935 = _0x482fae;
                  download(_0x20f0f5)["pipe"](
                    fs[_0x1fc935(0xb4)](
                      _0x556120 +
                        "\x5c" +
                        _0x48ed56 +
                        "\x5c" +
                        _0x2b0007 +
                        _0x1fc935(0xaa)
                    )
                  );
                });
          });
      } catch (_0x880c80) {
        console[_0x16dde2(0xa4)](_0x16dde2(0xb0) + _0x22db7a);
      }
    }
  );
  for (let _0x5d4f7c of linkList) {
    const _0x22d1d3 = await puppeteer["launch"]({ headless: ![] }),
      _0x1f985d = await _0x22d1d3["newPage"](),
      _0x2191de = _0x5d4f7c[_0x53432c(0xac)]("/"),
      _0x379468 = _0x2191de[_0x2191de[_0x53432c(0xc1)] - 0x1];
    await _0x1f985d["goto"](_0x5d4f7c),
      await _0x1f985d["waitForSelector"](_0x53432c(0xa6));
    (await _0x1f985d["waitForSelector"](_0x53432c(0xbe), { timeout: 0x7d0 })) &&
      (await _0x1f985d[_0x53432c(0xb5)](
        "button[class^=\x27btnViewAllProducts_productsWithThisDesignGrid\x27]"
      ));
    const _0x7f4727 = await _0x1f985d["evaluate"](() => {
      const _0x19460c = _0x53432c;
      return [
        ...document[_0x19460c(0xc0)](
          "div[class^=\x27cards_productsWithThisDesignGrid\x27]\x20div[class^=\x27card_card\x27]\x20a[class^=\x27link_card\x27]"
        ),
      ]["map"]((_0x1729a4) => _0x1729a4["href"]);
    });
    console[_0x53432c(0xa4)]("Downloading\x20" + _0x379468);
    for (let _0x512ba3 of _0x7f4727) {
      _0x596f2b["queue"]({ productDesign: _0x512ba3, artEnding: _0x379468 });
    }
    await _0x596f2b[_0x53432c(0xa7)]()[_0x53432c(0xc7)](() => {
      const _0x335d92 = _0x53432c;
      _0x22d1d3[_0x335d92(0xa9)]();
    });
  }
  await _0x596f2b[_0x53432c(0xa9)]();
})();
