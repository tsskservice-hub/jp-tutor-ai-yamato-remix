import { useState, useEffect } from "react";
import { type MetaFunction } from "react-router";

// JSONファイルをインポート（プロジェクトのディレクトリ構造に合わせてパスを調整してください）
import questionDataRaw from "~/data/oral-exam-questions.json";

export const meta: MetaFunction = () => {
  return [
    { title: "VCE Japanese Oral Exam - Free Audio Resources | JPTutor AI Yamato" },
    { name: "description", content: "VCE Japanese EOY Oral Exam Free Audio Resources" },
  ];
};

type QuestionItem = {
  category: string;
  text: string;
  audio?: string; // 実際の音声ファイルパス
};

type QuestionData = {
  beforeSec1: {
    steady: QuestionItem[];
    normal: QuestionItem[];
    Accelerated: QuestionItem[];
  };
  sec1: {
    steady: QuestionItem[];
    normal: QuestionItem[];
    Accelerated: QuestionItem[];
  };
  sec2: {
    steady: QuestionItem[];
    normal: QuestionItem[];
    Accelerated: QuestionItem[];
  };
  afterSec2: {
    steady: QuestionItem[];
    normal: QuestionItem[];
    Accelerated: QuestionItem[];
  };
};

const questionData: QuestionData = questionDataRaw as QuestionData;

