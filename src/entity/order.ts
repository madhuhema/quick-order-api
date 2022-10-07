import { Column, CreateDateColumn, Entity, JoinTable, ListCollectionsOptions, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item";

export enum Status {
    placed = "Placed",
    inprogress = "In progress",
    cancelled = "Cancelled",
    completed = "Completed"
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "enum",
        enum: Status
    })
    status!: Status;

    @OneToMany(() => OrderItem, (order_item) => order_item.order, { eager: true })
    items!: OrderItem[];

    @Column("double")
    cost!: number;

    @Column()
    table_number!: number

    @CreateDateColumn()
    placed_on!: Date;
}