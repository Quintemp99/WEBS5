import dotenv from "dotenv";
import { rabbitChannel } from "../config/rabbitmq"
import { TProfile, TTarget } from "../types/profile.type";
import { addParticipantToTarget, addTargetToProfile, createProfile, deleteParticipant, deleteTarget } from "../controllers/profile.controller";

dotenv.config()

export const enableAuthConsumer = async () =>{
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
                    if(newProfile._id && newProfile.email && newProfile.roles){
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

export const enableTargetConsumer = async () => {
    const channel = await rabbitChannel();
    if(!channel){
        return false
    }
    try{
        const exchange = <string>process.env.RABBIT_EXCHANGE
        const exchangeType = "direct"
        const queue = "targetService";
        const pattern = "targetCreate";

        await channel.assertExchange(exchange, exchangeType)
        await channel.assertQueue(queue, {exclusive: true})
        await channel.bindQueue(queue, exchange, pattern)

        await channel.consume(queue,
            async (msg) => {
                if(msg){
                    console.log(`Received target create message from targetService`)
                    const targetString = msg.content.toString();
                    const target = <TTarget>JSON.parse(targetString)
                    await addTargetToProfile(target);
                    channel.ack(msg)
                }
            }
        )
        console.log("targetConsumer listening")
    }catch(err){
        console.log(`Error in targetConsumer: ${err}`)
    }
}

export const enableParticipantConsumer = async () =>{
    const channel = await rabbitChannel();
    if(!channel){
        return false
    }
    try{
        const exchange = <string>process.env.RABBIT_EXCHANGE
        const exchangeType = "direct"
        const queue = "participantService";
        const pattern = "participantCreate";

        await channel.assertExchange(exchange, exchangeType)
        await channel.assertQueue(queue, {exclusive: true})
        await channel.bindQueue(queue, exchange, pattern)

        await channel.consume(queue,
            async (msg) => {
                if(msg){
                    console.log(`Received participant create message from targetService`)
                    const TargetString = msg.content.toString();
                    const target = <TTarget>JSON.parse(TargetString)
                    await addParticipantToTarget(target);
                    channel.ack(msg)
                }
            }
        )
        console.log("participantConsumer listening")
    }catch(err){
        console.log(`Error in participantConsumer: ${err}`)
    }
}

export const enableTargetDeleteConsumer = async () =>{
    const channel = await rabbitChannel();
    if(!channel){
        return false
    }
    try{
        const exchange = <string>process.env.RABBIT_EXCHANGE
        const exchangeType = "direct"
        const queue = "targetDelete";
        const pattern = "targetDelete";

        await channel.assertExchange(exchange, exchangeType)
        await channel.assertQueue(queue, {exclusive: true})
        await channel.bindQueue(queue, exchange, pattern)

        await channel.consume(queue,
            async (msg) => {
                if(msg){
                    console.log(`Received target delete message from targetService`)
                    const TargetString = msg.content.toString();
                    const target = <TTarget>JSON.parse(TargetString)
                    await deleteTarget(target);
                    channel.ack(msg)
                }
            }
        )
        console.log("targetDeleteConsumer listening")
    }catch(err){
        console.log(`Error in targetDeleteConsumer: ${err}`)
    }
}

export const enableParticipantDeleteConsumer = async () =>{
    const channel = await rabbitChannel();
    if(!channel){
        return false
    }
    try{
        const exchange = <string>process.env.RABBIT_EXCHANGE
        const exchangeType = "direct"
        const queue = "participantDelete";
        const pattern = "participantDelete";

        await channel.assertExchange(exchange, exchangeType)
        await channel.assertQueue(queue, {exclusive: true})
        await channel.bindQueue(queue, exchange, pattern)

        await channel.consume(queue,
            async (msg) => {
                if(msg){
                    console.log(`Received participant delete message from targetService`)
                    const TargetString = msg.content.toString();
                    const target = <{target:TTarget, participantId:string}>JSON.parse(TargetString)
                    await deleteParticipant(target);
                    channel.ack(msg)
                }
            }
        )
        console.log("targetDeleteConsumer listening")
    }catch(err){
        console.log(`Error in targetDeleteConsumer: ${err}`)
    }
}