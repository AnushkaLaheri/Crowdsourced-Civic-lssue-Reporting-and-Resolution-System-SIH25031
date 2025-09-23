import sys
from faster_whisper import WhisperModel
import ffmpeg

audio_file = sys.argv[1]
model = WhisperModel("Systran/faster-whisper-base")

# 🔍 check audio stream
try:
    probe = ffmpeg.probe(audio_file)
    has_audio = any(s['codec_type'] == 'audio' for s in probe['streams'])
except Exception as e:
    print("Error probing file:", e)
    sys.exit(1)

if not has_audio:
    print("NO_AUDIO")
    sys.exit(0)

segments, _ = model.transcribe(audio_file)
for segment in segments:
    print(segment.text, end=" ")
