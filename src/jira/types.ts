export type IssueKey = `${string}-${number}`;

interface IssueStatus {
  self: string;
  id: number;
  key: string;
  colorName: string;
  name: string;
}

export type IssuePriority =
  | 'Highest'
  | 'High'
  | 'Medium'
  | 'Low'
  | 'Lowest'
  | 'Accident'
  | 'ASAP';

export interface IssueFields {
  summary: string;
  description: string;
  status: IssueStatus;
  labels: string[];
  priority: {
    self: string;
    id: string;
    name: IssuePriority;
    iconUrl: string;
  };
}

export interface Issue<T extends keyof IssueFields> {
  id: string;
  self: string;
  key: IssueKey;
  fields: Pick<IssueFields, T>;
}
