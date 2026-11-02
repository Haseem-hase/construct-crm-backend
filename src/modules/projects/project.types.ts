import { z } from 'zod';
import { createProjectSchema, updateProjectSchema } from './project.validation';

export type CreateProjectInput = z.infer<
    typeof createProjectSchema
>;

export type UpdateProjectInput = z.infer<
    typeof updateProjectSchema
>;

export type ProjectImageMutation = {
    id?: string;
    imageUrl?: string;
    alt?: string;
    isCover: boolean;
};
