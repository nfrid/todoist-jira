export type JQL = 'assignee' | 'inwork' | 'target' | 'sprint';

const jqls: Record<JQL, string> = {
  assignee:
    '(assignee = currentUser() OR "Backend developer" = currentUser() OR "Frontend developer" = currentUser())',
  inwork: 'status in ("In Progress", "Code review", Todo, "Wait For Reply")',
  target: 'labels in (target)',
  sprint: 'Sprint in openSprints()',
};

export type JQLOrder = `${string} ${'ASC' | 'DESC'}`;

export const getJqlString = (query: JQL[], order?: JQLOrder) => {
  return (
    query.map((k) => jqls[k]).join(' AND ') +
    'ORDER BY ' +
    (order ?? 'priority DESC')
  );
};
