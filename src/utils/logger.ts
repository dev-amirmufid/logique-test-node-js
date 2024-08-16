import { createLogger, format, transports } from 'winston';
import safeStringify from 'fast-safe-stringify';
import { inspect } from 'util';

const { combine, timestamp, printf } = format;

const clc = {
  bold: (text: string) => `\x1B[1m${text}\x1B[0m`,
  green: (text: string) => `\x1B[32m${text}\x1B[39m`,
  yellow: (text: string) => `\x1B[33m${text}\x1B[39m`,
  red: (text: string) => `\x1B[31m${text}\x1B[39m`,
  magentaBright: (text: string) => `\x1B[95m${text}\x1B[39m`,
  cyanBright: (text: string) => `\x1B[96m${text}\x1B[39m`,
  blue: (text: string) => `\x1B[34m${text}\x1B[39m`,
};

const nestLikeColorScheme: Record<string, (text: string) => string> = {
  log: clc.green,
  info: clc.blue,
  error: clc.red,
  warn: clc.yellow,
  debug: clc.magentaBright,
  verbose: clc.cyanBright,
};

export const consoleFormat = printf(
  ({ service, data, level, timestamp, message, ms }) => {
    const appName = 'LOGGER';

    if (timestamp && timestamp === new Date(timestamp).toISOString()) {
      timestamp = new Date(timestamp).toLocaleString();
    }

    const color =
      nestLikeColorScheme[level] || ((text: string): string => text);
    const yellow = clc.yellow;

    data = data ?? {};
    const stringifiedMeta = safeStringify(data);
    const formattedMeta = inspect(JSON.parse(stringifiedMeta), {
      colors: true,
      depth: null,
    });

    return (
      color(`[${appName}] ${String(process.pid).padEnd(6)}- `) +
      (timestamp ? `${timestamp} ` : '') +
      `${color(level.toUpperCase().padStart(7))} ` +
      (service ? `${yellow('[' + service + ']')}` : '') +
      (message ? ` ${color(message)}` : '') +
      (formattedMeta && formattedMeta !== '{}' ? ` - ${formattedMeta}` : '') +
      (ms ? ` ${yellow(ms)}` : '')
    );
  },
);

export const logger = createLogger({
  format: combine(timestamp(), format.ms(), consoleFormat),
  transports: [new transports.Console()],
});
