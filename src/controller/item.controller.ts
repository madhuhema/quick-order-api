import * as express from 'express';
import { ItemService } from '../service';
import { Connection } from "../connection";

const router = express.Router();


export async function itemController() {
    //To get the connection instance which is a singleton object
    const connection = await Connection.getInstance();
    const db = connection.db;
    const itemService = new ItemService(db);

    router.get('/all', async (req, res) => {
        let items = await itemService.getAll()
        res.json(items);
    })

    router.get('/:id', async (req, res) => {
        let item = await itemService.get((req.params as any).id)
        res.json(item);
    })
    
    router.post('/', async (req, res) => {
        let item = await itemService.add(req.body)
        res.json(item);
    })
    
    router.put('/', async (req, res) => {
        const { id, ...itemBody } = req.body;
        let item = await itemService.update(id, itemBody)
        res.json(item)
    })
    
    router.delete('/:id', async (req, res) => {
        let item = await itemService.delete((req.params as any).id)
        res.json(item)
    })

    return router;
}

