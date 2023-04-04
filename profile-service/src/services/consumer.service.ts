import dotenv from "dotenv";
import { rabbitChannel } from "../config/rabbitmq"
import { TProfile } from "../types/profile.type";
import { createProfile } from "../controllers/profile.controller";

dotenv.config()

export const enableConsumer = async () =>{
    const channel = await rabbitChannel();
    if(!channel){
        return false
    }
    try{
        const exchange = <string>process.env.RABBIT_EXCHANGE
        const exchangeType = "direct"
        const queue = "authService";
        const pattern = "register";

        await channel.assertExchange(exchange, exchangeType)
        await channel.assertQueue(queue, {exclusive: true})
        await channel.bindQueue(queue, exchange, pattern)

        await channel.consume(queue,
            async (msg) => {
                if(msg){
                    console.log(`Received message: ${msg.content}`)
                    const profileString = msg.content.toString();
                    const newProfile = <TProfile>JSON.parse(profileString)
                    if(newProfile._id && newProfile.email){
                        await createProfile(newProfile)
                    }
                    channel.ack(msg)
                }
            }
        )
        console.log("profileConsumer listening")
    }catch(err){
        console.log(`Error in profileConsumer: ${err}`)
    }
}