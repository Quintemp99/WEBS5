import { TProfile, TTarget } from "../types/profile.type";
import profileModel from "../models/profile.model";

const TARGET_COLUMNS = [
    "_id",
    "email",
    "targets._id",
    "targets.user",
    "targets.image.immagaId",
    "targets.participants._id",
    "targets.participants.score",
    "targets.participants.user",
    "targets.participants.image.immagaId",
  ];

export const createProfile = async (profile: TProfile) : Promise<boolean> => {
    try{
        await profileModel.create(profile);
        return true
    }catch(err){
        return false
    }
}

export const getProfile = async (id:string) =>{
    const profile = await profileModel.findById(id, TARGET_COLUMNS)
    if(profile){
        return profile
    }
}

export const addTargetToProfile = async (target: TTarget) =>{
    const profile = await profileModel.findById(target.user._id)
    if(profile){
        if(!profile.targets){
            profile.targets = []
        }
        profile.targets.push(target)
        console.log(profile)
        profile.save();
    }
}