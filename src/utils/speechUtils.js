/**
 * Normalizes speech input based on the active alphabet mode.
 * Handles the digit conversion problem (e.g., "1" -> "ett" in Swedish).
 */
export const normalizeResult = (transcript, alternatives = [], alphabetMode, targetChar) => {
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

    // Strict check for Swedish numbers where 'bare' forms (tre) are wrong
    // We assume the digit (e.g. "3") means the correct form ("trea") unless we see evidence otherwise.
    if (mode === 'swedish' && ['0', '2', '3', '5', '6', '9'].includes(normalized)) {
        const digitForms = {
            '0': { correct: 'nolla', bare: 'noll' },
            '2': { correct: 'tvåa', bare: 'två' },
            '3': { correct: 'trea', bare: 'tre' },
            '5': { correct: 'femma', bare: 'fem' },
            '6': { correct: 'sexa', bare: 'sex' },
            '9': { correct: 'nia', bare: 'nio' }
        };

        const form = digitForms[normalized];
        const allTranscripts = [transcript, ...alternatives.map(a => a.transcript)].join(' ').toLowerCase();

        // If we explicitly find the WRONG bare form ("tre"), we use it to mark the user wrong.
        // But we must be careful: "trea" contains "tre". So we check for word boundaries or exact match?
        // Actually, let's keep it simple: If we see the digit '3', we accept it as 'trea' (correct).
        // If we really want to punish 'tre', we'd need better data. 
        // For now, let's just Fix the bug where '3' was failing.
        // So we default to returning the value from numberMap, which is now the CORRECT form.

        // Detailed check (optional): If we find "tre" but NOT "trea"? 
        // RegExp to find 'tre' as a whole word, not part of 'trea'
        const bareRegex = new RegExp(`\\b${form.bare}\\b`, 'i');
        const correctRegex = new RegExp(`\\b${form.correct}\\b`, 'i');

        if (bareRegex.test(allTranscripts) && !correctRegex.test(allTranscripts)) {
            return form.bare;
        }

        return numberMap[normalized];
    }

    // 1. If it's a digit, map it directly
    if (numberMap[normalized]) {
        // SPECIAL CASE for Swedish "ett" vs "etta"
        // Target is "ett". If user says "etta", it's wrong.
        if (mode === 'swedish' && normalized === '1') {
            const hasEtta = alternatives.some(alt => alt.transcript.toLowerCase().includes('etta'));
            if (hasEtta) return 'etta';
            return 'ett';
        }
        return numberMap[normalized];
    }

    // 2. Handle common phonetic mis-transcriptions and aliases
    const aliases = {
        'gustaf': 'gustav',
        'qvintus': 'quintus',
        'zäta': 'zeta',
        'caesar': 'cesar', // Fixes "Caesar" -> "Cesar" mismatch
    };

    if (aliases[normalized]) {
        return aliases[normalized];
    }

    return normalized;
};

export class SpeechHandler {
    constructor(onResult, onError, onEnd, lang = 'sv-SE') {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            throw new Error('Speech Recognition not supported in this browser.');
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = lang;
        this.recognition.maxAlternatives = 5;

        this.recognition.onresult = (event) => {
            // Only process final results to avoid double-counting interim words
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    const result = event.results[i];
                    const alternatives = Array.from(result);
                    const transcript = result[0].transcript;
                    onResult(transcript, alternatives);
                }
            }
        };

        this.recognition.onerror = onError;
        this.recognition.onend = onEnd;
    }

    start() {
        try {
            this.recognition.start();
        } catch (e) {
            console.error('Speech recognition start error:', e);
        }
    }

    stop() {
        this.recognition.stop();
    }
}
