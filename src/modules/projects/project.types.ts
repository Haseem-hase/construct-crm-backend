// Study: This file is about construction jobs, their site details, and their photos. Lists the names and kinds of information this part of the code expects.
// Study: Bring in `{ z }` from `'zod'` so this file can use it.
import { z } from 'zod';
// Study: Bring in `{ createProjectSchema, updateProjectSchema }` from `'./project.validation'` so this file can use it.
import { createProjectSchema, updateProjectSchema } from './project.validation';

// Study: Derive the expected information for `CreateProjectInput` from the same rules that check submitted values.
export type CreateProjectInput = z.infer<
    // Study: Supply `createProjectSchema` to the surrounding statement.
    typeof createProjectSchema
// Study: End the list of details used to describe this kind of information.
>;

// Study: Derive the expected information for `UpdateProjectInput` from the same rules that check submitted values.
export type UpdateProjectInput = z.infer<
    // Study: Supply `updateProjectSchema` to the surrounding statement.
    typeof updateProjectSchema
// Study: End the list of details used to describe this kind of information.
>;

// Study: Describe which information `ProjectImageMutation` can contain so TypeScript can catch mistakes while checking the code.
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
