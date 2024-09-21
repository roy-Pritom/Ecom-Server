import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./Routes/routes";
import globalErrorHandler from "./Middleware/globalErrorHandler";
import notFound from "./Middleware/notFound";
import cookieParser from "cookie-parser";

const app: Application = express();
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000'
];

// app.use(cors({ origin: "*" }));
app.use(
  cors({origin:allowedOrigins,credentials:true})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Hi user",
  });
});

app.use("/api/v1", router);
app.use(globalErrorHandler);
app.use(notFound);

export default app;
