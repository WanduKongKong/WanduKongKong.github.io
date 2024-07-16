const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const iconv = require("iconv-lite");

const request = require("request");
const cheerio = require("cheerio");
const xml = require("xml");

const port = 3000;

app.set("port", port); // 포트 설정
// app.set("host", process.env.HOST || "0.0.0.0"); // 아이피 설정
// app.use(
//   cors({
//     origin(req, res) {
//       console.log("접속된 주소: " + req),
//         -1 == whitelist.indexOf(req) && req
//           ? res(Error("허가되지 않은 주소입니다."))
//           : res(null, !0);
//     },
//     credentials: !0,
//     optionsSuccessStatus: 200,
//   })
// );

// 루트 접속시 아이피 출력
app.get("/", function (req, res) {
  res.send("접속된 아이피: " + req.ip);
});

app.get("/naver", async (req, res) => {
  const url = "https://yandonbin.tistory.com/rss";
  // const url = "https://cafe.naver.com/cookieruntoa";

  // const url =
  //   "https://cafe.naver.com/cookieruntoa?iframe_url=/ArticleList.nhn%3Fsearch.clubid=31055592%26search.menuid=1%26search.boardtype=L";

  // await request(url, (error, response, html) => {
  //   if (!error && response.statusCode === 200) {
  //     const $ = cheerio.load(html);
  //     const title = $("title").text();
  //     res.send(`${url} is ${title}`);
  //   }
  // });

  try {
    await axios({
      url: url,
      method: "GET",
      responseType: "arraybuffer",
    }).then(async (html) => {
      const content = iconv.decode(html.data, "EUC-KR").toString();

      res.type("application/xml");
      res.send(`<?xml version="1.0" encoding="UTF-8"?>
<note>
  <to>Tove</to>
  <from>Jani</from>
  <heading>Reminder</heading>
  <body>Don't forget me this weekend!</body>
</note>`);
    });
  } catch (error) {
    console.log(error);
    res.send({
      result: "fail",
      message: "크롤링에 문제가 발생했습니다",
      error: error,
    });
  }
});

// 서버 동작중인 표시
app.listen(app.get("port"), app.get("host"), () =>
  console.log(
    "Server is running on : " + app.get("host") + ":" + app.get("port")
  )
);
