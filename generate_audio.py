import csv
import os
import time
import requests

# --- 設定 ---
API_KEY = "sk_00cc74cbfc732d542f4370e846427b2aedad19434cbe1944"
CSV_FILE = "questions.csv"
OUTPUT_DIR = "./public/audio"  # Remixのpublic/audioに出力

# 速度の一括設定（1.0が標準。遅くしたい場合は 0.8 〜 0.9 程度に設定）
# ペースごとに個別の速度に変えたい場合はここを調整できます
DEFAULT_SPEED = 0.85  # 全体共通の速度

# 出力先フォルダの作成
os.makedirs(OUTPUT_DIR, exist_ok=True)

# CSVファイルの読み込みと処理
with open(CSV_FILE, mode="r", encoding="utf-8") as f:
    reader = csv.DictReader(f)

    for row in reader:
        file_id = row["id"]  # 例: Q001
        text = row["question_ja"]
        voice_id = row["voice_id"]
        pace = row.get("pace", "steady")  # CSVにpace列があれば取得、なければsteady

        # ペースごとに速度を細かく変えたい場合の分岐（必要に応じて調整可能）
        if pace == "steady":
            speech_speed = 0.80  # 少しゆっくり
        elif pace == "normal":
            speech_speed = 0.85  # 標準よりややゆっくり
        elif pace == "Accelerated":
            speech_speed = 0.95  # 速め（または1.0）
        else:
            speech_speed = DEFAULT_SPEED

        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": API_KEY,
        }

        # voice_settings 内に "speed" を追加
        data = {
            "text": text,
            "model_id": "eleven_multilingual_v2",  # 日本語に最適な多言語モデル
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75,
                "speed": speech_speed,  # ← ここで速度を設定
            },
        }

        print(f"Generating [{file_id}] (Pace: {pace}, Speed: {speech_speed}): {text}...")
        response = requests.post(url, json=data, headers=headers)

        if response.status_code == 200:
            file_path = os.path.join(OUTPUT_DIR, f"{file_id}.mp3")
            with open(file_path, "wb") as audio_file:
                audio_file.write(response.content)
            print(f"Successfully saved -> {file_path}")
        else:
            print(
                f"Failed to generate {file_id}: {response.status_code},"
                f" {response.text}"
            )

        # APIの連続呼び出しによる制限（レートリミット）を防ぐためのウェイト
        time.sleep(1)

print("すべての音声生成処理が完了しました！")