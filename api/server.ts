import express from "express";
import cors from "cors";
import routes from "./routes";
import path from "path";

const PORT = 3010;

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "../public")));

app.use("/api", routes);

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Blockchain API server running on http://localhost:${PORT}`);
});
