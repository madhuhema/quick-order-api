import * as bodyParser from "body-parser";
import * as express from "express";
import "reflect-metadata";
import { Connection } from "./connection";
import { itemController, orderController } from "./controller";
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
  app.use((req, res, next) => {
    console.log(req.body);
    next()
  })
  const itemRouter = await itemController();
  app.use('/item', itemRouter);
  const orderRouter = await orderController();
  app.use('/order', orderRouter);


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