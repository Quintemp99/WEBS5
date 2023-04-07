import { rabbitChannel } from "../config/rabbitmq";

export const publishUser = async (user: {_id:string, email:string, roles:string[]}) =>{
    const channel = await rabbitChannel();
    if(!channel){
        return false
    }
    try{
        const exchange = <string>process.env.RABBIT_EXCHANGE
        const exchangeType = "direct"
        const pattern = "register";

        await channel.assertExchange(exchange, exchangeType)
        channel.publish(exchange, pattern, Buffer.from(JSON.stringify(user)))
    }catch(err){
        console.log(`Error in publisher: ${err}`)
    }
}