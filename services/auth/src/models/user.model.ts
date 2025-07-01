import mongoose from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";

//create an interface for get typing for user schema
 
export interface UserDocument extends mongoose.Document {
    name:string;
    email:string;
    password:string;
    verified:boolean;
    createdAt:Date;
    updatedAt:Date;
    comparePassword(val:string):Promise<boolean>
    omitPassword():Pick<UserDocument,'_id'|'name'|'email'|'verified'|'createdAt'|'updatedAt'>
}

const userSchema= new mongoose.Schema<UserDocument>({
    name:{type:String},
    email:{type:String,unique:true,required:true},
    password:{type:String,required:true},
    verified:{type:Boolean,required:true,default:false}
},
{
    timestamps:true

});

// define schema hooks

userSchema.pre('save',async function (next){
    if(!this.isModified("password")){
        return next();
    }

    this.password= await hashValue(this.password,8)
     next();
});

userSchema.methods.comparePassword= async function (val:string){

    return compareValue(val,this.password);
};
userSchema.methods.omitPassword=function (){
    const user=this.toObject();
    delete user.password;
    return user;
}
const userModel=mongoose.model<UserDocument>("User",userSchema);

export default userModel;