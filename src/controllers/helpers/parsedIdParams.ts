import { AppError } from "@/shared/errors/app-error";
import { HttpStatus } from "@/shared/http/status-codes";

export function parseIdParam(
    param: string | string[] | undefined,
    name = "ID") {
    if (!param) {
        throw new AppError(
            `${name} inválido`,
            "INVALID_PARAM",
            HttpStatus.BAD_REQUEST
        );
    }

    if (Array.isArray(param)) {
        throw new AppError(
            `${name} inválido`,
            "INVALID_PARAM",
            HttpStatus.BAD_REQUEST
        );
    }


    const id = Number(param);

    if (Number.isNaN(id)) {
        throw new AppError(
            `${name} inválido`,
            "INVALID_PARAM",
            HttpStatus.BAD_REQUEST
        );
    }
    return id;
}
