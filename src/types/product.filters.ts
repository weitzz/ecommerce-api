export type ProductFilters = {
    metadata?: Record<string, string[]>
    orderBy?: 'views' | 'selling' | 'price';
    order?: string;
    limit?: number;
    search?: string;
    page?: number;
}