// Study: Use Zod to parse and validate inputs for construction projects, their site details, and image galleries.
// Study: Import `{ z }` from `"zod"`.
import { z } from "zod";

// Study: Define `formNullToNull` as a reusable function.
const formNullToNull = (value: unknown) => value === null || value === "null" ? null : value;
// Study: Build a Zod validation rule with `z.string().trim().max(2048).refine` and store the result as `projectImageUrl`.
const projectImageUrl = z.string().trim().max(2048).refine(
    // Study: Accept `value`.
    value => /^\/uploads\/projects\/[0-9a-f-]{36}\/[a-zA-Z0-9-]+\.(jpg|png|webp)$/i.test(value) || z.string().url().safeParse(value).success,
    // Study: Supply the literal string `"Use a valid project image URL."` here.
    "Use a valid project image URL."
// Study: Close the call arguments.
);

// Study: Build the object `imageDetails` with the entries below.
const imageDetails = {
    // Study: Validate `kind` with `z.enum(["DESIGN", "SITE"]).optional()`.
    kind: z.enum(["DESIGN", "SITE"]).optional(),
    // Study: Validate `visitedAt` with `z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => { const date = new Date(val…`.
    visitedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => { const date = new Date(value); return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value; }, "Use a valid visit date.").nullable().optional(),
    // Study: Validate `siteStage` with `z.enum(["BEFORE_WORK", "IN_PROGRESS", "COMPLETED"]).nullable().optional()`.
    siteStage: z.enum(["BEFORE_WORK", "IN_PROGRESS", "COMPLETED"]).nullable().optional(),
    // Study: Validate `areaSqFt` with `z.number().positive().max(9999999999.99).nullable().optional()`.
    areaSqFt: z.number().positive().max(9999999999.99).nullable().optional(),
    // Study: Validate `notes` with `z.string().trim().max(2000).nullable().optional()`.
    notes: z.string().trim().max(2000).nullable().optional(),
// Study: Close the object literal.
};

// Study: Build a Zod validation rule with `z.array(z.discriminatedUnion("source", [ z.object({ ...imageDetails, source: z.lite…` and store the result as `projectGallerySchema`.
export const projectGallerySchema = z.array(z.discriminatedUnion("source", [
    // Study: Build a Zod validation rule with `z.object({ ...imageDetails, source: z.literal("existing"), id: z.string().uuid(), i…`.
    z.object({ ...imageDetails, source: z.literal("existing"), id: z.string().uuid(), isCover: z.boolean() }).strict(),
    // Study: Build a Zod validation rule with `z.object({ ...imageDetails, source: z.literal("upload"), uploadIndex: z.number().in…`.
    z.object({ ...imageDetails, source: z.literal("upload"), uploadIndex: z.number().int().min(0).max(9), isCover: z.boolean(), alt: z.string().trim().max(255).optional() }).strict(),
    // Study: Build a Zod validation rule with `z.object({ ...imageDetails, source: z.literal("url"), url: projectImageUrl, isCover…`.
    z.object({ ...imageDetails, source: z.literal("url"), url: projectImageUrl, isCover: z.boolean(), alt: z.string().trim().max(255).optional() }).strict(),
// Study: Keep the items in `images` that satisfy the predicate.
])).max(200).refine(images => images.length === 0 || images.filter(image => image.isCover).length === 1, "Choose exactly one cover image.")
    // Study: Apply a custom validation rule.
    .refine(images => {
        // Study: Transform each item in `images.filter(image => image.source === "upload")` and store the result as `indexes`.
        const indexes = images.filter(image => image.source === "upload").map(image => image.uploadIndex);
        // Study: Return `indexes.length === new Set(indexes).size` to the caller.
        return indexes.length === new Set(indexes).size;
    // Study: Close this group and continue the enclosing expression.
    }, "An uploaded image can only appear once.")
    // Study: Apply a custom validation rule.
    .refine(images => {
        // Study: Transform each item in `images.filter(image => image.source === "existing")` and store the result as `ids`.
        const ids = images.filter(image => image.source === "existing").map(image => image.id);
        // Study: Return `ids.length === new Set(ids).size` to the caller.
        return ids.length === new Set(ids).size;
    // Study: Close this group and continue the enclosing expression.
    }, "An existing image can only appear once.");

