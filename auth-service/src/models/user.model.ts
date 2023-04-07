import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { TUser } from "../types/user.type";

const Schema = mongoose.Schema;

const UserSchema = new Schema<TUser>({
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    roles:{
      type: [String],
      required: true
    }
},{
  methods:{
    async isValidPassword(password:string) : Promise<boolean>{
      const user = this;
      const compare = await bcrypt.compare(password, user.password);
  
      return compare;
    }
  }
});

UserSchema.pre(
    'save',
    async function(next) {
        const user = this;
        this.password = await bcrypt.hash(user.password, 10); 
        next();
    }
);

export default mongoose.model('User',UserSchema);