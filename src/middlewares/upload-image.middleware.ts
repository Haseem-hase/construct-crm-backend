// Study: Decides which image uploads to accept and where to save them.
// Study: Bring in `{ NextFunction, Request, Response }` from `"express"` so this file can use it.
import { NextFunction, Request, Response } from "express";
// Study: Bring in `multer, { MulterError }` from `"multer"` so this file can use it.
import multer, { MulterError } from "multer";
// Study: Bring in `path` from `"path"` so this file can use it.
import path from "path";
// Study: Bring in `{ mkdirSync }` from `"fs"` so this file can use it.
import { mkdirSync } from "fs";
// Study: Bring in `{ randomUUID }` from `"crypto"` so this file can use it.
import { randomUUID } from "crypto";
// Study: Bring in `{ BadRequestError }` from `"../errors/BadRequestError"` so this file can use it.
import { BadRequestError } from "../errors/BadRequestError";

// Study: Build the object `allowedMimeTypes` with the entries below.
const allowedMimeTypes: Record<string, string> = {
    // Study: Set `"image/jpeg"` to `".jpg"`.
    "image/jpeg": ".jpg",
    // Study: Set `"image/png"` to `".png"`.
    "image/png": ".png",
    // Study: Set `"image/webp"` to `".webp"`.
    "image/webp": ".webp",
// Study: End this group of values.
};

/** Creates a single-image upload middleware that stores files under uploads/<directory>. */
// Study: Set up a reusable step named `createImageUploadMiddleware`.
export const createImageUploadMiddleware = (options: {
    // Study: Define `directory` with type `(req: Request) => string`.
    directory: (req: Request) => string;
    // Study: Define `fieldName` as optional with type `string`.
    fieldName?: string;
    // Study: Define `maxSizeBytes` as optional with type `number`.
    maxSizeBytes?: number;
    // Study: Define `maxFiles` as optional with type `number`.
    maxFiles?: number;
// Study: Finish this group and continue the surrounding step.
}) => {
    // Study: Set `maxFiles` to `options.maxFiles ?? 1`.
    const maxFiles = options.maxFiles ?? 1;
    // Study: Call `multer` and store the result as `upload`.
    const upload = multer({
        // Study: Set `storage` to `multer.diskStorage({ destination: (req, _file, callback) => { try { const directory…`.
        storage: multer.diskStorage({
            // Study: Give `destination` a step to run later when it needs a result.
            destination: (req, _file, callback) => {
                // Study: Try these steps. If one fails, go to the error-handling steps below.
                try {
                    // Study: Call `path.resolve` and store the result as `directory`.
                    const directory = path.resolve(process.cwd(), "uploads", options.directory(req));
                    // Study: Call `mkdirSync`.
                    mkdirSync(directory, { recursive: true });
                    // Study: Call `callback`.
                    callback(null, directory);
                // Study: Handle a problem raised during the steps above.
                } catch (error) {
                    // Study: Call `callback`.
                    callback(error as Error, "");
                // Study: End this group of steps.
                }
            // Study: End this group of steps.
            },
            // Study: Give `filename` a step to run later when it needs a result.
            filename: (_req, file, callback) => {
                // Study: Set `extension` to `allowedMimeTypes[file.mimetype]`.
                const extension = allowedMimeTypes[file.mimetype];
                // Study: Do the next step if there is no value for `extension`.
                if (!extension) {
                    // Study: Call `callback`.
                    callback(new BadRequestError("Choose a JPEG, PNG, or WebP image."), "");
                    // Study: Exit the function here.
                    return;
                // Study: End this group of steps.
                }
                // Study: Call `callback`.
                callback(null, `${randomUUID()}${extension}`);
            // Study: End this group of steps.
            },
        // Study: End this group of values.
        }),
        // Study: Start the nested value for `limits`.
        limits: { fileSize: options.maxSizeBytes ?? 5 * 1024 * 1024, files: maxFiles },
    // Study: End this group of values.
    });

    // Study: Give `(req: Request, res: Response, next: NextFunction) => { const parser = maxFiles === …` back to the code that asked for it.
    return (req: Request, res: Response, next: NextFunction) => {
        // Study: Set `parser` to `maxFiles === 1 ? upload.single(options.fieldName ?? "image") : upload.array(options…`.
        const parser = maxFiles === 1
            // Study: Use this value if the check above passes.
            ? upload.single(options.fieldName ?? "image")
            // Study: Use this value if the check above fails.
            : upload.array(options.fieldName ?? "images", maxFiles);
        // Study: Call `parser`.
        parser(req, res, (error?: unknown) => {
            // Study: Do the next step if this check passes: `error instanceof MulterError && error.code === "LIMIT_FILE_SIZE"`.
            if (error instanceof MulterError && error.code === "LIMIT_FILE_SIZE") {
                // Study: Send the problem to the part of the backend that prepares an error reply.
                next(new BadRequestError("Each image must be 5 MB or smaller."));
                // Study: Exit the function here.
                return;
            // Study: End this group of steps.
            }
            // Study: Do the next step if this check passes: `error instanceof MulterError`.
            if (error instanceof MulterError) {
                // Study: Do the next step if this check passes: `maxFiles > 1 && (error.code === "LIMIT_FILE_COUNT" || error.code === "LIMIT_UNEXPEC…`.
                if (maxFiles > 1 && (error.code === "LIMIT_FILE_COUNT" || error.code === "LIMIT_UNEXPECTED_FILE")) {
                    // Study: Send the problem to the part of the backend that prepares an error reply.
                    next(new BadRequestError(`Upload no more than ${maxFiles} images at a time.`));
                    // Study: Exit the function here.
                    return;
                // Study: End this group of steps.
                }
                // Study: Send the problem to the part of the backend that prepares an error reply.
                next(new BadRequestError("Unable to process the selected image."));
                // Study: Exit the function here.
                return;
            // Study: End this group of steps.
            }
            // Study: Send the problem to the part of the backend that prepares an error reply.
            next(error);
        // Study: End this group of steps.
        });
    // Study: End this group of steps.
    };
// Study: End this group of steps.
};
