// Study: Configure image upload handling, including file storage and upload rules.
// Study: Import `{ NextFunction, Request, Response }` from `"express"`.
import { NextFunction, Request, Response } from "express";
// Study: Import `multer, { MulterError }` from `"multer"`.
import multer, { MulterError } from "multer";
// Study: Import `path` from `"path"`.
import path from "path";
// Study: Import `{ mkdirSync }` from `"fs"`.
import { mkdirSync } from "fs";
// Study: Import `{ randomUUID }` from `"crypto"`.
import { randomUUID } from "crypto";
// Study: Import `{ BadRequestError }` from `"../errors/BadRequestError"`.
import { BadRequestError } from "../errors/BadRequestError";

// Study: Build the object `allowedMimeTypes` with the entries below.
const allowedMimeTypes: Record<string, string> = {
    // Study: Set `"image/jpeg"` to `".jpg"`.
    "image/jpeg": ".jpg",
    // Study: Set `"image/png"` to `".png"`.
    "image/png": ".png",
    // Study: Set `"image/webp"` to `".webp"`.
    "image/webp": ".webp",
// Study: Close the object literal.
};

/** Creates a single-image upload middleware that stores files under uploads/<directory>. */
// Study: Export `createImageUploadMiddleware` as a reusable function.
export const createImageUploadMiddleware = (options: {
    // Study: Define `directory` with type `(req: Request) => string`.
    directory: (req: Request) => string;
    // Study: Define `fieldName` as optional with type `string`.
    fieldName?: string;
    // Study: Define `maxSizeBytes` as optional with type `number`.
    maxSizeBytes?: number;
    // Study: Define `maxFiles` as optional with type `number`.
    maxFiles?: number;
// Study: Close this group and continue the enclosing expression.
}) => {
    // Study: Set `maxFiles` to `options.maxFiles ?? 1`.
    const maxFiles = options.maxFiles ?? 1;
    // Study: Call `multer` and store the result as `upload`.
    const upload = multer({
        // Study: Set `storage` to `multer.diskStorage({ destination: (req, _file, callback) => { try { const directory…`.
        storage: multer.diskStorage({
            // Study: Provide the callback used for `destination`.
            destination: (req, _file, callback) => {
                // Study: Run this block and handle failures in the associated catch block.
                try {
                    // Study: Call `path.resolve` and store the result as `directory`.
                    const directory = path.resolve(process.cwd(), "uploads", options.directory(req));
                    // Study: Call `mkdirSync`.
                    mkdirSync(directory, { recursive: true });
                    // Study: Call `callback`.
                    callback(null, directory);
                // Study: Handle an exception from the try block as `error`.
                } catch (error) {
                    // Study: Call `callback`.
                    callback(error as Error, "");
                // Study: Close the code block.
                }
            // Study: Close the code block.
            },
            // Study: Provide the callback used for `filename`.
            filename: (_req, file, callback) => {
                // Study: Set `extension` to `allowedMimeTypes[file.mimetype]`.
                const extension = allowedMimeTypes[file.mimetype];
                // Study: Run the following branch when `!extension` is truthy.
                if (!extension) {
                    // Study: Call `callback`.
                    callback(new BadRequestError("Choose a JPEG, PNG, or WebP image."), "");
                    // Study: Exit the function here.
                    return;
                // Study: Close the code block.
                }
                // Study: Call `callback`.
                callback(null, `${randomUUID()}${extension}`);
            // Study: Close the code block.
            },
        // Study: Close the object literal.
        }),
        // Study: Start the nested value for `limits`.
        limits: { fileSize: options.maxSizeBytes ?? 5 * 1024 * 1024, files: maxFiles },
    // Study: Close the object literal.
    });

    // Study: Return `(req: Request, res: Response, next: NextFunction) => { const parser = maxFiles === …` to the caller.
    return (req: Request, res: Response, next: NextFunction) => {
        // Study: Set `parser` to `maxFiles === 1 ? upload.single(options.fieldName ?? "image") : upload.array(options…`.
        const parser = maxFiles === 1
            // Study: Use this value when the preceding condition is truthy.
            ? upload.single(options.fieldName ?? "image")
            // Study: Use this value when the preceding condition is falsy.
            : upload.array(options.fieldName ?? "images", maxFiles);
        // Study: Call `parser`.
        parser(req, res, (error?: unknown) => {
            // Study: Run the following branch when `error instanceof MulterError && error.code === "LIMIT_FILE_SIZE"` is truthy.
            if (error instanceof MulterError && error.code === "LIMIT_FILE_SIZE") {
                // Study: Pass the error to the next Express error handler.
                next(new BadRequestError("Each image must be 5 MB or smaller."));
                // Study: Exit the function here.
                return;
            // Study: Close the code block.
            }
            // Study: Run the following branch when `error instanceof MulterError` is truthy.
            if (error instanceof MulterError) {
                // Study: Run the following branch when `maxFiles > 1 && (error.code === "LIMIT_FILE_COUNT" || error.code === "LIMIT_UNEXPEC…` is truthy.
                if (maxFiles > 1 && (error.code === "LIMIT_FILE_COUNT" || error.code === "LIMIT_UNEXPECTED_FILE")) {
                    // Study: Pass the error to the next Express error handler.
                    next(new BadRequestError(`Upload no more than ${maxFiles} images at a time.`));
                    // Study: Exit the function here.
                    return;
                // Study: Close the code block.
                }
                // Study: Pass the error to the next Express error handler.
                next(new BadRequestError("Unable to process the selected image."));
                // Study: Exit the function here.
                return;
            // Study: Close the code block.
            }
            // Study: Pass the error to the next Express error handler.
            next(error);
        // Study: Close the code block.
        });
    // Study: Close the code block.
    };
// Study: Close the code block.
};
