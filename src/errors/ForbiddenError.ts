import { AppError } from "./AppError";

export class ForbiddenError extends AppError {
    constructor(message: string) {
        super(message, 403);
    }
}

//user is logged in but doesnt have permission
//eg : you dont have permission to delete this project