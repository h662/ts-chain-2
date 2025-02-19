import express from "express";
import cors from "cors";
import routes from "./routes";

const PORT = 3010;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({ message: "Hello, Express!" });
});

app.listen(PORT, () => {
  console.log(`Blockchain API server running on http://localhost:${PORT}`);
});
