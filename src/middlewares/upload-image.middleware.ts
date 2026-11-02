import { NextFunction, Request, Response } from "express";
import multer, { MulterError } from "multer";
import path from "path";
import { mkdirSync } from "fs";
import { randomUUID } from "crypto";
import { BadRequestError } from "../errors/BadRequestError";

const allowedMimeTypes: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
};

/** Creates a single-image upload middleware that stores files under uploads/<directory>. */
export const createImageUploadMiddleware = (options: {
    directory: (req: Request) => string;
    fieldName?: string;
    maxSizeBytes?: number;
    maxFiles?: number;
}) => {
    const maxFiles = options.maxFiles ?? 1;
    const upload = multer({
        storage: multer.diskStorage({
            destination: (req, _file, callback) => {
                try {
                    const directory = path.resolve(process.cwd(), "uploads", options.directory(req));
                    mkdirSync(directory, { recursive: true });
                    callback(null, directory);
                } catch (error) {
                    callback(error as Error, "");
                }
            },
            filename: (_req, file, callback) => {
                const extension = allowedMimeTypes[file.mimetype];
                if (!extension) {
                    callback(new BadRequestError("Choose a JPEG, PNG, or WebP image."), "");
                    return;
                }
                callback(null, `${randomUUID()}${extension}`);
            },
        }),
        limits: { fileSize: options.maxSizeBytes ?? 5 * 1024 * 1024, files: maxFiles },
    });

    return (req: Request, res: Response, next: NextFunction) => {
        const parser = maxFiles === 1
            ? upload.single(options.fieldName ?? "image")
            : upload.array(options.fieldName ?? "images", maxFiles);
        parser(req, res, (error?: unknown) => {
            if (error instanceof MulterError && error.code === "LIMIT_FILE_SIZE") {
                next(new BadRequestError("Each image must be 5 MB or smaller."));
                return;
            }
            if (error instanceof MulterError) {
                if (maxFiles > 1 && (error.code === "LIMIT_FILE_COUNT" || error.code === "LIMIT_UNEXPECTED_FILE")) {
                    next(new BadRequestError(`Upload no more than ${maxFiles} images at a time.`));
                    return;
                }
                next(new BadRequestError("Unable to process the selected image."));
                return;
            }
            next(error);
        });
    };
};
