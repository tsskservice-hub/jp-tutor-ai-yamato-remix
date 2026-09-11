import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { Sparkles, ArrowLeft, ArrowRight, ShieldCheck, Info } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Demo: VCE Japanese AI Writing Tutor - JP Tutor AI Yamato" },
    { name: "description", content: "Try a free interactive demo of the VCE Japanese AI Writing Tutor." },
  ];
};

export default function DemoPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      {/* ヘッダー */}
      <header className="border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center space-x-2">
            <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-500/20 inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Demo Version
            </span>
          </div>
        </div>
      </header>

      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* タイトル＆説明エリア */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-medium mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span>VCE Japanese Assessment Aligned</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
              Try the AI Writing Tutor Demo
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              Test how the AI tutor corrects and enhances Japanese writing according to VCE standards.
            </p>
          </div>

          {/* デモ利用の注記・制限事項バナー */}
          <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 rounded-xl p-4 mb-6 flex items-start space-x-3 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200">
            <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Demo Limitations:</p>
              <p className="text-indigo-700 dark:text-indigo-300">
                Input is limited to short sentences (up to 150 characters). For the full 110 VCE exam practice questions and comprehensive feedback, check out the Full Version below.
              </p>
            </div>
          </div>

          {/* Dify iframe 埋め込みコンテナ */}
          <div className="w-full h-[600px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-12"> 
            <iframe
              src="https://udify.app/chatbot/IolKotGKX4ZQrRRf" // ★ DifyのWeb埋め込み用URL（公開用トークンURL）に差し替えてください
              style={{ width: "100%", height: "100%", minHeight: "600px" }}
              frameBorder="0"
              allow="microphone"
              title="VCE AI Tutor Demo"
            />
          </div>

          {/* フルバージョン導線（CTAカード） */}
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-2xl p-8 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-2xl font-bold mb-2">Ready for Complete VCE Exam Prep?</h2>
            <p className="text-slate-300 text-sm mb-6 max-w-lg mx-auto">
              Get unlimited access to 110 exam-style writing tasks, precise VCE criteria evaluation, and full grammar support.
            </p>

            <a
              href="https://vceeoywriting.jptutoraiyamato.com" // ★ 必要に応じてGumroadまたはアプリのランディングURLに変更
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 text-sm font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <span>Get Full Version Access</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-100 dark:bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} JP Tutor AI Yamato. All rights reserved.</p>
      </footer>
    </div>
  );
}