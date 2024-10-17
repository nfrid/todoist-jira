import 'dotenv/config';
import { TodoistApi } from '@doist/todoist-api-typescript';
import Jira from 'jira';
import logger from 'helpers/logger';
import { IssuePriority } from 'jira/types';
import JSONdb from 'simple-json-db';

const db = new JSONdb('db.json');

const td = new TodoistApi(process.env.TODOIST_API_KEY);

const priorities: Record<IssuePriority, string> = {
  Highest: 'p1',
  High: 'p2',
  Medium: 'p3',
  Low: 'p4',
  Lowest: '',
  Accident: 'p1',
  ASAP: 'p1',
};

async function main() {
  const tasks = await td.getTasks({
    filter: '#Job & @jira',
  });
  const processedTaskKeys = (db.get('processedIssues') as string[]) ?? [];
  const existingTasksKeys = tasks
    .map((t) => t.content.match(/^\[(\D+-\d+)\]/)[1])
    .concat(processedTaskKeys);

  const pendingIssues = await Jira.getIssues(
    ['assignee', 'inwork', 'sprint'],
    ['summary', 'priority', 'labels'],
  ).then((res) => {
    return res
      .filter(({ key }) => !existingTasksKeys.includes(key))
      .map(({ key, fields }) => {
        const { summary, priority, labels } = fields;
        return {
          summary,
          priority: priorities[priority.name] ?? '',
          target: labels.includes('target'),
          key,
        };
      });
  });

  let count = pendingIssues.length;

  if (count === 0) {
    logger.info('No new issues to create');
    return;
  }

  logger.info(`Creating tasks (x${count})...`);

  pendingIssues.forEach(({ key, summary, priority, target }) => {
    logger.info(`> ${key}: ${summary}`);
    td.quickAddTask({
      text: `[${key}](${process.env.JIRA_BASE_URL}/browse/${key}): ${summary} #Job @jira today ${priority} ${target ? '@target' : ''}`,
    })
      .then(() => {
        processedTaskKeys.push(key);
      })
      .catch((err) => {
        logger.error(err, 'Failed to create task');
        count--;
      });
  });

  db.set('processedIssues', processedTaskKeys);
  db.sync();

  logger.info(`Tasks created: ${count}`);
  if (count !== pendingIssues.length) {
    logger.warn(`Could not create tasks: ${pendingIssues.length - count}`);
  }
}

main();
