import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item";

export enum ItemType {
    veg = "VEG",
    nonveg = "NON-VEG",
    vegan = "VEGAN"
}

export enum ItemStatus {
    notAvailable = "Not Available",
    available = "Available"
}

export enum ItemSize {
    small = "small",
    medium = "medium",
    regular = "regular",
    large = "large",
    xl = "extra large"
}

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        length: 100,
    })
    name!: string;

    @Column()
    description!: string;

    @Column("double")
    price!: number;

    @Column({
        length: 20,
    })
    cuisine!: string;

    @Column({
        type: "enum",
        enum: ItemType
    })
    type!: ItemType;

    @Column({
        type: "enum",
        enum: ItemStatus
    })
    status!: ItemStatus

    @Column("double")
    prep_time_in_mins!: number;

    @Column({
        type: "set",
        enum: ItemSize,
        default: ["regular"]
    })
    size!: ItemSize[]

    // @Column()
    // createdBy!: number

    @OneToMany(() => OrderItem, (order_item) => order_item.item)
    orders!: OrderItem[];
}
