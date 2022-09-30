import * as bodyParser from "body-parser";
import * as express from "express";
import "reflect-metadata";
import { Connection } from "./connection";
import { itemController } from "./controller";
import * as cors from "cors"
// import { swagger } from "./swagger";

const app = express();
// var corsOptions = {
//   origin: '*',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

async function initServer() {
  app.use(cors());
  app.use(bodyParser.json());
  const itemRouter = await itemController();
  app.use('/item', itemRouter);


  app.listen(3000, () => {
    console.log("Server listening in localhost:3000");
  })
}



async function init() {
  // swagger();
  await Connection.getInstance();
  await initServer();
}

init();