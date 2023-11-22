import express, { urlencoded } from "express";
import dayjs from "dayjs";
import fs from "fs/promises";

const app = express();

const START_DATE_CONSTRAINT = new Date("2023-02-09T00:00:00.000Z").getTime();

const nowWithOffset = () => {
  return Date.now() - START_DATE_CONSTRAINT;
};

const formattedTime = (duration) => {
  const days = Math.floor(duration / 1000 / 60 / 60 / 24);
  const hours = Math.floor((duration / 1000 / 60 / 60) % 24);
  const minutes = Math.floor((duration / 1000 / 60) % 60);
  const seconds = Math.floor((duration / 1000) % 60);

  let str = "";

  if (days > 0) str += `${days} day${days === 1 ? "" : "s"} `;
  if (hours > 0) str += `${hours} hour${hours === 1 ? "" : "s"} `;
  if (minutes > 0) str += `${minutes} minute${minutes === 1 ? "" : "s"} `;
  if (seconds > 0) str += `${seconds} second${seconds === 1 ? "" : "s"} `;

  return str.trim();
};

app.use(express.static("src/public"));

app.get("/", (_, res) => {
  res.sendFile("src/index.html", { root: process.cwd() });
});

app.post("/create", urlencoded({ extended: true }), (req, res, next) => {
  const totalMs =
    (req.body?.day || 0) * 24 * 60 * 60 * 1000 +
    (req.body?.hour || 0) * 60 * 60 * 1000 +
    (req.body?.minute || 0) * 60 * 1000 +
    (req.body?.second || 0) * 1000;

  const now36 = nowWithOffset().toString(36);
  const duration36 = Number(totalMs).toString(36);

  if (totalMs <= 0) return res.redirect("/");

  const time = `${now36}+${duration36}`;

  res.redirect(`/${time}`);
});

app.get("/:timestamp", async (req, res) => {
  const { timestamp } = req.params ?? {};
  const [start36, duration36] = timestamp?.split("+") ?? [];
  const durationMs = Number.parseInt(duration36, 36);
  const startMs = Number.parseInt(start36, 36) + START_DATE_CONSTRAINT;
  const totalMs = startMs + durationMs;
  const durationDate = new Date(durationMs);

  if (new Date(Number(totalMs ?? NaN)).toString() === "Invalid Date") {
    res.redirect("/");
  } else {
    const raw = await fs.readFile("src/timer.html", "utf-8");
    const content = raw
      .replace(/{{timestamp}}/g, timestamp)
      .replace(/{{human-start-date}}/g, dayjs(startMs).format("DD MMM YYYY"))
      .replace(/{{human-duration}}/g, formattedTime(durationMs));

    res.setHeader("Content-Type", "text/html");
    res.send(content);
  }
});

app.get("/preset/:minute-minute(s)?", (req, res, next) => {
  if (!req.params?.minute) return next();

  const nowMs = nowWithOffset();
  const minuteString = req.params?.minute === "a" ? "1" : req.params?.minute;
  const durationMs = Number(minuteString) * 60 * 1000;

  const now36 = Number(nowMs).toString(36);
  const duration36 = Number(durationMs).toString(36);

  const timestamp = `${now36}+${duration36}`;

  res.redirect(`/${timestamp}`);
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});
