import { rabbitChannel } from "../config/rabbitmq";
import { ITarget } from "../models/target.model";

export const publishTarget = async (target: ITarget) =>{
    const channel = await rabbitChannel();
    if(!channel){
        return false
    }
    try{
        const exchange = <string>process.env.RABBIT_EXCHANGE
        const exchangeType = "direct"
        const pattern = "targetCreate";

        await channel.assertExchange(exchange, exchangeType)
        channel.publish(exchange, pattern, Buffer.from(JSON.stringify(target)))
    }catch(err){
        console.log(`Error in publisher: ${err}`)
    }
}