export type ProductFilters = {
    metadata?: Record<string, string[]>
    order?: string;
    limit?: number;
    search?: string;
    page?: number;
}