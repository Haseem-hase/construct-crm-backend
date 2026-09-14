import { z } from "zod";

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

    imageUrl: z
        .string()
        .url("Invalid image URL")
        .optional(),

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
        .number()
        .min(-90)
        .max(90)
        .optional(),

    longitude: z
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
        .number()
        .int()
        .min(0)
        .max(100)
        .default(0)
        .optional(),

    budget: z
        .number()
        .nonnegative("Budget cannot be negative.")
        .optional(),
}).refine(
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

    description: z
        .string()
        .trim()
        .max(1000)
        .optional(),

    imageUrl: z
        .string()
        .url("Invalid image URL")
        .optional(),

    status: z
        .enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"])
        .optional(),

    country: z
        .string()
        .trim()
        .max(100)
        .optional(),

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
        .number()
        .min(-90)
        .max(90)
        .optional(),

    longitude: z
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
        .number()
        .int()
        .min(0)
        .max(100)
        .optional(),

    budget: z
        .number()
        .nonnegative()
        .optional(),
}).refine(
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