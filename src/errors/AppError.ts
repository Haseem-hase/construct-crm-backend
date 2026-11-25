// Study: Define the AppError class used by the HTTP error-handling flow.
// Study: Define `AppError` with `extends Error`.
export class AppError extends Error {
    // Study: Define `statusCode` with type `number`.
    public readonly statusCode: number;
    // Study: Define `isOperational` with type `boolean`.
    public readonly isOperational: boolean;

    // Study: Initialize a new instance of `AppError`.
    constructor(message: string, statusCode: number) {
        // Study: Call `super`.
        super(message);

        // Study: Assign `statusCode` to `this.statusCode`.
        this.statusCode = statusCode;
        // Study: Assign `true` to `this.isOperational`.
        this.isOperational = true;

        // Study: Call `Error.captureStackTrace`.
        Error.captureStackTrace(this, this.constructor);
    // Study: Close the code block.
    }
// Study: Close the class declaration.
}