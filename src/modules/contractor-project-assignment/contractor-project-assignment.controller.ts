import { Request, Response, NextFunction } from "express";
import * as assignmentService from "./contractor-project-assignment.service";
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import {
    createContractorProjectAssignmentSchema,
    updateContractorProjectAssignmentSchema,
    contractorProjectAssignmentIdSchema,
} from "./contractor-project-assignment.validation";
import { ContractorAssignmentStatus } from "@prisma/client";

export const createAssignment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedData = createContractorProjectAssignmentSchema.parse(req.body);
        const user = req.user as AuthenticatedUser;

        if (!user.organizationId) {
            throw new UnauthorizedError(
                "User is not associated with an organization."
            );
        }

        const assignment = await assignmentService.createAssignment(
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

export const getAssignments = async (
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
            projectId: req.query.projectId as string | undefined,
            contractorId: req.query.contractorId as string | undefined,
            status: req.query.status as ContractorAssignmentStatus | undefined,
        };

        const assignments = await assignmentService.getAssignments(
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

export const getAssignmentById = async (
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

        const params = contractorProjectAssignmentIdSchema.parse(req.params);

        const assignment = await assignmentService.getAssignmentById(
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

export const updateAssignment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedData = updateContractorProjectAssignmentSchema.parse(req.body);
        const user = req.user as AuthenticatedUser;

        if (!user.organizationId) {
            throw new UnauthorizedError(
                "User is not associated with an organization."
            );
        }

        const params = contractorProjectAssignmentIdSchema.parse(req.params);

        const assignment = await assignmentService.updateAssignment(
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
