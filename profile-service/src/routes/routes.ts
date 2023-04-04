import { TRoutesInput } from "../types/routes";
import {passportMiddleware} from "../middleware/auth.middleware"

export default ({ app }: TRoutesInput) => {
    app.get("/", passportMiddleware, (req,res)=>{
        res.status(200);
        res.send(req.user);
      })
};