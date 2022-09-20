import * as bodyParser from "body-parser";
import * as express from "express";
import "reflect-metadata";
import { Connection } from "./connection";
import { itemController } from "./controller";


const app = express();

async function initServer() {
  app.use(bodyParser.json());
  const itemRouter = await itemController();
  app.use('/item', itemRouter);


  app.listen(3000, () => {
    console.log("Server listening in localhost:3000");
  })
}



async function init() {
  await Connection.getInstance();
  await initServer();
}

init();