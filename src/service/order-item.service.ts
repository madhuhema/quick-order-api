import { DataSource } from "typeorm";
import { OrderItem } from "../entity";

export class OrderItemService {
    private repository;
    constructor(db: DataSource) {
        this.repository = db.getRepository(OrderItem);
    }


    addMany(items: OrderItem[]) {
        return this.repository.save(items);
    }

    update(orderId: number, itemId: number, orderItem: OrderItem) {
        return this.repository.update({ orderId, itemId }, { ...orderItem, orderId });
    }

    //To delete one order-item with orderID and itemID
    delete(orderId: number, itemId: number) {
        return this.repository.delete({ orderId, itemId });
    }

    deleteManyWithOrderId(orderId: number) {
        return this.repository.delete({ orderId });
    }


}