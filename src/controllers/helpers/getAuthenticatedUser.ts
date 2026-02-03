import { AppError } from "@/shared/errors/app-error";
import { HttpStatus } from "@/shared/http/status-codes";

export function getAuthenticatedUser(req: any) {
    const user = req.user;

    if (!user) {
        throw new AppError(
            "Acesso negado",
            "UNAUTHORIZED",
            HttpStatus.UNAUTHORIZED
        );
    }

    return user;
}
