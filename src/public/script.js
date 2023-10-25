const timestamp = window.location.pathname.slice(1);
const timestampDate = new Date(Number(timestamp));

if (
  Number(timestamp) < Date.now() ||
  timestampDate.toString() === "Invalid Date"
) {
  window.location.href = "/";
}

const de = document.querySelector("#timer #day"),
  he = document.querySelector("#timer #hour"),
  me = document.querySelector("#timer #minute"),
  se = document.querySelector("#timer #second");

let interval;

const run = () => {
  const diff = timestampDate - new Date();

  if (diff < 0) clearInterval(interval);

  de.innerText = String(
    Math.max(0, Math.floor(diff / 1000 / 60 / 60 / 24))
  ).padStart(2, "0");
  he.innerText = String(
    Math.max(0, Math.floor(diff / 1000 / 60 / 60) % 24)
  ).padStart(2, "0");
  me.innerText = String(
    Math.max(0, Math.floor(diff / 1000 / 60) % 60)
  ).padStart(2, "0");
  se.innerText = String(Math.max(0, Math.floor(diff / 1000) % 60)).padStart(
    2,
    "0"
  );
};

setTimeout(run, 1);
interval = setInterval(run, 1e3);
