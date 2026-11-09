import { z } from 'zod';
import { createProjectSchema, updateProjectSchema } from './project.validation';

export type CreateProjectInput = z.infer<
    typeof createProjectSchema
>;

export type UpdateProjectInput = z.infer<
    typeof updateProjectSchema
>;

export type ProjectImageMutation = {
    kind?: 'DESIGN' | 'SITE';
    visitedAt?: Date | null;
    siteStage?: 'BEFORE_WORK' | 'IN_PROGRESS' | 'COMPLETED' | null;
    areaSqFt?: number | null;
    notes?: string | null;
    id?: string;
    imageUrl?: string;
    alt?: string;
    isCover: boolean;
};
