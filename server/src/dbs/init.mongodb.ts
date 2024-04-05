'use strict'
import mongoose from 'mongoose';
import 'dotenv/config'
import { conuntConnect } from '../helpers/check.connect';
import config from '../config/config.mongodb';

const connectString =`mongodb+srv://${config.db.name}:${config.db.pass}@${config.db.host}.tzjnjep.mongodb.net/?retryWrites=true&w=majority`!

class Database {
    private static instance: Database;

    private constructor() {
        this.connect();
    }

    private connect(): void {
        mongoose.connect(connectString, { maxPoolSize: +process.env.MONGO_MAX_POOL_SIZE! })
            .then(() => console.log('Connected to MongoDB Successfully :  '), conuntConnect)
            .catch((err) => console.log('Error Connecting to MongoDB:', err));

        // Example of setting mongoose debug options
        if (process.env.NODE_ENV === 'development') {
            mongoose.set('debug', true);
        }
    }
    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

}

const instanceMongodb = Database.getInstance()
export default instanceMongodb;