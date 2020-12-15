import chalk from "chalk";
import fs from "fs";
import path from "path";
import { EOL } from "os";
import shuffle from "shuffle-array";

import { Language } from "../../shared/codenames";

// Defines the lookup type (string array indexed by language).
type WordLookup = { [lang in Language]? : string[] };

const lookup = loadWords();
console.log(chalk.green`${chalk.white(Object.keys(lookup).length)} word definition file(s) were loaded!`);

/**
 * Returns all potential words of the given language.
 */
export function getAllWords(lang: Language): string[] {
    let words = lookup[lang];
    if (words == undefined) {
        throw new Error(`No words are loaded for '${lang}'. Ensure that a corresponding resource file exists.`);
    }

    return words;
}

/**
 * Returns a specified amount of random words from the given language.
 */
export function getWords(lang: Language, amount: number) {
    return shuffle(getAllWords(lang)).slice(0, amount);
}

/**
 * Loads all the word definition files in the '../resources/words' subdirectory.
 */
function loadWords(): WordLookup {
    let basePath = path.join(__dirname, '../resources/words');
    return fs.readdirSync(basePath)
        .reduce((lookup, file) => {
            lookup[file.replace('.txt', '') as Language] = fs.readFileSync(path.join(basePath, file)).toString().split(EOL);
            return lookup;
        }, <WordLookup>{});
}