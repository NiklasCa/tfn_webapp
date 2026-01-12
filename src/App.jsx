import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, RefreshCw, Trophy, AlertCircle, Settings2, Cpu, Cloud, ChevronDown, ChevronUp } from 'lucide-react';
import { ALPHABETS } from './data/alphabets';
import { getWordPool } from './data/wordLists';
import { GoogleSpeechHandler, normalizeResult, preProcessTranscript } from './utils/speechUtils';

function App() {
  const [mode, setMode] = useState('swedish'); // 'swedish' | 'nato'
  // Removed engine state, defaulting to Google
  // Default categories: Swedish places and Names
  const [selectedCategories, setSelectedCategories] = useState(new Set(['places_se', 'cities_world', 'names', 'codes']));
  const [showSettings, setShowSettings] = useState(false);

  // Code length settings
  const [codeMin, setCodeMin] = useState(5);
  const [codeMax, setCodeMax] = useState(8);
  const [codeUseLetters, setCodeUseLetters] = useState(true);
  const [codeUseNumbers, setCodeUseNumbers] = useState(true);
  const [codeUseHyphen, setCodeUseHyphen] = useState(true);

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

  // Ensure codeMax is never less than codeMin
  useEffect(() => {
    if (codeMax < codeMin) setCodeMax(codeMin);
  }, [codeMin]);

  const pickNewWord = () => {
    const pool = getWordPool(selectedCategories, codeMin, codeMax, codeUseLetters, codeUseNumbers, codeUseHyphen);
    const word = pool[Math.floor(Math.random() * pool.length)];
    setCurrentWord(word.toUpperCase());
    setCharIndex(0);
    charIndexRef.current = 0;
    setResults([]);
    setLastResults([]);
    setLastTranscript('');
    setNormalizedTranscript('');
    setStatus('Redo! Tryck på mikrofonen för att börja bokstavera.');
  };

  const toggleCategory = (cat) => {
    const newUnknown = new Set(selectedCategories);
    if (newUnknown.has(cat)) {
      if (newUnknown.size > 1) { // Prevent deselecting the last one
        newUnknown.delete(cat);
      }
    } else {
      newUnknown.add(cat);
    }
    setSelectedCategories(newUnknown);
  };

  const startListening = async () => {
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

      setStatus('Startar Google Speech...');

      speechRef.current = new GoogleSpeechHandler(
        handleSpeechResult,
        handleSpeechError,
        () => setIsListening(false),
        lang
      );

      await speechRef.current.start();
      setIsListening(true);
      setStatus('Lyssnar (Google Cloud)...');

    } catch (err) {
      console.error(err);
      setStatus('Fel vid start: ' + err.message);
      setIsListening(false);
    }
  };

  const handleSpeechResult = (transcript, alternatives) => {
    console.log('--- Speech Debug ---');
    console.log('Engine:', engine);
    console.log('Raw Transcript:', transcript);

    const alphabet = ALPHABETS[mode];
    const alphabetWords = new Set([
      ...Object.values(alphabet.letters).map(v => v.toLowerCase()),
      ...Object.values(alphabet.numbers).map(v => v.toLowerCase()),
      ...Object.values(alphabet.symbols || {}).map(v => v.toLowerCase())
    ]);

    const processedTranscript = preProcessTranscript(transcript);
    const rawWords = processedTranscript.split(/\s+/).filter(w => w.trim().length > 0);
    const words = [];

    rawWords.forEach(w => {
      const normalizedW = w.toLowerCase().replace(/[.,!?]/g, '').trim();

      if (alphabetWords.has(normalizedW)) {
        words.push(w);
        return;
      }

      if (/[0-9-]/.test(w)) {
        const parts = w.split(/([-]|[0-9]+)/).filter(p => p && p.trim().length > 0);
        parts.forEach(p => {
          const pNorm = p.toLowerCase().trim();
          if (alphabetWords.has(pNorm)) {
            words.push(p);
          } else if (/^[0-9]+$/.test(p)) {
            words.push(...p.split(''));
          } else {
            if (p.length > 1 && !alphabetWords.has(pNorm)) {
              words.push(...p.split(''));
            } else {
              words.push(p);
            }
          }
        });
      } else if (w.length > 1 && !alphabetWords.has(normalizedW) && !alphabet.letters[w.toUpperCase()]) {
        const isUppercase = /^[A-ZÅÄÖ]+$/.test(w);
        if (isUppercase && w.length <= 4) {
          words.push(...w.split(''));
        } else {
          words.push(w);
        }
      } else {
        words.push(w);
      }
    });

    const startIndex = charIndexRef.current;

    if (startIndex >= currentWord.length) {
      if (words.length > 0) {
        console.log('Extra words after end:', words);
        const extraResults = words.map(w => ({ transcript: w, correct: false, expected: '(okänt)' }));
        setLastResults(extraResults);
        setLastTranscript(transcript);
        setNormalizedTranscript(words.join(' '));
      }
      return;
    }

    const endpoints = currentWord.slice(startIndex).split('');
    const n = endpoints.length;
    const m = words.length;

    const dp = Array(n + 1).fill().map(() => Array(m + 1).fill(-Infinity));
    const ptr = Array(n + 1).fill().map(() => Array(m + 1).fill(null));

    dp[0][0] = 0;

    for (let i = 0; i <= n; i++) {
      for (let j = 0; j <= m; j++) {
        // Option 1: Skip Target (User missed a letter OR it is a Space)
        if (i < n) {
          const isSpace = endpoints[i] === ' ';
          const penalty = isSpace ? 0 : -2;
          // Prefer taking the space if scores are equal (>=) to ensure we advance past it
          const condition = isSpace ? (dp[i][j] + penalty >= dp[i + 1][j]) : (dp[i][j] + penalty > dp[i + 1][j]);

          if (condition) {
            dp[i + 1][j] = dp[i][j] + penalty;
            ptr[i + 1][j] = isSpace ? 'SkipSpace' : 'Up';
          }
        }

        // Option 2: Skip Spoken Word (Noise/Extra) -> Penalty
        if (j < m) {
          const score = dp[i][j] - 3;
          if (score > dp[i][j + 1]) {
            dp[i][j + 1] = score;
            ptr[i][j + 1] = 'Left';
          }
        }

        // Option 3: Attempt Match
        if (i < n && j < m) {
          const tChar = endpoints[i];
          const sWord = words[j];

          if (tChar !== ' ') {
            const expected = alphabet.letters[tChar] || alphabet.numbers[tChar] || alphabet.symbols[tChar];
            const norm = normalizeResult(sWord, alternatives, mode, tChar);

            const isMatch = norm && expected && norm.toLowerCase() === expected.toLowerCase();
            const matchScore = isMatch ? 10 : -2;

            const score = dp[i][j] + matchScore;
            if (score > dp[i + 1][j + 1]) {
              dp[i + 1][j + 1] = score;
              ptr[i + 1][j + 1] = isMatch ? 'Match' : 'Mismatch';
            }
          }
        }
      }
    }

    let bestI = 0;
    let maxScore = -Infinity;

    for (let i = 0; i <= n; i++) {
      if (dp[i][m] >= maxScore) {
        maxScore = dp[i][m];
        bestI = i;
      }
    }

    let i = bestI;
    let j = m;
    const spokenResults = [];
    const newCorrectResults = [];

    while (i > 0 || j > 0) {
      const move = ptr[i][j];

      if (!move) {
        if (j > 0) { j--; } else { i--; }
        continue;
      }

      // Merge Logic (Noise + Miss -> Mismatch)
      const isNoise = move === 'Left';
      let merged = false;

      if (isNoise && j > 0 && i > 0) {
        if (ptr[i][j - 1] === 'Up') {
          const tChar = endpoints[i - 1];
          const sWord = words[j - 1];
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
            expected: expected
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
        // Noise
        spokenResults.unshift({
          transcript: words[j - 1],
          correct: false,
          expected: '?'
        });
        j--;

      } else if (move === 'Up') {
        // Skipped Target
        const tChar = endpoints[i - 1];
        const expected = alphabet.letters[tChar] || alphabet.numbers[tChar] || alphabet.symbols[tChar];

        newCorrectResults.unshift({
          char: tChar,
          correct: false,
          transcript: '',
          expected: expected,
          index: startIndex + (i - 1)
        });

        i--;
      } else if (move === 'SkipSpace') {
        i--;
      }
    }

    let correctCount = 0;

    setResults(prev => {
      const next = [...prev];
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
          Träna på bokstaveringsalfabetet med röstigenkänning
        </p>
      </header>

      <main className="card">
        {/* SETTINGS AREA */}
        <div className="settings-container" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowSettings(!showSettings)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings2 size={16} />
              <span style={{ fontWeight: 500 }}>Inställningar & Ordval</span>
            </div>
            {showSettings ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {showSettings && (
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Mode Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Alfabet:</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className={`btn btn-sm ${mode === 'swedish' ? 'btn-active' : 'btn-outline'}`} onClick={() => setMode('swedish')}>Svenska</button>
                  <button className={`btn btn-sm ${mode === 'nato' ? 'btn-active' : 'btn-outline'}`} onClick={() => setMode('nato')}>NATO</button>
                </div>
              </div>


              {/* Categories Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ordkategorier:</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input type="checkbox" checked={selectedCategories.has('places_se')} onChange={() => toggleCategory('places_se')} />
                    Svenska orter
                  </label>
                  <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input type="checkbox" checked={selectedCategories.has('cities_world')} onChange={() => toggleCategory('cities_world')} />
                    Världsstäder
                  </label>
                  <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input type="checkbox" checked={selectedCategories.has('names')} onChange={() => toggleCategory('names')} />
                    Namn (Mixat)
                  </label>
                  <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input type="checkbox" checked={selectedCategories.has('codes')} onChange={() => toggleCategory('codes')} />
                    Slumpmässiga Koder
                  </label>
                  <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input type="checkbox" checked={selectedCategories.has('mgrs')} onChange={() => toggleCategory('mgrs')} />
                    MGRS Koordinater
                  </label>
                </div>
              </div>

              {/* Code Length Settings (Conditional) */}
              {selectedCategories.has('codes') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px dashed var(--border-color)', padding: '0.5rem', borderRadius: '4px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kodlängd:</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ fontSize: '0.7rem' }}>Min: {codeMin}</label>
                      <input
                        type="range" min="1" max="20"
                        value={codeMin}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setCodeMin(val);
                          if (val > codeMax) setCodeMax(val);
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ fontSize: '0.7rem' }}>Max: {codeMax}</label>
                      <input
                        type="range" min="1" max="20"
                        value={codeMax}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setCodeMax(val);
                          if (val < codeMin) setCodeMin(val);
                        }}

                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={codeUseLetters} onChange={(e) => setCodeUseLetters(e.target.checked)} />
                      Bokstäver
                    </label>
                    <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={codeUseNumbers} onChange={(e) => setCodeUseNumbers(e.target.checked)} />
                      Siffror
                    </label>
                    <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={codeUseHyphen} onChange={(e) => setCodeUseHyphen(e.target.checked)} />
                      Bindestreck (-)
                    </label>
                  </div>
                </div>
              )}

              {/* Manual Input */}
              <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Testa eget ord:</label>
                  <input
                    type="text"
                    placeholder="Skriv ord..."
                    style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        const w = e.target.value.toUpperCase().trim();
                        if (w) {
                          setCurrentWord(w);
                          setCharIndex(0);
                          charIndexRef.current = 0;
                          setResults([]);
                          setLastResults([]);
                          setLastTranscript('');
                          setNormalizedTranscript('');
                          setStatus('Redo! Bokstavera ditt ord.');
                          e.target.value = ''; // clear
                          setShowSettings(false); // auto close settings for better UX
                        }
                      }
                    }}
                  />
                </div>
              </div>

            </div>
          )}
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
                  {char === '0' ? 'Ø' : char}
                </span>
              );
            })}
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

    </div>
  );
}

export default App;
