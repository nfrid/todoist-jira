import JiraApi from './api';
import { getJqlString, JQL, JQLOrder } from './jql';
import { IssueFields } from './types';

const Jira = {
  async getIssues<T extends keyof IssueFields = keyof IssueFields>(
    query: JQL[],
    fields?: T[],
    order?: JQLOrder,
  ) {
    const issues = await JiraApi.getIssues<T>({
      jql: getJqlString(query, order),
      fields: fields?.join(','),
    });
    return issues;
  },
};

export default Jira;
