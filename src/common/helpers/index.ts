export * from './logger-params-factory';
export * from './schema-validator-helper';
export * from './catch-helper';

export interface Pagination {
  skip?: number;
  limit?: number;
  sort?: { field: string; by: 'ASC' | 'DESC' }[];
  search?: { field: string; value: string }[];
}
