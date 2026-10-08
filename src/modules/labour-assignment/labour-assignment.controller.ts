import { Request, Response, NextFunction } from "express";
import * as labourAssignmentService from "./labour-assignment.service";
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
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
            throw new UnauthorizedError(
                "User is not associated with an organization."
            );
        }

        const assignment = await labourAssignmentService.createAssignment(
            user.organizationId,
            validatedData
        );

        res.status(201).json({
            success: true,
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

        if (!user.organizationId) {
            throw new UnauthorizedError(
                "User is not associated with an organization."
            );
        }

        const filters = {
            labourId: req.query.labourId as string | undefined,
            contractorProjectAssignmentId: req.query.contractorProjectAssignmentId as string | undefined,
            status: req.query.status as LabourAssignmentStatus | undefined,
        };

        const assignments = await labourAssignmentService.getAssignments(
            user.organizationId,
            filters
        );

        res.status(200).json({
            success: true,
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

        if (!user.organizationId) {
            throw new UnauthorizedError(
                "User is not associated with an organization."
            );
        }

        const params = labourAssignmentIdSchema.parse(req.params);

        const assignment = await labourAssignmentService.getAssignmentById(
            user.organizationId,
            params.id
        );

        res.status(200).json({
            success: true,
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
            throw new UnauthorizedError(
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
            data: {
                assignment,
            },
        });
    } catch (error) {
        next(error);
    }
};
