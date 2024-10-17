import dayjs from 'dayjs';
import pino from 'pino';
import pinoPretty from 'pino-pretty';

const logger = pino(
  {
    base: {
      pid: false,
    },
    timestamp: () => `,"time":"${dayjs().format('hh:mm:ss')}"`,
  },
  pinoPretty({
    customPrettifiers: {
      time: (t) => t.toString(),
    },
  }),
);

export default logger;
