import { z } from "zod";
import {
    createCustomerContactSchema,
    updateCustomerContactSchema,
    contactIdSchema,
    customerAndContactIdParamsSchema,
} from "./customer-contact.validation";

export type CreateCustomerContactInput = z.infer<typeof createCustomerContactSchema>;

export type UpdateCustomerContactInput = z.infer<typeof updateCustomerContactSchema>;

export type ContactIdParams = z.infer<typeof contactIdSchema>;

export type CustomerAndContactIdParams = z.infer<typeof customerAndContactIdParamsSchema>;
