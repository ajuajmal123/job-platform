import AppErrorCode from "../constants/appErrorCode";
import { httpStatusCode } from "../constants/http";

class AppError extends Error{
    constructor(
        public statusCode:httpStatusCode,
       public message:string,
       public errorCode?:AppErrorCode
    ){
        super(message)
    }
}
new AppError(200,'msg')

export default AppError;