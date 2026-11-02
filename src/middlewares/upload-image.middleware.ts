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
export const uploadSingleImage = (options: {
    directory: (req: Request) => string;
    fieldName?: string;
    maxSizeBytes?: number;
}) => {
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
        limits: { fileSize: options.maxSizeBytes ?? 5 * 1024 * 1024, files: 1 },
    });

    return (req: Request, res: Response, next: NextFunction) => {
        upload.single(options.fieldName ?? "image")(req, res, (error?: unknown) => {
            if (error instanceof MulterError && error.code === "LIMIT_FILE_SIZE") {
                next(new BadRequestError("Images must be 5 MB or smaller."));
                return;
            }
            if (error instanceof MulterError) {
                next(new BadRequestError("Unable to process the selected image."));
                return;
            }
            next(error);
        });
    };
};
