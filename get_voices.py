import requests

# あなたのElevenLabsのAPIキーを設定してください
API_KEY = "sk_b44b1fb92096d0a51686077c05ee768c4fb674953029071d"

url = "https://api.elevenlabs.io/v1/voices"
headers = {"xi-api-key": API_KEY}

response = requests.get(url, headers=headers)

if response.status_code == 200:
  voices = response.json().get("voices", [])
  print("--- 利用可能な音声一覧 ---")
  for v in voices:
    print(f"名前: {v['name']} / Voice ID: {v['voice_id']}")
else:
  print(
      f"エラーが発生しました: {response.status_code}, {response.text}"
  )