import chalk from 'chalk';

/**
 * Logger to display messages in console.
 *
 * @author Rumesh Udash
 */
export class Logger {
    /**
     * Logs an error message to the console.
     *
     * @param {unknown[]} text - The error message to be logged.
     */
    public static error(...text: unknown[]) {
        console.log(chalk.bold.red('x', text));
    }

    /**
     * Prints the provided text to the console.
     *
     * @param {...unknown[]} text - The text to be printed.
     */
    public static info(...text: unknown[]) {
        console.log(chalk.dim('-', text));
    }

    /**
     * Logs a success message to the console.
     *
     * @param {unknown[]} text - the message to be logged
     */
    public static success(...text: unknown[]) {
        console.log(chalk.green('✔', text));
    }

    /**
     * Logs a warning message to the console.
     *
     * @param {...unknown[]} text - the message to be logged
     * @return {void}
     */
    public static warning(...text: unknown[]) {
        console.log(chalk.hex('#FFA500')('!', text));
    }
}
