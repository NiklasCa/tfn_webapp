import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, RefreshCw, Trophy, AlertCircle, Settings2 } from 'lucide-react';
import { ALPHABETS, COMMON_WORDS } from './data/alphabets';
import { SpeechHandler, normalizeResult } from './utils/speechUtils';

function App() {
  const [mode, setMode] = useState('swedish'); // 'swedish' | 'nato'
  const [currentWord, setCurrentWord] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const [normalizedTranscript, setNormalizedTranscript] = useState('');
  const [status, setStatus] = useState('Välj läge och tryck på Starta');
  const [results, setResults] = useState([]); // All results for the current word
  const [lastResults, setLastResults] = useState([]); // Results for the very last speech event
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const charIndexRef = useRef(0);
  const speechRef = useRef(null);

  useEffect(() => {
    pickNewWord();
  }, [mode]);

  const pickNewWord = () => {
    const word = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
    setCurrentWord(word.toUpperCase());
    setCharIndex(0);
    charIndexRef.current = 0;
    setResults([]);
    setLastResults([]);
    setLastTranscript('');
    setNormalizedTranscript('');
    setStatus('Redo! Tryck på mikrofonen för att börja bokstavera.');
  };

  const startListening = () => {
    if (isListening) return;

    // Reset progress for a fresh attempt on the current word
    setCharIndex(0);
    charIndexRef.current = 0;
    setResults([]);
    setLastResults([]);
    setLastTranscript('');
    setNormalizedTranscript('');

    try {
      const lang = mode === 'swedish' ? 'sv-SE' : 'en-US';
      speechRef.current = new SpeechHandler(
        handleSpeechResult,
        handleSpeechError,
        () => setIsListening(false),
        lang
      );
      speechRef.current.start();
      setIsListening(true);
      setStatus('Lyssnar...');
    } catch (err) {
      setStatus('Fel vid mikrofonstart: ' + err.message);
    }
  };

  const handleSpeechResult = (transcript, alternatives) => {
    console.log('--- Speech Debug ---');
    console.log('Raw Transcript:', transcript);
    const alphabet = ALPHABETS[mode];
    // Create a Set of all known words in lowercase for fast lookup
    const alphabetWords = new Set([
      ...Object.values(alphabet.letters).map(v => v.toLowerCase()),
      ...Object.values(alphabet.numbers).map(v => v.toLowerCase()),
      ...Object.values(alphabet.symbols || {}).map(v => v.toLowerCase())
    ]);

    // Split transcript into words and expand tokens like "z-789" or "olof-2026"
    const rawWords = transcript.split(/\s+/).filter(w => w.trim().length > 0);
    const words = [];

    rawWords.forEach(w => {
      const normalizedW = w.toLowerCase().replace(/[.,!?]/g, '').trim();

      // If it's ALREADY a known word, DON'T split it
      if (alphabetWords.has(normalizedW)) {
        words.push(w);
        return;
      }

      // If it's a mix (e.g., "olof-2026"), try to parse it more carefully
      if (/[0-9-]/.test(w)) {
        // This regex splits on hyphens and digit sequences while keeping them as tokens
        const parts = w.split(/([-]|[0-9]+)/).filter(p => p && p.trim().length > 0);
        parts.forEach(p => {
          const pNorm = p.toLowerCase().trim();
          if (alphabetWords.has(pNorm)) {
            words.push(p);
          } else if (/^[0-9]+$/.test(p)) {
            // Split "2026" into "2", "0", "2", "6"
            words.push(...p.split(''));
          } else {
            // It's some letters that aren't a known word, e.g. "NATO" or "olof" (if not in dict)
            // If it's short, keep it, if it's a sequence of letters, split it
            if (p.length > 1 && !alphabetWords.has(pNorm)) {
              words.push(...p.split(''));
            } else {
              words.push(p);
            }
          }
        });
      } else if (w.length > 1 && !alphabetWords.has(normalizedW) && !alphabet.letters[w.toUpperCase()]) {
        // It's a sequence of letters like "ABC" or a misheard word like "Access"
        // We only split if it's all uppercase AND short (likely a spelled word or abbreviation)
        const isUppercase = /^[A-ZÅÄÖ]+$/.test(w);
        if (isUppercase && w.length <= 4) {
          words.push(...w.split(''));
        } else {
          // It's likely a misheard word or a long acronym, keep it as one token
          words.push(w);
        }
      } else {
        words.push(w);
      }
    });

    // --- Improved Alignment Logic (DP) ---
    // Match newly spoken 'words' against the *remaining* characters in currentWord.

    // 1. Determine where we start matching from
    const startIndex = charIndexRef.current;

    if (startIndex >= currentWord.length) {
      // User kept talking after word was done, log as extra but don't crash
      if (words.length > 0) {
        console.log('Extra words after end:', words);
        const extraResults = words.map(w => ({ transcript: w, correct: false, expected: '(okänt)' }));
        setLastResults(extraResults);
        setLastTranscript(transcript);
        setNormalizedTranscript(words.join(' '));
      }
      return;
    }

    // 2. Prepare the Targets (remaining characters) and Sources (spoken words)
    const endpoints = currentWord.slice(startIndex).split('');
    const n = endpoints.length;
    const m = words.length;

    // 3. Build DP Matrix for Needleman-Wunsch-like alignment
    // dp[i][j] = best score alignment for first i targets and first j words
    const dp = Array(n + 1).fill().map(() => Array(m + 1).fill(-Infinity));
    const ptr = Array(n + 1).fill().map(() => Array(m + 1).fill(null));

    dp[0][0] = 0;

    for (let i = 0; i <= n; i++) {
      for (let j = 0; j <= m; j++) {
        // Option 1: Skip Target (User missed a letter) -> Penalty
        if (i < n) {
          const score = dp[i][j] - 2; // Penalty for skipping a target letter
          if (score > dp[i + 1][j]) {
            dp[i + 1][j] = score;
            ptr[i + 1][j] = 'Up'; // 'Up' means we advanced in Target (i) but consumed no Word (j)
          }
        }

        // Option 2: Skip Spoken Word (Noise/Extra) -> Penalty
        if (j < m) {
          // Increase penalty for Noise to -3 so the algorithm prefers Mismatch (-2) over Noise (-3)
          const score = dp[i][j] - 3;
          if (score > dp[i][j + 1]) {
            dp[i][j + 1] = score;
            ptr[i][j + 1] = 'Left'; // 'Left' means we advanced in Words (j) but consumed no Target (i)
          }
        }

        // Option 3: Attempt Match
        if (i < n && j < m) {
          const tChar = endpoints[i];
          const sWord = words[j];
          const expected = alphabet.letters[tChar] || alphabet.numbers[tChar] || alphabet.symbols[tChar];
          const norm = normalizeResult(sWord, alternatives, mode, tChar);

          // Check match
          const isMatch = norm && expected && norm.toLowerCase() === expected.toLowerCase();
          const matchScore = isMatch ? 10 : -2; // Penalty for mismatch is -2, cheaper than Noise (-3)

          const score = dp[i][j] + matchScore;
          if (score > dp[i + 1][j + 1]) {
            dp[i + 1][j + 1] = score;
            ptr[i + 1][j + 1] = isMatch ? 'Match' : 'Mismatch';
          }
        }
      }
    }

    // 4. Find the best "End State"
    // We assume the user stopped speaking after 'words', so we must be in column m.
    // We want the highest score in the last column (meaning we consumed all spoken words).
    let bestI = 0;
    let maxScore = -Infinity;

    for (let i = 0; i <= n; i++) {
      if (dp[i][m] >= maxScore) {
        maxScore = dp[i][m];
        bestI = i;
      }
    }

    // 5. Backtrack to reconstruct the path
    let i = bestI;
    let j = m;
    const spokenResults = []; // For "DU SA" display
    const newCorrectResults = []; // For updating the main word display

    // We build the list backwards
    while (i > 0 || j > 0) {
      const move = ptr[i][j];

      // Fallback/Safety break
      if (!move) {
        if (j > 0) { j--; } else { i--; }
        continue;
      }

      // Merge Logic check: "Left" (Noise) followed by "Up" (Miss) -> "Mismatch"
      const isNoise = move === 'Left';
      let merged = false;

      if (isNoise && j > 0 && i > 0) {
        // Check if previous move was Up
        if (ptr[i][j - 1] === 'Up') {
          // MERGE!
          const tChar = endpoints[i - 1]; // The skipped target
          const sWord = words[j - 1];     // The noise word
          const expected = alphabet.letters[tChar] || alphabet.numbers[tChar] || alphabet.symbols[tChar];
          const norm = normalizeResult(sWord, alternatives, mode, tChar);

          const res = {
            char: tChar,
            correct: false,
            transcript: norm,
            expected: expected
          };

          spokenResults.unshift({
            transcript: sWord,
            correct: false,
            expected: expected // SHOW EXPECTED
          });

          newCorrectResults.unshift({
            ...res,
            index: startIndex + (i - 1)
          });

          j--;
          i--;
          merged = true;
        }
      }

      if (merged) continue;

      if (move === 'Match' || move === 'Mismatch') {
        const tChar = endpoints[i - 1];
        const sWord = words[j - 1];
        const expected = alphabet.letters[tChar] || alphabet.numbers[tChar] || alphabet.symbols[tChar];
        const norm = normalizeResult(sWord, alternatives, mode, tChar);

        const res = {
          char: tChar,
          correct: move === 'Match',
          transcript: norm,
          expected: expected
        };

        spokenResults.unshift({
          transcript: sWord,
          correct: move === 'Match',
          expected: expected
        });

        newCorrectResults.unshift({
          ...res,
          index: startIndex + (i - 1)
        });

        i--;
        j--;

      } else if (move === 'Left') {
        // Skipped spoken word (Noise / Extra) - truly extra, matches nothing nearby
        spokenResults.unshift({
          transcript: words[j - 1],
          correct: false,
          expected: '?' // Removed parens to fix ((?)) bug
        });
        j--;

      } else if (move === 'Up') {
        // Skipped target (Missed letter) - silent miss
        const tChar = endpoints[i - 1];
        const expected = alphabet.letters[tChar] || alphabet.numbers[tChar] || alphabet.symbols[tChar];

        newCorrectResults.unshift({
          char: tChar,
          correct: false,
          transcript: '', // Nothing said
          expected: expected,
          index: startIndex + (i - 1)
        });

        i--;
      }
    }

    // 6. Update State
    let correctCount = 0;

    setResults(prev => {
      const next = [...prev];
      // Update only the positions we touched
      newCorrectResults.forEach(res => {
        next[res.index] = res;
        if (res.correct) correctCount++;
      });
      return next;
    });

    setLastResults(spokenResults);

    setStats(prev => ({
      correct: prev.correct + correctCount,
      total: prev.total + spokenResults.length
    }));

    // Advance the charIndex by how many targets we effectively covered (bestI)
    const newIndex = startIndex + bestI;
    setCharIndex(newIndex);
    charIndexRef.current = newIndex;

    setLastTranscript(transcript);
    setNormalizedTranscript(words.join(' '));

    if (newIndex >= currentWord.length) {
      setStatus('Klart! Bra jobbat.');
      setIsListening(false);
      if (speechRef.current) speechRef.current.stop();
    } else {
      setStatus('Fortsätt bokstavera...');
    }
  };

  const handleSpeechError = (event) => {
    if (event.error === 'no-speech') {
      setStatus('Inget tal identifierades.');
    } else {
      setStatus('Ett fel uppstod: ' + event.error);
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      if (speechRef.current) speechRef.current.stop();
      setIsListening(false);
    } else {
      startListening();
    }
  };

  const getCharHint = (char) => {
    const alphabet = ALPHABETS[mode];
    return alphabet.letters[char] || alphabet.numbers[char] || alphabet.symbols[char] || char;
  };

  return (
    <div className="app-container">
      <header>
        <h1>Bokstaverings-Tränaren</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          Träna på det svenska och NATO-alfabetet med rösten
        </p>
      </header>

      <main className="card">
        <div className="mode-selector">
          <button
            className={`btn btn-outline ${mode === 'swedish' ? 'btn-active' : ''}`}
            onClick={() => setMode('swedish')}
          >
            Svenska (H-SB-TFN)
          </button>
          <button
            className={`btn btn-outline ${mode === 'nato' ? 'btn-active' : ''}`}
            onClick={() => setMode('nato')}
          >
            NATO (ICAO)
          </button>
        </div>

        <div className="current-word">
          <div className="word-display">
            {currentWord.split('').map((char, index) => {
              const res = results[index];
              let className = "char-item";
              if (res) {
                className += res.correct ? " correct" : " incorrect";
              } else if (index === charIndex) {
                className += " active";
              }

              return (
                <span key={index} className={className}>
                  {char}
                </span>
              );
            })}
          </div>
          <div className="char-hint">
            Uttala: <strong>{getCharHint(currentWord[charIndex])}</strong>
          </div>
        </div>

        <div className="mic-container">
          <button
            className={`mic-button ${isListening ? 'listening' : ''}`}
            onClick={toggleListening}
            title={isListening ? "Stoppa" : "Starta mikrofonen"}
          >
            {isListening ? <Mic size={32} /> : <MicOff size={32} />}
          </button>
          <div className="status-text">{status}</div>
        </div>

        {lastTranscript && (
          <div className="last-transcription">
            <div className="transcription-header">Du sa:</div>
            <div className="transcription-text" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
              {lastResults.map((res, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span className={res.correct ? 'correct-indicator' : 'incorrect-indicator'}>
                    {res.transcript}
                  </span>
                  {!res.correct && (
                    <span style={{ fontSize: '0.7rem', opacity: 0.8, color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      ({res.expected})
                    </span>
                  )}
                </div>
              ))}
              {lastTranscript && (
                <div style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '0.5rem', width: '100%', textAlign: 'center' }}>
                  Hörde: "{lastTranscript}"
                </div>
              )}
            </div>
          </div>
        )}

        <div className="stats">
          <div className="stat-item">
            <span className="stat-value">{stats.correct}</span>
            <span className="stat-label">Rätt</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Totalt</span>
          </div>
          <div className="stat-item">
            <button className="btn btn-outline" onClick={pickNewWord} style={{ marginTop: '0.5rem' }}>
              <RefreshCw size={18} /> Nytt ord
            </button>
          </div>
        </div>
      </main>

      <footer style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
        <p>Tips: Säg siffra som text (t.ex. "nolla" istället för "noll")</p>
      </footer>
    </div>
  );
}

export default App;