export default function OralExamQuestions() {
  const [currentSection, setCurrentSection] = useState<"beforeSec1" | "sec1" | "sec2" | "afterSec2">("sec1");
  const [currentPace, setCurrentPace] = useState<"steady" | "normal" | "Accelerated">("steady");
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  
  // 🚀 追従型の上に戻るボタン用のステートとスクロール監視
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handlePlayAudio = (item: QuestionItem, index: number) => {
    // 実際の音声ファイルが指定されている場合はそちらを優先再生
    if (item.audio) {
      const audio = new Audio(item.audio);
      setPlayingIndex(index);
      audio.play().catch(() => {
        alert("音声ファイルの再生に失敗しました。");
        setPlayingIndex(null);
      });
      audio.onended = () => setPlayingIndex(null);
      audio.onerror = () => {
        setPlayingIndex(null);
      };
      return;
    }

    // 音声ファイルがない場合はブラウザの音声合成機能を利用
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("お使いのブラウザは音声読み上げに対応していません。");
      return;
    }

    window.speechSynthesis.cancel();
    // <ruby>タグなどのHTMLタグが含まれる場合は、読み上げ用にテキスト部分だけを抽出しやすくする、あるいはそのまま使う
    const plainText = item.text.replace(/<[^>]*>?/gm, '');
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.lang = "ja-JP";
    utterance.rate = currentPace === "steady" ? 0.85 : currentPace === "Accelerated" ? 1.05 : 0.95;

    setPlayingIndex(index);

    utterance.onend = () => {
      setPlayingIndex(null);
    };
    utterance.onerror = () => {
      setPlayingIndex(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const activeItems = questionData[currentSection][currentPace];

  return (
    <div className="bg-amber-50 min-h-screen text-slate-800 flex flex-col justify-between font-sans relative">
      {/* Header / Nav */}
      <header className="bg-white/90 backdrop-blur-md border-b border-amber-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          <a
            href="/"
            className="flex items-center gap-3 no-underline group cursor-pointer"
          >
            <img
              src="/jptutoraiyamato.png"
              alt="JPTutor AI Yamato Logo"
              className="h-10 w-auto transition-transform group-hover:scale-105"
            />
            <div>
              <h1 className="font-bold text-xl text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">Japanese Tutor AI Yamato</h1>
              <p className="text-xs text-amber-700 font-medium">VCE Japanese EOY Oral Exam Free Audio Resources</p>
            </div>
          </a>
                
          <a
            href="/#vce-app"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-md transition transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span>🚀 Oral Exam AI Tutor App</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-10 flex-grow w-full">
        {/* Hero Section */}
        <div className="bg-white border-2 border-amber-300 rounded-2xl p-6 sm:p-8 shadow-xl mb-10 text-center relative overflow-hidden">
          <div className="absolute -right-1 -bottom-1 text-amber-100 text-9xl select-none pointer-events-none">🎙️</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
            VCE Oral Exam: Frequently Used Examiner Questions Audio Library
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-6">
            Listen to authentic examiner questions with exam-style speed and pronunciation. Switch between learning paces and sections to start improving your listening skills!
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="/#vce-app"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-xl shadow-xs transition text-sm flex items-center gap-2"
            >
              <span>✨ Try AI Tutor</span>
            </a>
          </div>
        </div>

        {/* Controls / Filter Section */}
        <div className="bg-amber-100/70 border border-amber-300 rounded-2xl p-5 mb-8 shadow-inner flex flex-col md:flex-row gap-6 justify-between items-center">
          {/* Section Selector */}
          <div className="w-full md:w-auto">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">Select Section</label>
            <div className="inline-flex flex-wrap rounded-xl bg-white p-1 shadow-xs border border-amber-200 w-full sm:w-auto gap-1">
              <button
                type="button"
                onClick={() => setCurrentSection("beforeSec1")}
                className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition shadow-xs ${
                  currentSection === "beforeSec1"
                    ? "bg-amber-600 text-white"
                    : "text-slate-700 hover:text-amber-700"
                }`}
              >
                Before
              </button>
              <button
                type="button"
                onClick={() => setCurrentSection("sec1")}
                className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition shadow-xs ${
                  currentSection === "sec1"
                    ? "bg-amber-600 text-white"
                    : "text-slate-700 hover:text-amber-700"
                }`}
              >
                Section 1
              </button>
              <button
                type="button"
                onClick={() => setCurrentSection("sec2")}
                className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
                  currentSection === "sec2"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-slate-700 hover:text-amber-700"
                }`}
              >
                Section 2
              </button>
              <button
                type="button"
                onClick={() => setCurrentSection("afterSec2")}
                className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
                  currentSection === "afterSec2"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-slate-700 hover:text-amber-700"
                }`}
              >
                After
              </button>
            </div>
          </div>

          {/* Learning Pace Selector */}
          <div className="w-full md:w-auto">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">Learning Pace</label>
            <div className="inline-flex rounded-xl bg-white p-1 shadow-xs border border-amber-200 w-full sm:w-auto">
              {(["steady", "normal", "Accelerated"] as const).map((pace) => (
                <button
                  key={pace}
                  type="button"
                  onClick={() => setCurrentPace(pace)}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-bold capitalize transition ${
                    currentPace === pace
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-slate-700 hover:text-amber-700"
                  }`}
                >
                  {pace}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Audio Content Display Area */}
        <div className="space-y-4">
          {activeItems.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-amber-200 rounded-xl p-5 shadow-xs hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <span className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {item.category}
                </span>
                {/* 💡 ルビタグ(<ruby>)が挿入された際に対応できるよう dangerouslySetInnerHTML を使用 */}
                <p 
                  className="question-text font-medium text-slate-900 pt-1"
                  dangerouslySetInnerHTML={{ __html: item.text }}
                />
              </div>
              <button
                type="button"
                disabled={playingIndex === index}
                onClick={() => handlePlayAudio(item, index)}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-xs shrink-0 disabled:opacity-60"
              >
                {playingIndex === index ? (
                  <span>⏳ 再生中...</span>
                ) : (
                  <span>🔊 音声を聴く</span>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-12 bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-8 text-white shadow-xl text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-3">Why not take your practice a step beyond just listening to audio and actually have a conversation with an AI?</h3>
          <p className="text-amber-100 text-sm sm:text-base max-w-xl mx-auto mb-6">
            With the EOY Oral Exam AI Tutor app, you can experience a realistic mock oral exam tailored to your level and pace.
          </p>
          <a
            href="/#vce-app"
            className="inline-block bg-white text-amber-800 hover:bg-amber-50 font-extrabold px-8 py-3.5 rounded-full shadow-lg transition transform hover:-translate-y-0.5"
          >
            Check out the app today! 🚀 
          </a>
        </div>
      </main>

      {/* 🚀 追従型の上に戻るボタン */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 p-3.5 bg-white hover:bg-amber-50 rounded-full shadow-xl cursor-pointer transition-all flex items-center justify-center w-12 h-12 border-2 border-emerald-500"
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4l-8 8h5v8h6v-8h5z" />
          </svg>
        </button>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-amber-200 py-6 mt-12 text-center text-xs text-slate-500">
        <p>&copy; 2026 JPTutor AI Yamato. All rights reserved. Designed for VCE Japanese Second Language Students.</p>
      </footer>
    </div>
  );
}