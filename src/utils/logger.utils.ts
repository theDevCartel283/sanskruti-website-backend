import chalk from 'chalk';
import dayjs from 'dayjs';

const logger = {
  error(msg: string) {
    console.log(
      `[${chalk.red.bold('ERROR')}]:[${chalk.gray(dayjs().format())}]:${msg}`
    );
  },
  warn(msg: string) {
    console.log(
      `[${chalk.yellow.bold('WARN')}]:[${chalk.gray(dayjs().format())}]:${msg}`
    );
  },
  info(msg: string) {
    console.log(
      `[${chalk.cyan.bold('INFO')}]:[${chalk.gray(dayjs().format())}]:${msg}`
    );
  },
  success(msg: string) {
    console.log(
      `[${chalk.green.bold('SUCCESS')}]:[${chalk.gray(
        dayjs().format()
      )}]:${msg}`
    );
  },
};

export default logger;
