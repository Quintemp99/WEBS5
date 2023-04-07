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

export const publishParticipant = async (target: ITarget) =>{
    const channel = await rabbitChannel();
    if(!channel){
        return false
    }
    try{
        const exchange = <string>process.env.RABBIT_EXCHANGE
        const exchangeType = "direct"
        const pattern = "participantCreate";

        await channel.assertExchange(exchange, exchangeType)
        channel.publish(exchange, pattern, Buffer.from(JSON.stringify(target)))
    }catch(err){
        console.log(`Error in publisher: ${err}`)
    }
}

export const publishDeleteTarget = async (target: ITarget) => {
    const channel = await rabbitChannel();
    if(!channel){
        return false
    }
    try{
        const exchange = <string>process.env.RABBIT_EXCHANGE
        const exchangeType = "direct"
        const pattern = "targetDelete";

        await channel.assertExchange(exchange, exchangeType)
        channel.publish(exchange, pattern, Buffer.from(JSON.stringify(target)))
    }catch(err){
        console.log(`Error in publisher: ${err}`)
    }
}

export const publishDeleteParticipant = async (target: ITarget, participantId: string) => {
    const channel = await rabbitChannel();
    if(!channel){
        return false
    }
    try{
        const exchange = <string>process.env.RABBIT_EXCHANGE
        const exchangeType = "direct"
        const pattern = "participantDelete";

        await channel.assertExchange(exchange, exchangeType)
        channel.publish(exchange, pattern, Buffer.from(JSON.stringify({target: target, participantId: participantId})))
    }catch(err){
        console.log(`Error in publisher: ${err}`)
    }
}