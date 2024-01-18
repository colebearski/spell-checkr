const fs = require('fs');
const { argv } = require('node:process');
const dictionaryFile = formatInput(argv[2]);
const fileToCheck = formatInput(argv[3]);

/**
 * Method to format input arguments
 * @param {string} input
 * @return {string}
 */
function formatInput(input) {
    return './files/' + input + '.txt';
}

/**
 * Method to read contents of dictionary file
 * @param {textFile} dictionaryFile
 * @return {Array}
 */
function handleDictionary(dictionaryFile) {
    try {
        const dictionary = fs.readFileSync(dictionaryFile, 'utf8').toLowerCase().split('\n');
        return dictionary;
    } catch (err) {
        console.error('[spellCheckr] (handleDictionary) threw an error. ', err);
    }
}

/**
 * Method to check spelling of input file
 * Read contents of fileToCheck, filter against dictionary and return proper and incorrect words
 * @param {Array} dictionary
 * @return {Array}
 */
function handleSpellCheck(dictionary) {
    try {
        const text = fs.readFileSync(fileToCheck, 'utf8').toLowerCase().split('\n');

        let proper = {
            words: [],
            index: []
        };
        let incorrect = {
            words: [],
            index: []
        };

        text.filter((word, index) => {
            if (dictionary.includes(word)) {
                proper.words.push(word);
                proper.index.push(index);
            } else {
                incorrect.words.push(word);
                incorrect.index.push(index);
            }
        });

        return {
            'proper': proper,
            'incorrect': incorrect
        };
    } catch (err) {
        console.error('[spellCheckr] (handleSpellCheck) threw an error. ', err);
    }
}

// Set dictionary const from our dictionary handler with the dictionary file arg
const dictionary = handleDictionary(dictionaryFile);

// Set spellCheck const from our spell check handler with the dictionary const
const spellCheck = handleSpellCheck(dictionary);

/**
 * Handler to pretty print our hard spell check work
 * @return {void}
 */
function handlePrettyPrint() {
    console.log('-------------------------------');

    if (spellCheck.proper) {
        console.log('Correctly spelled words, way to go:');
        const merge = spellCheck.proper.words.map((element, i) => [element, spellCheck.proper.index[i]]);
        merge.forEach(item => {
            console.log('Line ' + item[1] + ': ' + item[0]);
        });
    }

    console.log('-------------------------------');
    console.log('\n');
    console.log('-------------------------------');

    if (spellCheck.incorrect) {
        console.log('Incorrectly spelled words, you\'ll get it next time:');
        const merge = spellCheck.incorrect.words.map((element, i) => [element, spellCheck.proper.index[i]]);
        merge.forEach(item => {
            console.log('Line ' + item[1] + ': ' + item[0]);
        });
    }

    console.log('-------------------------------');
    console.log('\n');
    console.log('-------------------------------');
}

// Execute our program
handlePrettyPrint();
