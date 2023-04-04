import { TProfile } from "../types/profile.type";
import profileModel from "../models/profile.model";

export const createProfile = async (profile: TProfile) : Promise<boolean> => {
    try{
        const newProfile =  new profileModel(profile);
        newProfile.save();
        return true
    }catch(err){
        return false
    }
}

export const getProfile = async (_id:string) =>{
    const profile = await profileModel.findById(_id);
    if(profile){
        return profile
    }
}