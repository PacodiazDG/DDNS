import express from "express";
import net from "net";
import fs from "fs";
import * as dotenv from "dotenv";
import * as child from "child_process";
const app = express();

var Ip;

app.get("/nic/update", (req, res) => {
  if (net.isIP(req.query.myip) != 4) {
    return res.status(400).send({ error: "Ip not valid" });
  }
  if (
    !req.headers.authorization ||
    req.headers.authorization != process.env.Token
  ) {
    return res.status(403).json({ error: "No credentials not valid!" });
  }
  if (req.query.myip === Ip) {
    return res.status(404).json({ error: "ip already registered" });
  }
  Ip=req.query.myip;
  fs.appendFileSync(
    process.env.File,
    `acl myip src ${req.query.myip}\n`,
    (e) => {
      console.error(e);
      return res.status(500).json({ error: "File not Write" });
    }
  );
  child.exec("service squid reload", (error) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
  res.send("Ok");
});

dotenv.config();
app.listen(3000, () => {
  console.log(`listening on port ${300}`);
});
