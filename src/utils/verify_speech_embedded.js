
const normalizeResult = (transcript, alternatives = [], alphabetMode, targetChar) => {
    const mode = alphabetMode.toLowerCase();
    let normalized = transcript.toLowerCase().trim();
    // Remove punctuation immediately so "1." becomes "1" before number mapping
    normalized = normalized.replace(/[.,!?]/g, '').trim();

    // Mapping for Swedish numbers
    // Default to the CORRECT phonetic form (noun form) for the spelling alphabet
    const swedishNumbers = {
        '0': 'nolla', '1': 'ett', '2': 'tvåa', '3': 'trea', '4': 'fyra',
        '5': 'femma', '6': 'sexa', '7': 'sju', '8': 'åtta', '9': 'nia',
        '-': 'bindestreck'
    };

    // Mapping for NATO numbers
    const natoNumbers = {
        '0': 'zero', '1': 'one', '2': 'two', '3': 'tree', '4': 'fower',
        '5': 'fife', '6': 'six', '7': 'seven', '8': 'eight', '9': 'niner',
        'three': 'tree', 'four': 'fower', 'five': 'fife', 'nine': 'niner',
        '-': 'hyphen'
    };

    const numberMap = mode === 'swedish' ? swedishNumbers : natoNumbers;

    // Unified handling for Swedish number forms (0-9)
    // We check for "incorrect" forms (e.g., bare numbers or nouns) and ensure we return the user's specific choice
    // if it matches an incorrect form, to allow the validator to flag it.
    if (mode === 'swedish' && /^[0-9]$/.test(normalized)) {
        const digitVariants = {
            '0': { correct: 'nolla', incorrect: ['noll'] },
            '1': { correct: 'ett', incorrect: ['etta', 'en'] },
            '2': { correct: 'tvåa', incorrect: ['två'] },
            '3': { correct: 'trea', incorrect: ['tre'] },
            '4': { correct: 'fyra', incorrect: ['fyr'] }, // "Fyra" is usually correct. "Fyr" is incorrect/slang.
            '5': { correct: 'femma', incorrect: ['fem'] },
            '6': { correct: 'sexa', incorrect: ['sex'] },
            '7': { correct: 'sju', incorrect: ['sjua'] }, // "Sju" is generally standard in radio, "sjua" is the noun.
            '8': { correct: 'åtta', incorrect: ['ått'] }, // Uncommon but consistent pattern
            '9': { correct: 'nia', incorrect: ['nio'] }
        };

        const variant = digitVariants[normalized];
        if (variant) {
            // Check alternatives for incorrect forms
            const allTranscripts = [transcript, ...alternatives.map(a => a.transcript)].join(' ').toLowerCase();
            const words = allTranscripts.split(/[^a-zåäö0-9]+/);

            // If we explicitly find an INCORRECT form as a whole word, we prioritize returning it 
            // so strict validation fails.
            for (const badForm of variant.incorrect) {
                if (words.includes(badForm)) {
                    return badForm;
                }
            }

            // If no incorrect form is found, return the correct form (mapped from the digit)
            return variant.correct;
        }
    }

    // 1. If it's a digit, map it directly (fallback for non-Swedish or unhandled digits)
    if (numberMap[normalized]) {
        return numberMap[normalized];
    }


    // Explicit hyphen handling
    if (mode === 'swedish' && ['streck', 'minus'].includes(normalized)) return 'bindestreck';
    if (mode === 'nato' && ['dash', 'minus'].includes(normalized)) return 'hyphen';

    // 2. Handle common phonetic mis-transcriptions and aliases (Truncted for test as not needed for digits)
    return normalized;
};


const runTests = () => {
    const tests = [
        { normalized: '1', transcript: '1', alts: ['etta'], expected: 'etta', mode: 'swedish' },
        { normalized: '1', transcript: '1', alts: ['ett'], expected: 'ett', mode: 'swedish' },
        { normalized: '2', transcript: '2', alts: ['två'], expected: 'två', mode: 'swedish' }, // incorrect
        { normalized: '2', transcript: '2', alts: ['tvåa'], expected: 'tvåa', mode: 'swedish' }, // correct
        { normalized: '3', transcript: '3', alts: ['tre'], expected: 'tre', mode: 'swedish' }, // incorrect
        { normalized: '3', transcript: '3', alts: ['trea'], expected: 'trea', mode: 'swedish' }, // correct
        { normalized: '7', transcript: '7', alts: ['sjua'], expected: 'sjua', mode: 'swedish' }, // incorrect
        { normalized: '7', transcript: '7', alts: ['sju'], expected: 'sju', mode: 'swedish' }, // correct
        { normalized: '4', transcript: '4', alts: ['fyr'], expected: 'fyr', mode: 'swedish' }, // incorrect
        { normalized: '4', transcript: '4', alts: ['fyra'], expected: 'fyra', mode: 'swedish' }, // correct
    ];

    let passed = 0;
    let failed = 0;

    console.log('--- Starting Verification (Embedded) ---');
    tests.forEach((t, i) => {
        // Mock alternatives structure
        const alternatives = t.alts.map(a => ({ transcript: a }));

        const result = normalizeResult(t.transcript, alternatives, t.mode);

        if (result === t.expected) {
            console.log(`Test ${i + 1} PASSED: Input "digit ${t.normalized}" with alts [${t.alts}] -> Got "${result}"`);
            passed++;
        } else {
            console.error(`Test ${i + 1} FAILED: Input "digit ${t.normalized}" with alts [${t.alts}] -> Expected "${t.expected}", Got "${result}"`);
            failed++;
        }
    });

    console.log(`--- Summary: ${passed} Passed, ${failed} Failed ---`);
};

runTests();
