import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import v1Routes from "./routes/v1/index.js";
import "dotenv/config";

const PORT = process.env.PORT || 5000,
  DEVICE_DEFAULT_ID = process.env.DEVICE_DEFAULT_ID;

const DEFAULT_HOURS = process.env.DEFAULT_HOURS || 0,
  DEFAULT_MINUTES = process.env.DEFAULT_MINUTES || 3,
  DEFAULT_SECONDS = process.env.DEFAULT_SECONDS || 10;

const app = express();
const bodyParser = {
  urlencoded: express.urlencoded({ limit: "30mb", extended: true }),
  json: express.json({ limit: "30mb" }),
};

app.use(bodyParser.urlencoded);
app.use(bodyParser.json);
app.use(cors());

app.use(v1Routes);

await mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.log("ERROR while connecting to the database");
  });

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

export default app;
export { DEVICE_DEFAULT_ID, DEFAULT_HOURS, DEFAULT_MINUTES, DEFAULT_SECONDS };
