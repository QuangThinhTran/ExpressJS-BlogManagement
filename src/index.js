import express from "express";
import cors from "cors";
import rootRoute from "./routes/rootRoute.js";

const app = express();

app.use(express.json());
app.use(express.static("."));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(rootRoute);

app.listen(3000);
