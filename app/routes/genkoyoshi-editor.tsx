import React, { useState, useEffect } from "react";
import type { MetaFunction } from "react-router";

type Item =
  | { type: "num"; value: string }
  | { type: "char"; value: string }
  | { type: "co"; main: string; sub: string };

export const meta: MetaFunction = () => {
  return [
    { title: "Japanese Genkoyoshi Grid Editor | JPTutor AI Yamato" },
    { name: "description", content: "Free Japanese writing grid generator with custom line spacing and instant PDF print export." },
  ];
};

export default function GenkoyoshiEditor() {
  const [format, setFormat] = useState<string>("400");
  const [title, setTitle] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isPunctuation = (char: string): boolean => {
    return ["、", "。", "，", "．", "！", "？", "」", "』", "）", "〕", "］", "｝", "』", "〉", "》"].includes(char);
  };

  const isHalfWidthDigit = (char: string): boolean => {
    return /^[0-9]$/.test(char);
  };

  const parseTextToItems = (inputText: string): Item[] => {
    const chars = Array.from(inputText);
    const items: Item[] = [];
    let i = 0;
    while (i < chars.length) {
      const c1 = chars[i];
      if (isHalfWidthDigit(c1) && i + 1 < chars.length && isHalfWidthDigit(chars[i + 1])) {
        items.push({ type: "num", value: c1 + chars[i + 1] });
        i += 2;
      } else {
        items.push({ type: "char", value: c1 });
        i += 1;
      }
    }
    return items;
  };

  // 空の1マスを生成するヘルパー関数
  const createEmptyCell = (): Item => ({ type: "char", value: "" });

  // 1行（Item[]）を必ず colsPerLine (20マス) に補填するヘルパー関数
  const padRowToLength = (row: Item[], colsPerLine: number = 20): Item[] => {
    const padded = [...row];
    while (padded.length < colsPerLine) {
      padded.push(createEmptyCell());
    }
    return padded;
  };

  const generatePages = (): Item[][][] => {
    const colsPerLine = 20;
    const maxRows = format === "400" ? 20 : 10;
    const paragraphs = text.split("\n");
    const contentLines: Item[][] = [];

    for (const p of paragraphs) {
      const parsedItems = parseTextToItems(p);
      if (parsedItems.length > 0) {
        const first = parsedItems[0];
        if (!(first.type === "char" && first.value === " ")) {
          parsedItems.unshift({ type: "char", value: " " });
        }
      }

      let currentLineItems: Item[] = [];
      let i = 0;
      while (i < parsedItems.length) {
        const item = parsedItems[i];

        if (currentLineItems.length === colsPerLine) {
          contentLines.push(padRowToLength(currentLineItems, colsPerLine));
          currentLineItems = [];
        }

        if (
          currentLineItems.length === 0 &&
          item.type === "char" &&
          isPunctuation(item.value) &&
          contentLines.length > 0
        ) {
          const prevLine = contentLines[contentLines.length - 1];
          if (prevLine.length > 0) {
            const lastItem = prevLine[prevLine.length - 1];
            if (lastItem.type === "co") {
              prevLine[prevLine.length - 1] = {
                type: "co",
                main: lastItem.main,
                sub: lastItem.sub + item.value,
              };
            } else if (lastItem.type === "char") {
              prevLine[prevLine.length - 1] = {
                type: "co",
                main: lastItem.value,
                sub: item.value,
              };
            }
            i++;
            continue;
          }
        }

        currentLineItems.push(item);
        i++;
      }
      if (currentLineItems.length > 0) {
        contentLines.push(padRowToLength(currentLineItems, colsPerLine));
      }
    }

    const allPagesLines: Item[][][] = [];
    let currentPageLines: Item[][] = [];

    // 0行目: 題名
    const row0: Item[] = Array.from({ length: colsPerLine }, createEmptyCell);
    if (title) {
      const titleItems = parseTextToItems(title);
      for (let idx = 0; idx < titleItems.length && 3 + idx < colsPerLine; idx++) {
        row0[3 + idx] = titleItems[idx];
      }
    }
    currentPageLines.push(row0);

    // 1行目: 氏名
    const row1: Item[] = Array.from({ length: colsPerLine }, createEmptyCell);
    if (name) {
      const nameItems = parseTextToItems(name);
      let startIndex = colsPerLine - 1 - nameItems.length;
      if (startIndex < 0) startIndex = 0;
      for (let idx = 0; idx < nameItems.length && startIndex + idx < colsPerLine - 1; idx++) {
        row1[startIndex + idx] = nameItems[idx];
      }
    }
    currentPageLines.push(row1);

    let contentIndex = 0;
    while (contentIndex < contentLines.length) {
      if (currentPageLines.length >= maxRows) {
        allPagesLines.push(currentPageLines);
        currentPageLines = [];
      }
      currentPageLines.push(contentLines[contentIndex]);
      contentIndex++;
    }

    if (currentPageLines.length > 0) {
      allPagesLines.push(currentPageLines);
    }

    // ページ単位で maxRows (20行/10行) になるまで空行を追加
    return allPagesLines.map((pageLines) => {
      const paddedPage = [...pageLines];
      while (paddedPage.length < maxRows) {
        paddedPage.push(Array.from({ length: colsPerLine }, createEmptyCell));
      }
      return paddedPage;
    });
  };

  const pages = isClient ? generatePages() : [];
  const charCount = text.replace(/\n/g, "").length;

  const clearAll = () => {
    setTitle("");
    setName("");
    setText("");
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="genko-editor-root">
      <style>{`
        :root {
          --cell-size: 41px;
          --line-gap: 8px;
        }

        .genko-editor-root {
          font-family: sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f4f6f9;
          color: #333;
          min-height: 100vh;
        }

        /* ヘッダー全体のフレックス配置 */
        .genko-header-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        /* ロゴとタイトルエリアの並列表示 */
        .genko-header-title-area {
          flex: 1;
          min-width: 320px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .genko-header-logo {
          width: 52px;
          height: 52px;
          object-fit: contain;
          flex-shrink: 0;
        }

        .genko-header-text-group h1 {
          font-size: 1.4rem;
          margin: 0 0 4px 0;
          color: #0f172a;
        }

        .genko-subtitle {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0;
        }

        /* 宣伝バナー用コンテナ */
        .genko-header-banner {
          flex: 1;
          max-width: 540px;
          min-width: 300px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          border-radius: 12px;
          padding: 12px 18px;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .genko-header-banner:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
        }

        .genko-banner-content {
          display: flex;
          flex-direction: column;
        }

        .genko-banner-badge {
          display: inline-block;
          background-color: rgba(255, 255, 255, 0.2);
          color: #fef08a;
          font-size: 0.7rem;
          font-weight: bold;
          padding: 2px 8px;
          border-radius: 12px;
          margin-bottom: 4px;
          width: fit-content;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .genko-banner-text {
          font-size: 0.85rem;
          font-weight: bold;
          line-height: 1.3;
          margin: 0;
        }

        .genko-banner-subtext {
          font-size: 0.75rem;
          opacity: 0.9;
          margin-top: 2px;
        }

        .genko-banner-button {
          background-color: #ffffff;
          color: #4f46e5;
          font-weight: bold;
          font-size: 0.8rem;
          padding: 8px 14px;
          border-radius: 8px;
          text-decoration: none;
          white-space: nowrap;
          transition: background-color 0.2s ease;
        }

        .genko-banner-button:hover {
          background-color: #f3f4f6;
        }

        .genko-container {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .genko-editor-pane {
          flex: 1;
          min-width: 300px;
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .genko-preview-pane {
          flex: 1.5;
          min-width: 350px;
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow-x: auto;
        }

        .genko-control-group {
          margin-bottom: 15px;
        }

        .genko-control-group label {
          display: block;
          font-weight: bold;
          margin-bottom: 5px;
          font-size: 0.9rem;
        }

        .genko-control-group input[type="text"],
        .genko-control-group textarea,
        .genko-control-group select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
          font-size: 1rem;
        }

        .genko-control-group textarea {
          height: 150px;
          resize: vertical;
        }

        .genko-btn-container {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .genko-btn-container button {
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }

        .genko-btn-print {
          background-color: #0066cc;
          color: #fff;
          flex: 1;
        }

        .genko-btn-print:hover {
          background-color: #0052a3;
        }

        .genko-btn-clear {
          background-color: #e0e0e0;
          color: #333;
        }

        .genko-btn-clear:hover {
          background-color: #d0d0d0;
        }

        .genko-stats {
          margin-top: 10px;
          font-size: 0.85rem;
          color: #555;
        }

        .genko-cta-box {
          margin-top: 25px;
          padding: 15px;
          background-color: #eef6ff;
          border: 1px solid #b6d4fe;
          border-radius: 6px;
        }

        .genko-cta-box h3 {
          margin-top: 0;
          font-size: 1rem;
          color: #004085;
        }

        .genko-cta-box p {
          font-size: 0.85rem;
          color: #333;
          margin-bottom: 10px;
        }

        .genko-cta-link {
          display: inline-block;
          font-weight: bold;
          color: #0066cc;
          text-decoration: underline;
        }

        .genko-sheet {
          background: #fff;
          border: 1px solid #ccc;
          padding: 30px;
          box-sizing: border-box;
          display: inline-block;
          min-width: 100%;
          margin-bottom: 20px;
        }

        .genko-grid {
          display: flex;
          flex-direction: column;
          gap: var(--line-gap);
        }

        .genko-row {
          display: flex;
          gap: 0;
        }

        .genko-cell {
          width: var(--cell-size);
          height: var(--cell-size);
          border: 1px solid #999;
          box-sizing: border-box;
          display: flex;
          align-items: flex-end;     
          justify-content: center;   
          padding-bottom: 2mm;       
          font-size: 1.35rem;         
          line-height: 1;
          position: relative;
          background-color: #fff;
        }

        .genko-cell::after {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border: 1px dotted #ffcccc;
          pointer-events: none;
        }

        .co-cell {
          justify-content: flex-end; 
          padding-right: 2px;
        }

        .co-wrapper {
          display: flex;
          align-items: flex-end;     
          font-size: 1.35rem;         
          line-height: 1;
          transform: translateX(3mm); 
        }

        .co-main {
          display: inline-block;
        }

        .co-sub {
          display: inline-block;
          font-size: 1.35rem;         
        }

        .num-cell {
          justify-content: center;
          align-items: flex-end;
          padding-bottom: 2mm;
        }

        .num-pair {
          display: inline-flex;
          font-size: 1.2rem;
          letter-spacing: -0.5px;
          line-height: 1;
        }

        @page {
          size: B4 portrait;
          margin: 10mm;
        }

        @media print {
          body, .genko-editor-root {
            background: none !important;
            padding: 0 !important;
          }
          .genko-header-wrapper,
          .genko-editor-pane,
          .genko-btn-container,
          .genko-cta-box {
            display: none !important;
          }
          .genko-preview-pane {
            box-shadow: none !important;
            padding: 0 !important;
            overflow: visible !important;
          }
          .genko-sheet {
            border: none !important;
            margin: 0 !important;
            page-break-after: always;
          }
        }
      `}</style>

      {/* 🌟 ヘッダー */}
      <div className="genko-header-wrapper">
        <div className="genko-header-title-area">
          <img
            src="/jptutoraiyamato.png"
            alt="JP Tutor AI Yamato Logo"
            className="genko-header-logo"
          />
          <div className="genko-header-text-group">
            <h1>Japanese Genkoyoshi Grid Editor (Horizontal)</h1>
            <div className="genko-subtitle">
              Type your writing in the text box below. Pressing Enter automatically creates a new indent paragraph.
            </div>
          </div>
        </div>

        {/* 📢 宣伝バナー */}
        <div className="genko-header-banner">
          <div className="genko-banner-content">
            <span className="genko-banner-badge">Writing AI Tutor</span>
            <div className="genko-banner-text">Ready for your VCE EOY Exam?</div>
            <div className="genko-banner-subtext">AI Yamato is here to support you!</div>
          </div>
          <a href="/#vce-app" className="genko-banner-button">
            Learn More &rarr;
          </a>
        </div>
      </div>

      <div className="genko-container">
        <div className="genko-editor-pane">
          <div className="genko-control-group">
            <label htmlFor="format">用紙（ようし）フォーマット</label>
            <select
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <option value="400">400字詰め（20字×20行）</option>
              <option value="200">200字詰め（20字×10行）</option>
            </select>
          </div>

          <div className="genko-control-group">
            <label htmlFor="titleInput">題名（だいめい）</label>
            <input
              type="text"
              id="titleInput"
              placeholder="例（れい）：日本のアニメ"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="genko-control-group">
            <label htmlFor="nameInput">氏名（しめい）</label>
            <input
              type="text"
              id="nameInput"
              placeholder="例：中山　花子"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="genko-control-group">
            <label htmlFor="textInput">本文（ほんぶん）</label>
            <textarea
              id="textInput"
              placeholder="ここに文を書いてください。"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="genko-stats">文字数: {charCount}字</div>

          <div className="genko-btn-container">
            <button className="genko-btn-print" onClick={handlePrint}>
              印刷（いんさつ）する / PDF保存（ほぞん）
            </button>
            <button className="genko-btn-clear" onClick={clearAll}>
              消（け）す
            </button>
          </div>

          <div className="genko-cta-box">
            <h3>Ready for your VCE EOY Writing Exam?</h3>
            <p>
              Don't leave your marks to chance! AI Yamato is here to power up your writing prep with instant VCE Kanji checks, grammar feedback and scoring tips.
            </p>
            <a href="/#vce-app" className="genko-cta-link">
              Discover AI Writing Tutor &rarr;
            </a>
          </div>
        </div>

        <div className="genko-preview-pane">
          <div>
            {isClient &&
              pages.map((pageRows, pageIdx) => (
                <div key={pageIdx} className="genko-sheet">
                  <div className="genko-grid">
                    {pageRows.map((rowItems, rowIdx) => (
                      <div key={rowIdx} className="genko-row">
                        {rowItems.map((item, colIdx) => {
                          if (item.type === "co") {
                            return (
                              <div key={colIdx} className="genko-cell co-cell">
                                <div className="co-wrapper">
                                  <span className="co-main">{item.main}</span>
                                  <span className="co-sub">{item.sub}</span>
                                </div>
                              </div>
                            );
                          } else if (item.type === "num") {
                            return (
                              <div key={colIdx} className="genko-cell num-cell">
                                <span className="num-pair">{item.value}</span>
                              </div>
                            );
                          } else if (item.type === "char") {
                            return (
                              <div key={colIdx} className="genko-cell">
                                {item.value}
                              </div>
                            );
                          }
                          return <div key={colIdx} className="genko-cell"></div>;
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}