import axios from 'axios';
import { Issue, IssueFields } from './types';

const baseURL = process.env.JIRA_BASE_URL;
const PAT = process.env.PERSONAL_ACCESS_TOKEN;

const req = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${PAT}`,
  },
});

interface SearchParams {
  jql: string;
  fields?: string;
  startAt?: number;
  maxResults?: number;
}

interface SearchResponse<T extends keyof IssueFields> {
  issues: Issue<T>[];
  total: 1;
}

const JiraApi = {
  async getIssues<T extends keyof IssueFields = keyof IssueFields>(
    params: SearchParams,
  ) {
    const { data } = await req.get<SearchResponse<T>>(
      '/rest/api/latest/search',
      {
        params,
      },
    );
    return data.issues;
  },
};

export default JiraApi;
