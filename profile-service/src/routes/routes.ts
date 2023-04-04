import { TRoutesInput } from "../types/routes";
import {passportMiddleware} from "../middleware/auth.middleware"
import { getProfile } from "../controllers/profile.controller";
import { TProfile } from "../types/profile.type";

export default ({ app }: TRoutesInput) => {
    app.get("/", passportMiddleware, async (req,res)=>{
        if(req.user){
          const reqUser = <TProfile>req.user
          const profile = await getProfile(reqUser._id)
          res.status(200).send(profile)
        }
      })
};