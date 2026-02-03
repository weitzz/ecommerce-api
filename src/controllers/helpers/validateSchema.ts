import { ZodSchema } from "zod";
import { AppError } from "@/shared/errors/app-error";
import { HttpStatus } from "@/shared/http/status-codes";

export function validateSchema<T>(
    schema: ZodSchema<T>,
    data: unknown,
    message = "Dados inválidos"
): T {
    const result = schema.safeParse(data);

    if (!result.success) {
        throw new AppError(
            message,
            "VALIDATION_ERROR",
            HttpStatus.BAD_REQUEST,
            result.error.flatten()
        );
    }

    return result.data;
}
