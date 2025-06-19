// validating environmental variables to string 

const getEnv=(key:string, defaultValue?:string):string=>{
    const value=process.env[key]||defaultValue
    if(value===undefined){
        throw new Error(`environment variable is missing${key}`);
    }

    return value;
};

export const MONGODB_URI=getEnv('MONGODB_URI');
export const APP_ORIGIN=getEnv('APP_ORIGIN')