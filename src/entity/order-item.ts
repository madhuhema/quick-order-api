import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./item";
import { Order } from "./order";

export enum OrderSize {
    small = "small",
    medium = "medium",
    regular = "regular",
    large = "large",
    xl = "extra large"
}

@Entity()
export class OrderItem {
    // @Column()
    // chefId!: number;

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    preferences!: string;

    @Column({
        type: "enum",
        enum: OrderSize
    })
    size!: OrderSize

    @Column({
        default: 1
    })
    quantity!: number

    @Column()
    orderId!: number;

    @Column()
    itemId!: number;

    @Column()
    name!: string;

    @Column()
    price!: number;

    @ManyToOne(() => Order, (order) => order.items)
    order!: Order

    @ManyToOne(() => Item, (item) => item.orders)
    item!: Item
}