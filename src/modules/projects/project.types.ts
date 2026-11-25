// Study: Define TypeScript data contracts for construction projects, their site details, and image galleries.
// Study: Import `{ z }` from `'zod'`.
import { z } from 'zod';
// Study: Import `{ createProjectSchema, updateProjectSchema }` from `'./project.validation'`.
import { createProjectSchema, updateProjectSchema } from './project.validation';

// Study: Define the compile-time contract named `CreateProjectInput` from the Zod schema so the types follow validation.
export type CreateProjectInput = z.infer<
    // Study: Supply `createProjectSchema` to the surrounding statement.
    typeof createProjectSchema
// Study: Close the generic type arguments that determine the resulting TypeScript type.
>;

// Study: Define the compile-time contract named `UpdateProjectInput` from the Zod schema so the types follow validation.
export type UpdateProjectInput = z.infer<
    // Study: Supply `updateProjectSchema` to the surrounding statement.
    typeof updateProjectSchema
// Study: Close the generic type arguments that determine the resulting TypeScript type.
>;

// Study: Define the compile-time contract named `ProjectImageMutation`.
export type ProjectImageMutation = {
    // Study: Define `kind` as optional with type `'DESIGN' | 'SITE'`.
    kind?: 'DESIGN' | 'SITE';
    // Study: Define `visitedAt` as optional with type `Date | null`.
    visitedAt?: Date | null;
    // Study: Define `siteStage` as optional with type `'BEFORE_WORK' | 'IN_PROGRESS' | 'COMPLETED' | null`.
    siteStage?: 'BEFORE_WORK' | 'IN_PROGRESS' | 'COMPLETED' | null;
    // Study: Define `areaSqFt` as optional with type `number | null`.
    areaSqFt?: number | null;
    // Study: Define `notes` as optional with type `string | null`.
    notes?: string | null;
    // Study: Define `id` as optional with type `string`.
    id?: string;
    // Study: Define `imageUrl` as optional with type `string`.
    imageUrl?: string;
    // Study: Define `alt` as optional with type `string`.
    alt?: string;
    // Study: Define `isCover` with type `boolean`.
    isCover: boolean;
// Study: Close the object type.
};
