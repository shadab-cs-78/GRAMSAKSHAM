import React, { useState, useEffect, useRef } from 'react';
import { X, Mic } from 'lucide-react';
import { createSpeechRecognizer } from '../../utils/speechHelper';

export default function Screen7VoiceListening({ onComplete, onCancel }) {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(true);
  const recognizerRef = useRef(null);

  useEffect(() => {
    // Start Web Speech API Speech-to-Text
    const recognizer = createSpeechRecognizer(
      'hi-IN',
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal && text.trim().length > 2) {
          // If speech is final, proceed after brief pause
          setTimeout(() => {
            onComplete(text);
          }, 1200);
        }
      },
      (err) => {
        console.warn("STT Error:", err);
      },
      () => {
        setIsListening(false);
      }
    );

    if (recognizer) {
      try {
        recognizer.start();
        recognizerRef.current = recognizer;
      } catch (err) {
        console.warn("Could not start recognizer:", err);
      }
    }

    return () => {
      if (recognizerRef.current) {
        try {
          recognizerRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const handleStop = () => {
    if (recognizerRef.current) {
      try { recognizerRef.current.stop(); } catch (e) {}
    }
    onComplete(transcript || '10वीं पास और इलेक्ट्रीशियन काम में रुचि');
  };

  const handleSimulateQuickPhrase = (phrase) => {
    setTranscript(phrase);
    setTimeout(() => {
      onComplete(phrase);
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col justify-between items-center text-center min-h-[calc(100vh-140px)]">
      <div className="w-full">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-1">
          मैं सुन रही हूँ...
        </h2>
        <p className="text-emerald-700 text-lg font-bold">
          I am listening...
        </p>

        {/* Central Audio Wave & Mic Visualization */}
        <div className="my-10 flex flex-col items-center justify-center">
          {/* Animated Waveform Bars */}
          <div className="flex items-center gap-2 h-16 mb-8">
            <div className="w-2.5 bg-emerald-500 rounded-full animate-voice-1"></div>
            <div className="w-2.5 bg-emerald-600 rounded-full animate-voice-2"></div>
            <div className="w-2.5 bg-emerald-400 rounded-full animate-voice-3"></div>
            <div className="w-2.5 bg-emerald-500 rounded-full animate-voice-4"></div>
            <div className="w-2.5 bg-emerald-700 rounded-full animate-voice-5"></div>
            <div className="w-2.5 bg-emerald-400 rounded-full animate-voice-2"></div>
            <div className="w-2.5 bg-emerald-600 rounded-full animate-voice-1"></div>
          </div>

          {/* Big Pulsing Microphone Button */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xl shadow-emerald-700/40 border-4 border-white animate-pulse">
              <Mic className="w-14 h-14" />
            </div>
            {/* Pulsing Outer Rings */}
            <div className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping opacity-30 pointer-events-none"></div>
          </div>

          <p className="text-slate-700 text-lg sm:text-xl font-bold mt-8">
            कृपया अपनी बात पूरी करें
          </p>
          <p className="text-slate-500 text-sm font-medium">
            Please complete your answer
          </p>

          {/* Real-time transcribed text display */}
          <div className="mt-6 w-full max-w-lg p-4 rounded-2xl bg-white border-2 border-emerald-200 shadow-sm min-h-[70px] flex items-center justify-center">
            {transcript ? (
              <span className="text-slate-900 text-lg font-bold">
                "{transcript}"
              </span>
            ) : (
              <span className="text-slate-400 text-sm italic">
                (माइक पर बोलें... उदाहरण: "मैं 10वीं पास हूँ और बिजली का काम सीखना चाहता हूँ")
              </span>
            )}
          </div>

          {/* Demo quick simulation pills for testing without mic */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center max-w-lg">
            <span className="text-xs text-slate-400 font-semibold w-full">त्वरित परीक्षण / Quick Demo Phrases:</span>
            <button
              onClick={() => handleSimulateQuickPhrase("मैं 10वीं पास हूँ और बिजली का काम सीखना है")}
              className="text-xs bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 px-3 py-1 rounded-full border border-slate-200 transition-colors cursor-pointer"
            >
              "10वीं पास, इलेक्ट्रीशियन"
            </button>
            <button
              onClick={() => handleSimulateQuickPhrase("मोबाइल रिपेयरिंग और दुकान खोलनी है")}
              className="text-xs bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 px-3 py-1 rounded-full border border-slate-200 transition-colors cursor-pointer"
            >
              "मोबाइल रिपेयरिंग, स्वरोजगार"
            </button>
            <button
              onClick={() => handleSimulateQuickPhrase("सिलाई और बुटीक का काम घर से करना है")}
              className="text-xs bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 px-3 py-1 rounded-full border border-slate-200 transition-colors cursor-pointer"
            >
              "सिलाई मशीन ऑपरेटर"
            </button>
          </div>
        </div>
      </div>

      {/* Stop / Cancel Button matching wireframe */}
      <div className="w-full pt-4 border-t border-slate-200 flex justify-center">
        <button
          onClick={handleStop}
          className="px-8 py-3 rounded-2xl border-2 border-red-300 bg-red-50 hover:bg-red-100 text-red-700 font-black text-lg flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
        >
          <X className="w-6 h-6 stroke-[3]" />
          <span>रोकें / Stop</span>
        </button>
      </div>
    </div>
  );
}
