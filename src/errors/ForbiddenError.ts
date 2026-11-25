// Study: Define the ForbiddenError class used by the HTTP error-handling flow.
// Study: Import `{ AppError }` from `"./AppError"`.
import { AppError } from "./AppError";

// Study: Define `ForbiddenError` with `extends AppError`.
export class ForbiddenError extends AppError {
    // Study: Initialize a new instance of `ForbiddenError`.
    constructor(message: string) {
        // Study: Call `super`.
        super(message, 403);
    // Study: Close the code block.
    }
// Study: Close the class declaration.
}

//user is logged in but doesnt have permission
//eg : you dont have permission to delete this project