// Study: Define the compile-time contract named `ProjectGalleryPlan` from the Zod schema so the types follow validation.
export type ProjectGalleryPlan = z.infer<typeof projectGallerySchema>;

// Study: Build a Zod validation rule with `z.object({ name: z .string() .trim() .min(3, "Project name must be at least 3 chara…` and store the result as `createProjectSchema`.
export const createProjectSchema = z.object({
    // Study: Set `name` to `z .string() .trim() .min(3, "Project name must be at least 3 characters.") .max(150)`.
    name: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a minimum value or length.
        .min(3, "Project name must be at least 3 characters.")
        // Study: Enforce a maximum value or length.
        .max(150),

    // Study: Set `description` to `z .string() .trim() .max(1000) .optional()`.
    description: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(1000)
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Validate `areaSqFt` with `z.coerce.number().positive().max(9999999999.99).optional()`.
    areaSqFt: z.coerce.number().positive().max(9999999999.99).optional(),
    // Study: Set `imageUrl` to `projectImageUrl.optional()`.
    imageUrl: projectImageUrl.optional(),

    // Study: Set `status` to `z .enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"]) .default("PLAN…`.
    status: z
        // Study: Continue the chain with `enum`.
        .enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"])
        // Study: Use this default when no value is provided.
        .default("PLANNING")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `country` to `z .string() .trim() .max(100)`.
    country: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(100),

    // Study: Set `city` to `z .string() .trim() .max(100) .optional()`.
    city: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(100)
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `address` to `z .string() .trim() .max(255) .optional()`.
    address: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(255)
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `latitude` to `z .coerce .number() .min(-90) .max(90) .optional()`.
    latitude: z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce
        // Study: Continue the chain with `number`.
        .number()
        // Study: Enforce a minimum value or length.
        .min(-90)
        // Study: Enforce a maximum value or length.
        .max(90)
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `longitude` to `z .coerce .number() .min(-180) .max(180) .optional()`.
    longitude: z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce
        // Study: Continue the chain with `number`.
        .number()
        // Study: Enforce a minimum value or length.
        .min(-180)
        // Study: Enforce a maximum value or length.
        .max(180)
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `plannedStartDate` to `z .coerce .date() .optional()`.
    plannedStartDate: z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce
        // Study: Continue the chain with `date`.
        .date()
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `plannedEndDate` to `z .coerce .date() .optional()`.
    plannedEndDate: z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce
        // Study: Continue the chain with `date`.
        .date()
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `actualStartDate` to `z .coerce .date() .optional()`.
    actualStartDate: z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce
        // Study: Continue the chain with `date`.
        .date()
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `actualEndDate` to `z .coerce .date() .optional()`.
    actualEndDate: z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce
        // Study: Continue the chain with `date`.
        .date()
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `progress` to `z .coerce .number() .int() .min(0) .max(100) .default(0) .optional()`.
    progress: z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce
        // Study: Continue the chain with `number`.
        .number()
        // Study: Continue the chain with `int`.
        .int()
        // Study: Enforce a minimum value or length.
        .min(0)
        // Study: Enforce a maximum value or length.
        .max(100)
        // Study: Use this default when no value is provided.
        .default(0)
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `budget` to `z .coerce .number() .nonnegative("Budget cannot be negative.") .optional()`.
    budget: z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce
        // Study: Continue the chain with `number`.
        .number()
        // Study: Continue the chain with `nonnegative`.
        .nonnegative("Budget cannot be negative.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `customerId` to `z .string() .uuid("Invalid customer ID.") .optional()`.
    customerId: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Continue the chain with `uuid`.
        .uuid("Invalid customer ID.")
        // Study: Allow this value to be omitted.
        .optional(),
// Study: Close this group and continue the enclosing expression.
}).strict().refine(
    // Study: Supply `data` to the surrounding statement.
    (data) => {
        // Study: Run the following branch when `data.plannedStartDate && data.plannedEndDate` is truthy.
        if (data.plannedStartDate && data.plannedEndDate) {
            // Study: Return `data.plannedEndDate >= data.plannedStartDate` to the caller.
            return data.plannedEndDate >= data.plannedStartDate;
        // Study: Close the code block.
        }
        // Study: Return `true` to the caller.
        return true;
    // Study: Close the code block.
    },
    // Study: Start the object passed to the surrounding expression.
    {
        // Study: Set `message` to `"Planned end date must be after planned start date."`.
        message: "Planned end date must be after planned start date.",
        // Study: Start the nested value for `path`.
        path: ["plannedEndDate"],
    // Study: Close the object literal.
    }
// Study: Close this group and continue the enclosing expression.
).refine(
    // Study: Supply `data` to the surrounding statement.
    (data) => {
        // Study: Run the following branch when `data.actualStartDate && data.actualEndDate` is truthy.
        if (data.actualStartDate && data.actualEndDate) {
            // Study: Return `data.actualEndDate >= data.actualStartDate` to the caller.
            return data.actualEndDate >= data.actualStartDate;
        // Study: Close the code block.
        }
        // Study: Return `true` to the caller.
        return true;
    // Study: Close the code block.
    },
    // Study: Start the object passed to the surrounding expression.
    {
        // Study: Set `message` to `"Actual end date must be after actual start date."`.
        message: "Actual end date must be after actual start date.",
        // Study: Start the nested value for `path`.
        path: ["actualEndDate"],
    // Study: Close the object literal.
    }
// Study: Close the call arguments.
);

// Study: Build a Zod validation rule with `z.object({ name: z .string() .trim() .min(3) .max(150) .optional(), description: z.…` and store the result as `updateProjectSchema`.
export const updateProjectSchema = z.object({
    // Study: Set `name` to `z .string() .trim() .min(3) .max(150) .optional()`.
    name: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a minimum value or length.
        .min(3)
        // Study: Enforce a maximum value or length.
        .max(150)
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Validate `description` with `z.preprocess(formNullToNull, z .string() .trim() .max(1000) .nullable() .optional())`.
    description: z.preprocess(formNullToNull, z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(1000)
        // Study: Allow an explicit null value.
        .nullable()
        // Study: Allow this value to be omitted.
        .optional()),

    // Study: Validate `areaSqFt` with `z.preprocess(formNullToNull, z.coerce.number().positive().max(9999999999.99).nullab…`.
    areaSqFt: z.preprocess(formNullToNull, z.coerce.number().positive().max(9999999999.99).nullable().optional()),
    // Study: Validate `imageUrl` with `z.preprocess(formNullToNull, projectImageUrl.nullable().optional())`.
    imageUrl: z.preprocess(formNullToNull, projectImageUrl.nullable().optional()),

    // Study: Set `status` to `z .enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"]) .optional()`.
    status: z
        // Study: Continue the chain with `enum`.
        .enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"])
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `country` to `z .string() .trim() .max(100) .optional()`.
    country: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(100)
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Validate `city` with `z.preprocess(formNullToNull, z .string() .trim() .max(100) .nullable() .optional())`.
    city: z.preprocess(formNullToNull, z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(100)
        // Study: Allow an explicit null value.
        .nullable()
        // Study: Allow this value to be omitted.
        .optional()),

    // Study: Validate `address` with `z.preprocess(formNullToNull, z .string() .trim() .max(255) .nullable() .optional())`.
    address: z.preprocess(formNullToNull, z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(255)
        // Study: Allow an explicit null value.
        .nullable()
        // Study: Allow this value to be omitted.
        .optional()),

    // Study: Validate `latitude` with `z.preprocess(formNullToNull, z .coerce.number() .min(-90) .max(90) .nullable() .opt…`.
    latitude: z.preprocess(formNullToNull, z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce.number()
        // Study: Enforce a minimum value or length.
        .min(-90)
        // Study: Enforce a maximum value or length.
        .max(90)
        // Study: Allow an explicit null value.
        .nullable()
        // Study: Allow this value to be omitted.
        .optional()),

    // Study: Validate `longitude` with `z.preprocess(formNullToNull, z .coerce.number() .min(-180) .max(180) .nullable() .o…`.
    longitude: z.preprocess(formNullToNull, z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce.number()
        // Study: Enforce a minimum value or length.
        .min(-180)
        // Study: Enforce a maximum value or length.
        .max(180)
        // Study: Allow an explicit null value.
        .nullable()
        // Study: Allow this value to be omitted.
        .optional()),

    // Study: Validate `plannedStartDate` with `z.preprocess(formNullToNull, z .coerce.date() .nullable() .optional())`.
    plannedStartDate: z.preprocess(formNullToNull, z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce.date()
        // Study: Allow an explicit null value.
        .nullable()
        // Study: Allow this value to be omitted.
        .optional()),

    // Study: Validate `plannedEndDate` with `z.preprocess(formNullToNull, z .coerce.date() .nullable() .optional())`.
    plannedEndDate: z.preprocess(formNullToNull, z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce.date()
        // Study: Allow an explicit null value.
        .nullable()
        // Study: Allow this value to be omitted.
        .optional()),

    // Study: Validate `actualStartDate` with `z.preprocess(formNullToNull, z .coerce.date() .nullable() .optional())`.
    actualStartDate: z.preprocess(formNullToNull, z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce.date()
        // Study: Allow an explicit null value.
        .nullable()
        // Study: Allow this value to be omitted.
        .optional()),

    // Study: Validate `actualEndDate` with `z.preprocess(formNullToNull, z .coerce.date() .nullable() .optional())`.
    actualEndDate: z.preprocess(formNullToNull, z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce.date()
        // Study: Allow an explicit null value.
        .nullable()
        // Study: Allow this value to be omitted.
        .optional()),

    // Study: Set `progress` to `z .coerce .number() .int() .min(0) .max(100) .optional()`.
    progress: z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce
        // Study: Continue the chain with `number`.
        .number()
        // Study: Continue the chain with `int`.
        .int()
        // Study: Enforce a minimum value or length.
        .min(0)
        // Study: Enforce a maximum value or length.
        .max(100)
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Validate `budget` with `z.preprocess(formNullToNull, z .coerce.number() .nonnegative() .nullable() .optiona…`.
    budget: z.preprocess(formNullToNull, z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce.number()
        // Study: Continue the chain with `nonnegative`.
        .nonnegative()
        // Study: Allow an explicit null value.
        .nullable()
        // Study: Allow this value to be omitted.
        .optional()),
// Study: Close this group and continue the enclosing expression.
}).strict().refine(
    // Study: Supply `data` to the surrounding statement.
    (data) => Object.keys(data).length > 0,
    // Study: Start the object passed to the surrounding expression.
    {
        // Study: Set `message` to `"At least one field must be provided for update."`.
        message: "At least one field must be provided for update.",
    // Study: Close the object literal.
    }
// Study: Close this group and continue the enclosing expression.
).refine(
    // Study: Supply `data` to the surrounding statement.
    (data) => {
        // Study: Run the following branch when `data.plannedStartDate && data.plannedEndDate` is truthy.
        if (data.plannedStartDate && data.plannedEndDate) {
            // Study: Return `data.plannedEndDate >= data.plannedStartDate` to the caller.
            return data.plannedEndDate >= data.plannedStartDate;
        // Study: Close the code block.
        }
        // Study: Return `true` to the caller.
        return true;
    // Study: Close the code block.
    },
    // Study: Start the object passed to the surrounding expression.
    {
        // Study: Set `message` to `"Planned end date must be after planned start date."`.
        message: "Planned end date must be after planned start date.",
        // Study: Start the nested value for `path`.
        path: ["plannedEndDate"],
    // Study: Close the object literal.
    }
// Study: Close this group and continue the enclosing expression.
).refine(
    // Study: Supply `data` to the surrounding statement.
    (data) => {
        // Study: Run the following branch when `data.actualStartDate && data.actualEndDate` is truthy.
        if (data.actualStartDate && data.actualEndDate) {
            // Study: Return `data.actualEndDate >= data.actualStartDate` to the caller.
            return data.actualEndDate >= data.actualStartDate;
        // Study: Close the code block.
        }
        // Study: Return `true` to the caller.
        return true;
    // Study: Close the code block.
    },
    // Study: Start the object passed to the surrounding expression.
    {
        // Study: Set `message` to `"Actual end date must be after actual start date."`.
        message: "Actual end date must be after actual start date.",
        // Study: Start the nested value for `path`.
        path: ["actualEndDate"],
    // Study: Close the object literal.
    }
// Study: Close the call arguments.
);

// Study: Build a Zod validation rule with `z.object` and store the result as `projectIdSchema`.
export const projectIdSchema = z.object({
    // Study: Validate `projectId` with `z.string().uuid("Invalid project ID.")`.
    projectId: z.string().uuid("Invalid project ID."),
// Study: Close the object literal.
});
