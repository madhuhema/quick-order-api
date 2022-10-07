import { DataSource } from "typeorm";
import { Order, OrderItem } from "../entity";

export class OrderService {
    private repository;

    constructor(db: DataSource) {
        this.repository = db.getRepository(Order);
    }

    add(order: Order) {
        order.cost = this.calcualteOrderCost(order);
        return this.repository.save(order);
    }

    get(id: number) {
        return this.repository.findOneBy({ id });
    }

    getAll() {
        return this.repository.find({});
    }

    //For order changes only. Except items
    async update(id: number, order: Order, calculatePrice: boolean) {
        if (!calculatePrice) return this.repository.update({ id }, order);
        let dbOrder = await this.get(id);
        order.cost = this.calcualteOrderCost(dbOrder as Order);
        //do not send items to order table when post/put
        delete (dbOrder as any).items;
        return this.repository.update({ id }, { ...dbOrder, ...order });
    }

    //To delete a order
    //We need to delete all the order-items related to it
    delete(id: number) {
        return this.repository.delete({ id });
    }

    calcualteOrderCost(order : Order) {
      let cost: number = order?.items.reduce((acc, item) => acc + (item.price || 0), 0) || 0;
      return cost;
    }
}