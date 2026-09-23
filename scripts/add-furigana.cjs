const fs = require('fs');
const path = require('path');
const kuromoji = require('kuromoji');

const vceKanjiList = new Set([
  '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万',
  '本', '人', '回', '才', '円', '番',
  '春', '夏', '秋', '冬', '日', '月', '火', '水', '木', '金', '土', '曜', '年', '時', '分', '夕', '半', '午', '毎', '週', '間', '今', '先', '朝', '晩', '昼', '夜', '去',
  '目', '口', '耳', '手', '体',
  '上', '中', '下', '右', '左', '前', '後', '東', '西', '南', '北', '外',
  '学', '校', '英', '語', '文', '漢', '字', '勉', '強',
  '父', '母', '子', '家', '族', '兄', '弟', '姉', '妹', '友', '私', '男', '女',
  '大', '小', '好', '安', '高', '新', '古', '多', '少', '楽', '長', '近', '正', '広', '早', '明',
  '行', '来', '休', '出', '入', '生', '見', '思', '書', '言', '話', '読', '売', '買', '食', '飲', '知', '作', '住', '会', '使', '着', '発', '聞', '帰', '持', '待', '教', '乗', '働', '動', '歩', '終', '始', '泊', '洗', '立', '考', '習',
  '山', '川', '田', '花', '島', '海', '天', '雨', '雪', '牛', '魚', '馬', '犬',
  '京', '都', '市', '県', '州', '国', '町', '神', '寺', '駅', '店', '電', '車', '道', '旅',
  '赤', '青', '白', '黒', '色', '銀', '々',
  '何', '紙', '元', '気', '活', '社', '自', '物', '名', '方', '院', '所', '屋', '肉', '場', '飯', '洋', '和', '病', '次', '同', '仕', '事', '点'
]);

// 💡 形態素解析で意図しない分割になりやすい熟語の例外マップ
const customFuriganaMap = {
  "今学期": "<ruby>今学期<rt>こんがっき</rt></ruby>",
// 「お」はそのままで、「母様」にだけ「かあさま」を振る場合
  "お母様": "お<ruby>母様<rt>かあさま</rt></ruby>",
  "通っている": "<ruby>通<rt>かよ</rt></ruby>っている",
  "知り合い": "<ruby>知<rt>し</rt></ruby>り<ruby>合<rt>あ</rt></ruby>い",
  "取り組む": "<ruby>取<rt>と</rt></ruby>り<ruby>組<rt>く</rt></ruby>む",
  "取り上げる": "<ruby>取<rt>と</rt></ruby>り<ruby>上<rt>あ</rt></ruby>げる",
  "掘り下げる": "<ruby>掘<rt>ほ</rt></ruby>り<ruby>下<rt>さ</rt></ruby>げる",
  "対して": "<ruby>対<rt>たい</rt></ruby>して",
  "通じて": "<ruby>通<rt>つう</rt></ruby>じて",
  "もう一度": "もう<ruby>一度<rt>いちど</rt></ruby>",
  "お疲れ様": "お<ruby>疲<rt>つか</rt></ruby>れ<ruby>様<rt>さま</rt></ruby>",
  "他の": "<ruby>他<rt>ほか</rt></ruby>の",

  // 必要に応じて他の熟語もここに追加できます
};

function katakanaToHiragana(str) {
  if (!str) return '';
  return str.replace(/[\u30a1-\u30f6]/g, match => {
    return String.fromCharCode(match.charCodeAt(0) - 0x60);
  });
}

// 1つの文字列に対してルビを振る関数
function addFuriganaToText(text, tokenizer) {
  if (!text || typeof text !== 'string') return text;
  
  // 1. まずカスタム例外マップに一致する熟語を一括置換
  let processedText = text;
  for (const [kanjiWord, rubyHtml] of Object.entries(customFuriganaMap)) {
    if (processedText.includes(kanjiWord)) {
      processedText = processedText.replace(new RegExp(kanjiWord, 'g'), rubyHtml);
    }
  }

  // 2. すでにルビタグに置き換わった部分と通常のテキスト部分に分割し、通常部分のみ解析
  const parts = processedText.split(/(<ruby>.*?<\/ruby>)/g);
  
  return parts.map(part => {
    if (part.startsWith('<ruby>')) return part;

    const tokens = tokenizer.tokenize(part);
    let newText = '';

    tokens.forEach(token => {
      const surface = token.surface_form; 
      const reading = katakanaToHiragana(token.reading); 

      // VCEリスト外の漢字が含まれているかチェック
      let hasNonVceKanji = false;
      for (let i = 0; i < surface.length; i++) {
        if (/[\u4e00-\u9faf]/.test(surface[i]) && !vceKanjiList.has(surface[i])) {
          hasNonVceKanji = true;
          break;
        }
      }

      if (hasNonVceKanji && reading && surface !== reading) {
        const matchOkuri = surface.match(/^(.+?)([\u3041-\u3096]+)$/);
        
        if (matchOkuri) {
          const kPart = matchOkuri[1]; 
          const oPart = matchOkuri[2]; 
          
          if (reading.endsWith(oPart)) {
            const kReading = reading.slice(0, reading.length - oPart.length);
            newText += `<ruby>${kPart}<rt>${kReading}</rt></ruby>${oPart}`;
          } else {
            newText += `<ruby>${surface}<rt>${reading}</rt></ruby>`;
          }
        } else {
          newText += `<ruby>${surface}<rt>${reading}</rt></ruby>`;
        }
      } else {
        newText += surface;
      }
    });

    return newText;
  }).join('');
}

// プロジェクトルートからの相対パスで辞書とJSONを指定
kuromoji.builder({ dicPath: path.join(__dirname, '../node_modules/kuromoji/dict') }).build((err, tokenizer) => {
  if (err) {
    console.error('辞書のロードに失敗しました:', err);
    return;
  }

  const jsonPath = path.join(__dirname, '../app/data/oral-exam-questions.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`エラー: ${jsonPath} が見つかりませんでした。`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // data の各セクション (beforeSec1, sec1, sec2, afterSec2) を走査
  for (const [sectionKey, sectionVal] of Object.entries(data)) {
    for (const [paceKey, paceArray] of Object.entries(sectionVal)) {
      if (Array.isArray(paceArray)) {
        paceArray.forEach(item => {
          if (item.text) {
            // 元のプレーンテキストを保持しつつルビ付きに更新
            const originalText = item.text_original || item.text.replace(/<[^>]*>?/gm, '');
            item.text_original = originalText;
            item.text = addFuriganaToText(originalText, tokenizer);
          }
        });
      }
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('✨ oral-exam-questions.json の質問文へのルビ振り＆更新が完了しました！');
});