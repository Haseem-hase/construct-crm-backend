import { AppError } from "./AppError";

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404);
    }
}

//used for - user not found
//company not found
//project not found