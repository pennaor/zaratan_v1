export interface Report<T> { report: T }

export type ReportedEntity<T> = T & Report<T>;
