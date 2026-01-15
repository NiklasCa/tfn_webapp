import { normalizeResult } from './speechUtils.js';

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

    console.log('--- Starting Verification ---');
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
