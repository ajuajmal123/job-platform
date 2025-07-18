const getEnv=(key:string,defaultValue?:string):string=>{
    const value=process.env[key]||defaultValue
    if(value===undefined){
        throw new Error(`Environment variable is missing ${key}`)
    }

    return value
}

export const MONGODB_URI=getEnv('MONGODB_URI');
export const NODE_ENV =getEnv('NODE_ENV','development');
export const APP_ORIGIN=getEnv('APP_ORIGIN');