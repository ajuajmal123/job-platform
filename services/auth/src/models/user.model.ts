import mongoose from "mongoose";

const userSchema= new mongoose.Schema(

    {   name:{
         type:String,
         required:true    
      },
        email:{type:String,
            required:true,
            uneque:true
        },
        mobile:{
            type:String,
            uneque:true
        },
        password:{
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
);

export default mongoose.model('User',userSchema)