import { AccessTokenPayload } from "../../utils/jwt.utils";

declare global {    //means i am extending a type that already exists
    namespace Express { // namespace express means we are rtelling typescript that look inside express
        interface Request {  //reopening existing interface from jwt.utils
            user?: AccessTokenPayload;
        }
    }
}

export {};