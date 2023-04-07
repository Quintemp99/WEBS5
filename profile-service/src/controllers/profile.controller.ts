import { TProfile, TTarget } from "../types/profile.type";
import profileModel from "../models/profile.model";

const TARGET_COLUMNS = [
    "_id",
    "email",
    "roles",
    "targets._id",
    "targets.user",
    "targets.image.immagaId",
    "targets.participant._id",
    "targets.participant.score",
    "targets.participant.user",
    "targets.participant.image.immagaId",
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
        profile.save();
    }
}

export const addParticipantToTarget = async (upDatedTarget: TTarget) => {
    const profile = await profileModel.findById(upDatedTarget.user._id)
    if(profile){
        profile.targets.forEach(target => {
            if(target._id === upDatedTarget._id){
                target.participant = upDatedTarget.participant
            }
        });
        profile.save();
    }
}

export const deleteTarget = async (target: TTarget) => {
    await profileModel.findByIdAndUpdate(
        target.user._id,
        {
            $pull: {
              targets: { _id: target._id },
            },
        },
        {new:true}
    );
    
}

export const deleteParticipant = async (targetAndParticipantId: {target: TTarget, participantId:string}) => {
    await profileModel.findByIdAndUpdate(
        targetAndParticipantId.target.user._id,
        {
            $pull:{
                'targets.$[target].participant':{
                    _id: targetAndParticipantId.participantId
                }
            }
        },
        {
            arrayFilters:[{"target._id": targetAndParticipantId.target._id}],
            new:true
        }
    )
}