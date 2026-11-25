// Study: Extend Express request typing so handlers can access the authenticated user.
// Study: Import `{ AuthenticatedUser }` from `"./authenticated-user"`.
import { AuthenticatedUser } from "./authenticated-user";

// Study: Declare or extend the TypeScript namespace `global`.
declare global {    //means i am extending a type that already exists
    // Study: Declare or extend the TypeScript namespace `Express`.
    namespace Express { // namespace express means we are rtelling typescript that look inside express
        // Study: Define the compile-time contract named `Request`.
        interface Request {  //reopening existing interface from jwt.utils
            // Study: Define `user` as optional with type `AuthenticatedUser`.
            user?: AuthenticatedUser;
        // Study: Close the interface declaration.
        }
    // Study: Close the current group.
    }
// Study: Close the current group.
}

// Study: Re-export `{}` from ``.
export {};