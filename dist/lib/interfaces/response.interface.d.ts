export interface IPaginationData<T> {
    data: T;
    pagination: IPagination;
}
export interface IPagination {
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
}
