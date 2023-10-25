import express, { urlencoded } from "express";
import fs from "fs";
import path from "path";

const app = express();

app.use(express.static("public"));

app.get("/", (req, res, next) => {
  const file = path.join(__dirname, "../src/index.html");
  const content = fs.readFileSync(file, "utf-8");

  res.setHeader("Content-Type", "text/html");
  res.send(content);
});

app.post("/create", urlencoded({ extended: true }), (req, res, next) => {
  const { day, hour, minute, second } = req.body as {
    day: string;
    hour: string;
    minute: string;
    second: string;
  };

  const daysInMs = Number(day ?? 0) * 24 * 60 * 60 * 1000;
  const hoursInMs = Number(hour ?? 0) * 60 * 60 * 1000;
  const minutesInMs = Number(minute ?? 0) * 60 * 1000;
  const secondsInMs = Number(second ?? 0) * 1000;

  const totalMs = daysInMs + hoursInMs + minutesInMs + secondsInMs;

  const now = Date.now();

  const timestamp = now + totalMs;

  if (totalMs > 0) {
    res.redirect(`/${timestamp}`);
  } else {
    res.redirect(`/`);
  }
});

app.get("/:timestamp", (req, res, next) => {
  const { timestamp } = req.params ?? {};

  if (
    !timestamp ||
    typeof timestamp !== "string" ||
    new Date(Number(timestamp)).toString() === "Invalid Date" ||
    isNaN(Number(timestamp))
  ) {
    return next();
  }

  const file = path.join(__dirname, "../src/timer.html");
  const content = fs.readFileSync(file, "utf-8");

  res.setHeader("Content-Type", "text/html");
  res.send(content);
});

app.get("/preset/:minute-minutes", (req, res, next) => {
  const { minute } = req.params ?? {};

  if (!minute) {
    return next();
  }

  const minutes = Number(minute);

  const minutesInMs = minutes * 60 * 1000;

  const now = Date.now();

  const timestamp = now + minutesInMs;

  res.redirect(`/${timestamp}`);
});

// serve 404.html on 404
app.use((req, res) => {
  const file = path.join(__dirname, "../src/404.html");
  const content = fs.readFileSync(file, "utf-8");

  res.setHeader("Content-Type", "text/html");
  res.status(404).send(content);
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});
