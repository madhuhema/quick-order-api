import { DataSource } from "typeorm";
import { Item, Order, OrderItem } from "./entity";

export class Connection {
    public db: DataSource;
    private static connection: Connection;
    private constructor() {
        this.db = new DataSource({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "quickOrder",
            password: "user@123",
            database: "quickorder",
            entities: [Item, OrderItem, Order],
            synchronize: true,
            logging: false,
        })
    }

    private async init() {
        await this.db.initialize();
        console.log("Database connection successful");
    }

    static async getInstance() {
        if (Connection.connection == null) {
            Connection.connection = new Connection();
            await Connection.connection.init();
        }
        return Connection.connection;
    }
}