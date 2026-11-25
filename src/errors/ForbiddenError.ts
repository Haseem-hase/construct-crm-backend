// Study: Define the ForbiddenError class used by the HTTP error-handling flow.
// Study: Bring in `{ AppError }` from `"./AppError"` so this file can use it.
import { AppError } from "./AppError";

// Study: Define `ForbiddenError` with `extends AppError`.
export class ForbiddenError extends AppError {
    // Study: Initialize a new instance of `ForbiddenError`.
    constructor(message: string) {
        // Study: Call `super`.
        super(message, 403);
    // Study: End this group of steps.
    }
// Study: Close the class declaration.
}

//user is logged in but doesnt have permission
//eg : you dont have permission to delete this project