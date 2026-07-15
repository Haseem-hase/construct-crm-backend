import { AppError } from "./AppError";

export class BadRequestError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}

//used fo invalid request
//invalid input
//validation failure (when not handled by zod)