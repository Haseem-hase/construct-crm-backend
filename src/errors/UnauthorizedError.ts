import { AppError } from "./AppError";

export class UnauthorizedError extends AppError {
    constructor(message: string) {
        super(message, 401);
    }
}

//used for - wrong password
//invalid JWT
//missing token