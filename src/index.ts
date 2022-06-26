import "dotenv/config";

import os from "os";
import express from "express";
import { SteamCmd } from "./lib/SteamCmd";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
  setup();
});

console.log(os.platform());

async function setup() {
  const steamCmd = new SteamCmd();
  await steamCmd.setup();
  console.log(`done bois`);
  const { success, result } = await steamCmd.download("730", "109900");
  console.log(`----------- RESULT`);
  console.log(result);
}

// apps that allow anonymous login download: https://steamdb.info/sub/17906/apps/
// 1577620 2793800943 