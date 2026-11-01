import { NextFunction, Request, Response } from "express";
import { inventoryOrganizationId } from "./inventory-context.middleware";
import * as service from "./inventory.service";
import { idParamsSchema, inventoryAssetListSchema, inventoryAssetSchema, inventoryAssetUpdateSchema } from "./inventory.validation";

type Handler = (req: Request, res: Response) => Promise<unknown>;
const handle = (message: string, statusCode: number, key: string, action: Handler) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await action(req, res);
            res.status(statusCode).json({ success: true, message, data: { [key]: result } });
        } catch (error) { next(error); }
    };

const organization = (_req: Request, res: Response) => inventoryOrganizationId(res);
const id = (req: Request) => idParamsSchema.parse(req.params).id;

export const listInventoryAssets = handle("Inventory records retrieved.", 200, "result", (req, res) => service.listInventoryAssets(organization(req, res), inventoryAssetListSchema.parse(req.query)));
export const getInventoryAsset = handle("Inventory record retrieved.", 200, "asset", (req, res) => service.getInventoryAsset(organization(req, res), id(req)));
const inventoryInput = (req: Request, res: Response) => ({
    ...req.body,
    ...(req.file ? { imageUrl: `/uploads/inventory/${inventoryOrganizationId(res)}/${req.file.filename}` } : {}),
});

export const createInventoryAsset = handle("Inventory record created.", 201, "asset", (req, res) => service.createInventoryAsset(organization(req, res), inventoryAssetSchema.parse(inventoryInput(req, res))));
export const updateInventoryAsset = handle("Inventory record updated.", 200, "asset", (req, res) => service.updateInventoryAsset(organization(req, res), id(req), inventoryAssetUpdateSchema.parse(inventoryInput(req, res))));
export const deleteInventoryAsset = handle("Inventory record deactivated.", 200, "asset", (req, res) => service.deactivateInventoryAsset(organization(req, res), id(req)));
