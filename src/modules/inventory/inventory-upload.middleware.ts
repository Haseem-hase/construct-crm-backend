import { NextFunction, Request, Response } from "express";
import multer, { MulterError } from "multer";
import path from "path";
import { mkdirSync } from "fs";
import { randomUUID } from "crypto";
import { BadRequestError } from "../../errors/BadRequestError";

const allowedMimeTypes: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
};

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, _file, callback) => {
            try {
                // This runs after requireInventoryOrganization validates the tenant context.
                const organizationId = req.user?.systemRole === "SUPER_ADMIN"
                    ? req.header("x-organization-id")
                    : req.user?.organizationId;
                if (!organizationId) throw new BadRequestError("Inventory organization context is missing.");
                const directory = path.resolve(process.cwd(), "uploads", "inventory", organizationId);
                mkdirSync(directory, { recursive: true });
                callback(null, directory);
            } catch (error) {
                callback(error as Error, "");
            }
        },
        filename: (req, file, callback) => {
            const extension = allowedMimeTypes[file.mimetype];
            if (!extension) {
                callback(new BadRequestError("Choose a JPEG, PNG, or WebP image."), "");
                return;
            }
            callback(null, `${randomUUID()}${extension}`);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

export const uploadInventoryImage = (req: Request, res: Response, next: NextFunction) => {
    upload.single("image")(req, res, (error?: unknown) => {
        if (error instanceof MulterError && error.code === "LIMIT_FILE_SIZE") {
            next(new BadRequestError("Inventory images must be 5 MB or smaller."));
            return;
        }
        if (error instanceof MulterError) {
            next(new BadRequestError("Unable to process the selected image."));
            return;
        }
        next(error);
    });
};
