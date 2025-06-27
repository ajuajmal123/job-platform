// validating environmental variables to string 

const getEnv=(key:string, defaultValue?:string):string=>{
    const value=process.env[key]||defaultValue
    if(value===undefined){
        throw new Error(`environment variable is missing${key}`);
    }

    return value;
};
export const NODE_ENV = getEnv("NODE_ENV", "development");
export const MONGODB_URI=getEnv('MONGODB_URI');
export const APP_ORIGIN=getEnv('APP_ORIGIN');
export const JWT_SECRET=getEnv('JWT_SECRET');
export const JWT_REFRESH_SECRET=getEnv('JWT_REFRESH_SECRET')