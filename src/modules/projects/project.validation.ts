import { z } from "zod";

export const createProjectSchema = z.object({
    projectCode: z
        .string()
        .trim()
        .min(2, "Project code is required.")
        .max(50),

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

    customerId: z
        .string()
        .uuid("Invalid customer ID."),

    address: z
        .string()
        .trim()
        .max(255)
        .optional(),

    city: z
        .string()
        .trim()
        .max(100)
        .optional(),

    latitude: z
        .number()
        .min(-90)
        .max(90)
        .optional(),

    longitude: z
        .number()
        .min(-180)
        .max(180)
        .optional(),

    startDate: z
        .coerce
        .date(),

    scheduledEndDate: z
        .coerce
        .date(),

    budget: z
        .number()
        .nonnegative("Budget cannot be negative.")
        .optional(),
}).refine(
    (data) => data.scheduledEndDate >= data.startDate,
    {
        message: "Scheduled end date must be after start date.",
        path: ["scheduledEndDate"],
    }
);

export const updateProjectSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3)
        .max(150)
        .optional(),

    description: z
        .string()
        .trim()
        .max(1000)
        .optional(),

    address: z
        .string()
        .trim()
        .max(255)
        .optional(),

    city: z
        .string()
        .trim()
        .max(100)
        .optional(),

    latitude: z
        .number()
        .min(-90)
        .max(90)
        .optional(),

    longitude: z
        .number()
        .min(-180)
        .max(180)
        .optional(),

    startDate: z
        .coerce
        .date()
        .optional(),

    scheduledEndDate: z
        .coerce
        .date()
        .optional(),

    actualEndDate: z
        .coerce
        .date()
        .optional(),

    progressPercentage: z
        .number()
        .int()
        .min(0)
        .max(100)
        .optional(),

    budget: z
        .number()
        .nonnegative()
        .optional(),
});