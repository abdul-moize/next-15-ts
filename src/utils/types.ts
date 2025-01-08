export type ApiResponse<T = any> = { data?: T, success: boolean; };

export type PaginatedResponse<T = any> = {
  count: number;
  limit: number;
  q: string | null;
  results: T[];
  skip: number;
};
