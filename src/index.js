import express, { urlencoded } from "express";

const app = express();

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

  const timestamp = Date.now() + totalMs;

  res.redirect(`/${totalMs > 0 ? timestamp : ""}`);
});

app.get("/:timestamp", (req, res) => {
  const { timestamp } = req.params ?? {};

  if (new Date(Number(timestamp ?? NaN)).toString() === "Invalid Date") {
    res.redirect("/");
  } else {
    res.sendFile("src/timer.html", { root: process.cwd() });
  }
});

app.get("/preset/:minute-minutes", (req, res, next) => {
  if (!req.params?.minute) return next();

  const timestamp = Date.now() + Number(req.params?.minute) * 60 * 1000;

  res.redirect(`/${timestamp}`);
});

app.listen(3005, () => {
  console.log("server started on port 3000");
});
