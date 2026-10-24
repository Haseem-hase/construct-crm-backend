import { Request, Response, NextFunction } from "express";
import * as labourAssignmentService from "./labour-assignment.service";
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
import { ForbiddenError } from "../../errors/ForbiddenError";
import {
    createLabourAssignmentSchema,
    updateLabourAssignmentSchema,
    labourAssignmentIdSchema,
} from "./labour-assignment.validation";
import { LabourAssignmentStatus } from "@prisma/client";

export const createLabourAssignment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedData = createLabourAssignmentSchema.parse(req.body);
        const user = req.user as AuthenticatedUser;

        if (!user.organizationId) {
            throw new ForbiddenError(
                "User is not associated with an organization."
            );
        }

        const assignment = await labourAssignmentService.createAssignment(
            user.organizationId,
            validatedData
        );

        res.status(201).json({
            success: true,
            message: "Labour assignment created successfully.",
            data: {
                assignment,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getLabourAssignments = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as AuthenticatedUser;

        const filters = {
            labourId: req.query.labourId as string | undefined,
            contractorProjectAssignmentId: req.query.contractorProjectAssignmentId as string | undefined,
            status: req.query.status as LabourAssignmentStatus | undefined,
        };

        if (!user.organizationId && user.systemRole !== "SUPER_ADMIN") throw new ForbiddenError("This operation requires an organization context.");
        const assignments = user.systemRole === "SUPER_ADMIN"
            ? await labourAssignmentService.getPlatformAssignments(filters)
            : await labourAssignmentService.getAssignments(user.organizationId!, filters);

        res.status(200).json({
            success: true,
            message: "Labour assignments retrieved successfully.",
            data: {
                assignments,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getLabourAssignmentById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as AuthenticatedUser;

        const params = labourAssignmentIdSchema.parse(req.params);
        if (!user.organizationId && user.systemRole !== "SUPER_ADMIN") throw new ForbiddenError("This operation requires an organization context.");
        const assignment = user.systemRole === "SUPER_ADMIN"
            ? await labourAssignmentService.getPlatformAssignmentById(params.id)
            : await labourAssignmentService.getAssignmentById(user.organizationId!, params.id);

        res.status(200).json({
            success: true,
            message: "Labour assignment retrieved successfully.",
            data: {
                assignment,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const updateLabourAssignment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedData = updateLabourAssignmentSchema.parse(req.body);
        const user = req.user as AuthenticatedUser;

        if (!user.organizationId) {
            throw new ForbiddenError(
                "User is not associated with an organization."
            );
        }

        const params = labourAssignmentIdSchema.parse(req.params);

        const assignment = await labourAssignmentService.updateAssignment(
            user.organizationId,
            params.id,
            validatedData
        );

        res.status(200).json({
            success: true,
            message: "Labour assignment updated successfully.",
            data: {
                assignment,
            },
        });
    } catch (error) {
        next(error);
    }
};
