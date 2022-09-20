import { DataSource } from "typeorm";
import { Item } from "../entity";

export class ItemService {
    private repository;
    constructor(db: DataSource) {
        this.repository = db.getRepository(Item);
    }

    add(item: Item) {
        return this.repository.save(item);
    }

    get(id: number) {
        return this.repository.findOneBy({ id });
    }

    getAll() {
        return this.repository.find({});
    }

    update(id: number, item: Item) {
        return this.repository.update({ id }, item);
    }

    delete(id: number) {
        return this.repository.delete({ id });
    }
}