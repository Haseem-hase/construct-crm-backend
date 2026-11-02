import { z } from "zod";

const formNullToNull = (value: unknown) => value === null || value === "null" ? null : value;
const projectImageUrl = z.string().trim().max(2048).refine(
    value => /^\/uploads\/projects\/[0-9a-f-]{36}\/[a-zA-Z0-9-]+\.(jpg|png|webp)$/i.test(value) || z.string().url().safeParse(value).success,
    "Use a valid project image URL."
);

export const createProjectSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Project name must be at least 3 characters.")
        .max(150),

    description: z
        .string()
        .trim()
        .max(1000)
        .optional(),

    imageUrl: projectImageUrl.optional(),

    status: z
        .enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"])
        .default("PLANNING")
        .optional(),

    country: z
        .string()
        .trim()
        .max(100),

    city: z
        .string()
        .trim()
        .max(100)
        .optional(),

    address: z
        .string()
        .trim()
        .max(255)
        .optional(),

    latitude: z
        .coerce
        .number()
        .min(-90)
        .max(90)
        .optional(),

    longitude: z
        .coerce
        .number()
        .min(-180)
        .max(180)
        .optional(),

    plannedStartDate: z
        .coerce
        .date()
        .optional(),

    plannedEndDate: z
        .coerce
        .date()
        .optional(),

    actualStartDate: z
        .coerce
        .date()
        .optional(),

    actualEndDate: z
        .coerce
        .date()
        .optional(),

    progress: z
        .coerce
        .number()
        .int()
        .min(0)
        .max(100)
        .default(0)
        .optional(),

    budget: z
        .coerce
        .number()
        .nonnegative("Budget cannot be negative.")
        .optional(),

    customerId: z
        .string()
        .uuid("Invalid customer ID.")
        .optional(),
}).strict().refine(
    (data) => {
        if (data.plannedStartDate && data.plannedEndDate) {
            return data.plannedEndDate >= data.plannedStartDate;
        }
        return true;
    },
    {
        message: "Planned end date must be after planned start date.",
        path: ["plannedEndDate"],
    }
).refine(
    (data) => {
        if (data.actualStartDate && data.actualEndDate) {
            return data.actualEndDate >= data.actualStartDate;
        }
        return true;
    },
    {
        message: "Actual end date must be after actual start date.",
        path: ["actualEndDate"],
    }
);

export const updateProjectSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3)
        .max(150)
        .optional(),

    description: z.preprocess(formNullToNull, z
        .string()
        .trim()
        .max(1000)
        .nullable()
        .optional()),

    imageUrl: z.preprocess(formNullToNull, projectImageUrl.nullable().optional()),

    status: z
        .enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"])
        .optional(),

    country: z
        .string()
        .trim()
        .max(100)
        .optional(),

    city: z.preprocess(formNullToNull, z
        .string()
        .trim()
        .max(100)
        .nullable()
        .optional()),

    address: z.preprocess(formNullToNull, z
        .string()
        .trim()
        .max(255)
        .nullable()
        .optional()),

    latitude: z.preprocess(formNullToNull, z
        .coerce.number()
        .min(-90)
        .max(90)
        .nullable()
        .optional()),

    longitude: z.preprocess(formNullToNull, z
        .coerce.number()
        .min(-180)
        .max(180)
        .nullable()
        .optional()),

    plannedStartDate: z.preprocess(formNullToNull, z
        .coerce.date()
        .nullable()
        .optional()),

    plannedEndDate: z.preprocess(formNullToNull, z
        .coerce.date()
        .nullable()
        .optional()),

    actualStartDate: z.preprocess(formNullToNull, z
        .coerce.date()
        .nullable()
        .optional()),

    actualEndDate: z.preprocess(formNullToNull, z
        .coerce.date()
        .nullable()
        .optional()),

    progress: z
        .coerce
        .number()
        .int()
        .min(0)
        .max(100)
        .optional(),

    budget: z.preprocess(formNullToNull, z
        .coerce.number()
        .nonnegative()
        .nullable()
        .optional()),
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field must be provided for update.",
    }
).refine(
    (data) => {
        if (data.plannedStartDate && data.plannedEndDate) {
            return data.plannedEndDate >= data.plannedStartDate;
        }
        return true;
    },
    {
        message: "Planned end date must be after planned start date.",
        path: ["plannedEndDate"],
    }
).refine(
    (data) => {
        if (data.actualStartDate && data.actualEndDate) {
            return data.actualEndDate >= data.actualStartDate;
        }
        return true;
    },
    {
        message: "Actual end date must be after actual start date.",
        path: ["actualEndDate"],
    }
);

export const projectIdSchema = z.object({
    projectId: z.string().uuid("Invalid project ID."),
});
