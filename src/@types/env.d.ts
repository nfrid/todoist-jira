declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PERSONAL_ACCESS_TOKEN: string;
      JIRA_BASE_URL: string;
      TODOIST_API_KEY: string;
    }
  }
}

export {};
