import { TRoutesInput } from "../types/routes";

export default ({ app }: TRoutesInput) => {
    app.get("/", (req,res)=>{
        res.status(200);
        res.end();
      })
};