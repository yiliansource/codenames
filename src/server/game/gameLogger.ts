import chalk from "chalk";

import { GameState } from "../../shared/codenames";

/**
 * Provides methods to log data to the console.
 */
export interface Logger {
    /**
     * Logs the specified message to the console as an info message.
     */
    info(message: string): void;
    /**
     * Logs the specified message to the console as a warning, tinted yellow by default.
     */
    warn(message: string): void;
    /**
     * Logs the specified message to the console as an error, tinted red by default.
     */
    error(message: string): void;

    /**
     * Formats the specified message to fit the logging format.
     */
    format(message: string): string;
}
/**
 * Allows logging customization.
 */
export interface LoggerOptions {
    withTime?: boolean;
}

/**
 * Creates a logger that is optionally tied to a game instance.
 */
export function createLogger(game?: GameState, options?: LoggerOptions): Logger {
    // If no options were provided, create defaults.
    if (options == undefined) {
        options = {
            withTime: true
        }
    }
    
    return {
        info(message: string) {
            if (process.env.NODE_ENV !== "production") {
                console.info(this.format(chalk.white(message)));
            }
        },
        warn(message: string) {
            if (process.env.NODE_ENV !== "production") {
                console.warn(this.format(chalk.yellow(message)));
            }
        },
        error(message: string) {
            console.error(this.format(chalk.red(message)));
        },
        
        format(message: string) {
            let lm = '';

            if (options?.withTime) { lm += chalk.gray`[${new Date().toISOString().substr(11, 8)}] `; }
            if (game) { lm += chalk.cyan`[${game.id}] `; }
            
            lm += message;
            return lm;
        }
    }
}