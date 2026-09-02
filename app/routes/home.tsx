import { useState, useEffect } from "react";
import type { MetaFunction } from "react-router";
import { Sparkles, GraduationCap, BookOpen, Compass, ArrowRight, ShieldCheck, Sun, Moon } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "JP Tutor AI Yamato - Gateway to Japanese Mastery" },
    { name: "description", content: "Gateway to Japanese Mastery. Rigorous VCE exam preparation and self-paced learning." },
  ];
};

export default function Home() {
  const [isDark, setIsDark] = useState(true);

  // 初回ロード時に保存されたテーマまたはシステムの好みを反映
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDarkModeActive = savedTheme === "dark" || (!savedTheme && document.documentElement.classList.contains("dark"));
    
    setIsDark(isDarkModeActive);
    if (isDarkModeActive) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // テーマ切り替え関数
  const toggleTheme = () => {
    if (isDark) {
      // ライトモードへ切り替え
      setIsDark(false);
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      // ダークモードへ切り替え
      setIsDark(true);
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      <div className="flex flex-col min-h-screen">
        
        {/* ヘッダー */}
        <header className="border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-600 dark:from-white dark:via-slate-200 dark:to-indigo-300 bg-clip-text text-transparent">
                JP Tutor AI Yamato
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                Gateway to Japanese Mastery
              </div>
              
              {/* テーマ切り替えボタン */}
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-800 shadow-sm cursor-pointer select-none"
                aria-label="Toggle Theme"
              >
                {isDark ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">ライト</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    <Moon className="w-4 h-4 text-indigo-600" />
                    <span className="hidden sm:inline">ダーク</span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-grow">
          {/* メインヒーロービジュアル */}
          <section className="relative overflow-hidden py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 dark:from-indigo-900/20 via-transparent to-transparent pointer-events-none" />
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs sm:text-sm font-medium mb-6 shadow-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Over 20 Years of VCE Japanese Teaching Expertise</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
                Your Gateway to <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
                  Japanese Mastery
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                From rigorous VCE exam preparation to self-paced learning for all backgrounds. Experience precision AI-driven Japanese tutoring tailored to your goals.
              </p>
            </div>
          </section>

          {/* アプリ一覧（グリッドポータル）セクション */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            <div className="mb-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Choose Your Learning Path
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">
                Select an application below to start your journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* アプリカード 1: VCE EOY Exam Writing Tutor */}
              <div className="group relative bg-white dark:bg-slate-900/80 rounded-2xl border border-indigo-500/30 p-8 hover:border-indigo-500/65 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between shadow-sm">
                <div className="absolute top-4 right-4 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-500/20">
                  Featured
                </div>
                <div>
                  <div className="w-12 h-12 bg-indigo-600/10 dark:bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                    VCE Japanese EOY Exam AI Writing Tutor
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    Designed specifically for Year 11-12 VCE students. 110 original prompts, precise kanji/grammar validation, and real exam formatting support.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Target: Year 11-12</span>
                  <a
                    href="/vce-eoy-writing-tutor"
                    className="inline-flex items-center space-x-1 text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                  >
                    <span>Launch App</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* アプリカード 2: Middle Years (Year 7-10) */}
              <div className="group relative bg-white/60 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col justify-between shadow-sm">
                <div className="absolute top-4 right-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Coming Soon
                </div>
                <div>
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                    Junior Years Japanese (Year 7-10)
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    Engaging foundational modules, interactive vocabulary building, and fun audio-integrated exercises for middle secondary students.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Target: Year 7-10</span>
                  <span className="text-sm font-medium text-slate-400 dark:text-slate-500 cursor-not-allowed">
                    In Development
                  </span>
                </div>
              </div>

              {/* アプリカード 3: Independent / Interest-based Learners */}
              <div className="group relative bg-white/60 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col justify-between shadow-sm">
                <div className="absolute top-4 right-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Coming Soon
                </div>
                <div>
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                    Independent & Interest-Based Learner
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    For learners of all backgrounds. Explore Japanese through pop culture, anime aesthetics, sports themes, and self-paced daily conversation.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Target: All Learners</span>
                  <span className="text-sm font-medium text-slate-400 dark:text-slate-500 cursor-not-allowed">
                    In Development
                  </span>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* フッター */}
        <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-100 dark:bg-slate-950 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
            <p>© {new Date().getFullYear()} JP Tutor AI Yamato. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <span className="hover:text-slate-700 dark:hover:text-slate-400 transition-colors">VCE Specialist Platform</span>
              <span className="hover:text-slate-700 dark:hover:text-slate-400 transition-colors">Powered by AI & Educator Experience</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}