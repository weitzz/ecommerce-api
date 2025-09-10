import { getBaseUrl } from "./get-base-url";

export const getAbsoluteImageUrl = (imageUrl: string) => {
    return `${getBaseUrl()}/${imageUrl}`;
}