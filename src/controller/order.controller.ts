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
        try {
            let orders = await service.getAll();
            res.json(orders);
        } catch (err: any) {
            console.error(err);
            res.status(500).json({
                message: err.message
            })
        }
    })

    //To get an order
    router.get('/:id', async (req, res) => {
        try {
            if (isEmptyOrNull(req?.params?.id)) {
                throw new Error("Order Id is null or undefined. Give a valid order id.");
            }
            let order = await service.get((req.params as any).id);
            res.json(order);
        } catch (err: any) {
            console.error(err);
            res.status(500).json({
                message: err.message
            })
        }
    })


    //To save/add a new order
    router.post('/', async (req, res) => {
        // let { items, ...orderBody } = req.body as Order;
        try {
            if (isEmptyOrNull(req?.body) || isEmptyOrNull(req?.body?.items)) {
                throw new Error("Order body or Order items body is null or undefined.");
            }
            let order: Order = await service.add(req.body as Order);
            for (let item of order.items) {
                item.orderId = order.id;
            }
            order.items = await oiService.addMany(order.items);
            res.json(order);
        } catch (err: any) {
            console.error(err);
            res.status(500).json({
                message: err.message
            })
        }

    })


    // updateOrderAddItem() {

    // }

    // updateOrderUpdateItem() {

    // }

    // updateOrderDeleteItem() {

    // }

    //To update an order
    router.put('/:id', async (req, res) => {
        try {
            if (isEmptyOrNull(req?.params?.id) || isEmptyOrNull(req?.body)) {
                throw new Error("Order id or order body is null or undefined.");
            }
            const { items, ...order } = req.body;
            let item = await service.update(parseInt(req.params.id), order, false);
            res.json(item);
        } catch (err: any) {
            console.error(err);
            res.status(500).json({
                message: err.message
            })
        }
    })

    //To delete an order and order-items
    router.delete('/:id', async (req, res) => {
        try {
            if (isEmptyOrNull(req?.params?.id)) {
                throw new Error("Order id is null or undefined. Give a valid order id.")
            }
            await oiService.deleteManyWithOrderId((req.params as any).id);
            let order = service.delete((req.params as any).id);
            res.json(order);
        } catch (err: any) {
            console.error(err);
            res.status(500).json({
                message: err.message
            })
        }
    })


    //To add a new item to an existing order
    router.post('/:id/item', async (req, res) => {
        try {
            if (isEmptyOrNull(req?.params?.id) || isEmptyOrNull(req?.body) || !isArray(req?.body)) {
                throw new Error("Order Id or Order Items is null or undefined.");
            }
            let orderId: number = parseInt(req.params.id);
            let item: OrderItem[] = req.body;
            //To add the new item to the order-item table
            item = await oiService.addMany(item);
            let order = await service.update(orderId, {} as Order, true);
            res.json(order);
        } catch (err: any) {
            console.error(err);
            res.status(500).json({
                message: err.message
            })
        }
    })

    //To update an existing item of an existing order
    router.put('/:id/item', async (req, res) => {
        try {
            if (isEmptyOrNull(req?.params?.id) || isEmptyOrNull(req?.body) || !isArray(req?.body)) {
                throw new Error("Order Id or Order Items is null or undefined.");
            }
            let orderId: number = parseInt(req.params.id);
            let orderItems: OrderItem[] = req.body;
            for (let item of orderItems) {
                //To update the item to the order-item table
                await oiService.update(orderId, item.itemId, item);
            }
            let order = await service.update(orderId, {} as Order, true);
            res.json(order);
        } catch (err: any) {
            console.error(err);
            res.status(500).json({
                message: err.message
            })
        }
    })

    //To delete an item from an existing order
    router.delete('/:id/item/:itemId', async (req, res) => {
        try {
            if (isEmptyOrNull(req?.params?.id) || isEmptyOrNull(req?.params?.itemId)) {
                throw new Error("Order Id or Order Item id is null or undefined.");
            }
            await oiService.delete((req.params as any).id, (req.params as any).itemId);
            let order = await service.update((req.params as any).id, {} as Order, true);
            res.json(order);
        } catch (err: any) {
            console.error(err);
        }
    })

    function isEmptyOrNull(input: any) {
        if (input == null || input.length == 0) {
            return true;
        }
        return false;
    }

    function isArray(input: any) {
        if (input.constructor.name == Array && input.length > 0) {
            return true;
        }
        return false;
    }
    return router;
}