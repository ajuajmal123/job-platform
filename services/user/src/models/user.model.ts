import mongoose from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";


export interface userDocument extends mongoose.Document{
    name:string;
    email:string;
    password:string;
    verified:boolean;
    createdAt:Date;
    updatedAt:Date;
    comparePassword(val:string):Promise<boolean>;
    omitPassword():Omit<userDocument,'password'>;
}

const userSchema=new mongoose.Schema<userDocument>(
    {
        name:{type:String},
        email:{type:String,required:true,unique:true},
        password:{type:String,required:true},
        verified:{type:Boolean,default:false},
    },
    {
        timestamps:true,
    }
);

userSchema.pre('save',async function(next){
if(!this.isModified('password')){
    return next()
}
this.password=await hashValue(this.password,8)
});

userSchema.methods.comparePassword=async function(val:string){
    return compareValue(val,this.password)
};

userSchema.methods.omitPassword=function(){
    const user=this.toObject();
    delete user.password;
    return user
};

const userModel=mongoose.model<userDocument>('User',userSchema);

export default userModel