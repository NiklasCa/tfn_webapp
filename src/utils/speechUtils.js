/**
 * Normalizes speech input based on the active alphabet mode.
 * Handles the digit conversion problem (e.g., "1" -> "ett" in Swedish).
 */
export const normalizeResult = (transcript, alternatives = [], alphabetMode, targetChar, hints = []) => {
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

    // Detailed handling for Swedish number forms (0-9)
    if (mode === 'swedish') {
        const digitVariants = {
            '0': { correct: 'nolla', incorrect: [] },
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
            // standard \b in JS doesn't treat åäö as word characters, so we tokenize manually
            // We now include HINTS (interim words) in the search space!
            const allTranscripts = [
                transcript,
                ...alternatives.map(a => a.transcript),
                ...hints
            ].join(' ').toLowerCase();

            const words = allTranscripts.split(/[^a-zåäö0-9]+/);
            // Unique words to avoid redundant checks
            const uniqueWords = new Set(words);

            // Gathers all candidates: correct form + all incorrect forms
            const candidates = [variant.correct, ...variant.incorrect];

            // Find which candidates appear in the words
            const matches = candidates.filter(c => uniqueWords.has(c));

            if (matches.length > 0) {
                // Sort by length OBS: Prioritize LONGER matches
                // e.g. "trea" (4) > "tre" (3). If both appear, user likely said "trea".
                // e.g. "etta" (4) > "ett" (3). If both appear, user likely said "etta".
                matches.sort((a, b) => b.length - a.length);
                return matches[0];
            }

            // If no forms are explicitly found (unlikely if digit was recognized, but possible if digit came from "753" block)
            // we default to the correct form.
            return variant.correct;
        }
    }

    // 1. If it's a digit (and not handled above or not swedish), map it directly
    if (numberMap[normalized]) {
        return numberMap[normalized];
    }


    // Explicit hyphen handling
    if (mode === 'swedish' && ['streck', 'minus'].includes(normalized)) return 'bindestreck';
    if (mode === 'nato' && ['dash', 'minus'].includes(normalized)) return 'hyphen';

    // 2. Handle common phonetic mis-transcriptions and aliases
    const aliases = {
        'gustaf': 'gustav',
        'qvintus': 'quintus',
        'zeta': 'zäta',     // Zeta -> Zäta
        'z': 'zäta',        // Z -> Zäta
        'q': 'qvintus',     // Q -> Qvintus
        'caesar': 'cesar', // Fixes "Caesar" -> "Cesar" mismatch
        'särkses': 'xerxes', // Alias for Xerxes
        'serxes': 'xerxes',  // Alias for Xerxes
        'saxes': 'xerxes',   // Alias for Xerxes
        'zaxes': 'xerxes',   // Alias for Xerxes
        'x': 'xerxes',   // Alias for Xerxes
        'sigrid': 'sigurd',   // Alias for Sigurd
        'nya': 'nia',         // Alias for Nia
        'mia': 'nia',         // Alias for Nia
        'femman': 'femma',    // Alias for Femma
        'noll': 'nolla',      // Alias for Nolla
        'sigud': 'sigurd',    // Alias for Sigurd
        'sigood': 'sigurd',   // Alias for Sigurd
    };

    if (aliases[normalized]) {
        return aliases[normalized];
    }

    return normalized;
};

/**
 * Pre-processes the raw transcript to fix common merge errors or misinterpretations
 * BEFORE splitting into words.
 */
export const preProcessTranscript = (transcript) => {
    let t = transcript.toLowerCase();

    // Fix "Zäta Petter" -> "zetter"
    t = t.replace(/\bzetter\b/g, 'zäta petter');

    // Add other common phrase fixes here if needed

    return t;
};

export class GoogleSpeechHandler {
    constructor(onResult, onError, onEnd, lang = 'sv-SE') {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            throw new Error('Speech Recognition not supported in this browser.');
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false; // Disable interim results to fix Mobile Chrome instability
        this.recognition.lang = lang;
        this.recognition.maxAlternatives = 5;

        // Store words seen during interim phases for the current segment
        this.interimWords = new Set();

        this.isExpectedToListen = false; // Track if we WANT to be listening

        this.recognition.onresult = (event) => {
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                const transcript = result[0].transcript;

                if (result.isFinal) {
                    const alternatives = Array.from(result);
                    // Pass the accumulated interim hints
                    onResult(transcript, alternatives, Array.from(this.interimWords));

                    // Reset for next segment
                    this.interimWords.clear();
                } else {
                    // Collect words from interim results
                    // We split by space to get individual words (e.g., "en", "etta", "två")
                    // even if they later get merged into "12".
                    const words = transcript.toLowerCase().split(/[\s.,!?]+/);
                    words.forEach(w => {
                        if (w && w.length > 0) this.interimWords.add(w);
                    });
                }
            }
        };

        this.recognition.onerror = (event) => {
            // If not-allowed or duplicate start, we shouldn't force restart
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                this.isExpectedToListen = false;
            }
            onError(event);
        };

        this.recognition.onend = () => {
            // Auto-restart if we expected to be listening (Mobile Chrome fix)
            if (this.isExpectedToListen) {
                console.log('Speech ended but expected to listen. Restarting...');
                try {
                    this.recognition.start();
                } catch (e) {
                    console.error('Restart failed:', e);
                    onEnd(); // Give up if restart fails
                }
            } else {
                onEnd();
            }
        };
    }

    start() {
        this.isExpectedToListen = true;
        try {
            this.recognition.start();
        } catch (e) {
            console.error('Speech recognition start error:', e);
        }
    }

    stop() {
        this.isExpectedToListen = false;
        this.recognition.stop();
    }
}

