const fetch = require("node-fetch");
const express = require("express");
const app = express();
const port = 3000;
const FormData = require("form-data");


const getAuth = async (code) => {
  return await fetch("https://auth.challonge.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=urn:ietf:params:oauth:grant-type:device_code&device_code=${code}&client_id=2a7ff25568ec5d6cc52b1603dd31c941ecf26503effa05ae52b69d7160eec1dd`,
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      return json.access_token;
    });
};

const getCode = async () => {
  return await fetch("https://auth.challonge.com/oauth/authorize_device", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "client_id=2a7ff25568ec5d6cc52b1603dd31c941ecf26503effa05ae52b69d7160eec1dd&scope=me tournaments:read matches:read participants:read",
  }).then((res) => res.json());
};

const refreshTokens = async (refreshToken) => {
  var data = new FormData();
  data.append('refresh_token', refreshToken);
  data.append('client_id', '2a7ff25568ec5d6cc52b1603dd31c941ecf26503effa05ae52b69d7160eec1dd');
  data.append('grant_type', 'refresh_token');
  data.append('redirect_uri', 'https://oauth.pstmn.io/v1/callback');
  
  var config = {
    method: 'post',
    url: 'https://api.challonge.com/oauth/token',
    headers: { 
      ...data.getHeaders()
    },
    data : data
  };
  return await fetch("https://api.challonge.com/oauth/token", config)
    .then((res) => res.text())
    .then((json) => {
      console.log(json);
      return json.access_token;
    });
};

app.get("/refresh", async (req, res) => {
  //BcxLgct0iDG8H3-sV2uQF_PKujFsthkMIkcYsflCHRg
  const response = await refreshTokens(req.query.refresh_token);
  res.send(response);
});

app.get("/getCode", async (req, res) => {
  res.send(await getCode());
});

app.get("/create", async (req, res) => {
  console.log("create");
  const token = await getAuth(req.query.auth);
  console.log(token);
  const response = await fetch(
    "https://api.challonge.com/v2/tournaments.json",
    {
      method: "POST",
      headers: {
        "Authorization-Type": "v2",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        data: {
          type: "tournaments",
          attributes: {
            name: req.query.name,
            tournament_type: "single elimination",
          },
        },
      }),
    }
  );
  res.send(await response.json());
});
app.get("/tournaments", async (req, res) => {
  const token = await getAuth(req.query.auth);
  const response = await fetch(
    "https://api.challonge.com/v2/application/tournaments.json?page=2&per_page=10",
    {
      method: "GET",
      headers: {
        "Authorization-Type": "v2",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  res.send(await response.json());
});

app.get("/addparticipant", async (req, res) => {
  const token = await getAuth(req.query.auth);
  fetch("https://api.challonge.com/v2/tournaments/d4vlb7ep/participants.json", {
    method: "POST",
    headers: {
      "Authorization-Type": "v2",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: JSON.stringify({
      data: {
        type: "tournaments",
        attributes: {
          name: req.query.name,
          tournament_type: "single elimination",
        },
      },
    }),
  });
  res.send("added");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
