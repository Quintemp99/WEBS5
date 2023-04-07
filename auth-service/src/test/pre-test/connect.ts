import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

async function connectMongoDB() {
  mongoServer = await MongoMemoryServer.create();
  return mongoServer.getUri();
}

async function closeMongoDB() {
  await mongoServer.stop();
}

export default () => {
  const connect = async () => {
    const db = await connectMongoDB();
    mongoose
      .connect(db)
      .then(() => {
        return console.info(`Successfully connected to ${db}`);
      })
      .catch((error) => {
        console.error("Error connecting to database: ", error);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on("disconnected", connect);
};
