import * as express from 'express';
import { Connection } from "../connection";
import { Order, OrderItem } from '../entity';
import { OrderItemService, OrderService } from "../service";

const router = express.Router();

export async function orderController() {
    const connection = await Connection.getInstance();
    const db = connection.db;
    const service = new OrderService(db);
    const oiService = new OrderItemService(db);

    //To get all orders
    router.get('/all', async (req, res) => {
        let orders = await service.getAll();
        res.json(orders);
    })

    //To get an order
    router.get('/:id', async (req, res) => {
        let order = await service.get((req.params as any).id);
        res.json(order);
    })


    //To save/add a new order
    router.post('/', async (req, res) => {
        // let { items, ...orderBody } = req.body as Order;
        let order: Order = await service.add(req.body as Order);
        for (let item of order.items) {
            item.orderId = order.id;
        }
        order.items = await oiService.addMany(order.items);
        res.json(order);
    })


    // updateOrderAddItem() {

    // }

    // updateOrderUpdateItem() {

    // }

    // updateOrderDeleteItem() {

    // }

    //To update an order
    router.put('/:id', async (req, res) => {
        const { items, ...order } = req.body;
        let item = await service.update(parseInt(req.params.id), order, false);
        res.json(item);
    })

    //To delete an order and order-items
    router.delete('/:id', async (req, res) => {
        await oiService.deleteManyWithOrderId((req.params as any).id);
        let order = service.delete((req.params as any).id);
        res.json(order);
    })


    //To add a new item to an existing order
    router.post('/:id/item', async (req, res) => {
        let orderId: number = parseInt(req.params.id);
        let item: OrderItem[] = req.body;
        //To add the new item to the order-item table
        item = await oiService.addMany(item);
        let order = await service.update(orderId, {} as Order, true);
        res.json(order);
    })

    //To update an existing item of an existing order
    router.put('/:id/item', async (req, res) => {
        let orderId: number = parseInt(req.params.id);
        let orderItems: OrderItem[] = req.body;
        for (let item of orderItems) {
            //To update the item to the order-item table
            await oiService.update(orderId, item.itemId, item);
        }
        let order = await service.update(orderId, {} as Order, true);
        res.json(order);
    })

    //To delete an item from an existing order
    router.delete('/:id/item/:itemId', async (req, res) => {
        await oiService.delete((req.params as any).id, (req.params as any).itemId);
        let order = await service.update((req.params as any).id, {} as Order, true);
        res.json(order);
    })
    return router;
}