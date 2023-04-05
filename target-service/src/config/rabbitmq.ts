import ampq from "amqplib";
import dotenv from "dotenv";

dotenv.config();

export const rabbitChannel = async () =>{
    try{
        const connection = await ampq.connect(process.env.RABBIT_URL || "")
        return await connection.createChannel();
    }catch(err){
        console.log(`Error in connection setup rabbit: ${err}`)
    }
}