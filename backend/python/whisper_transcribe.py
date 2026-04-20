import whisper
import sys
import json

video_path = sys.argv[1]
model_name = sys.argv[2] if len(sys.argv) > 2 else "small"

# Load model
model = whisper.load_model(model_name)

# Run transcription (NO verbose)
result = model.transcribe(
    video_path,
    temperature=0,
    best_of=1,
    beam_size=1,
    condition_on_previous_text=False,
    compression_ratio_threshold=2.2,
    no_speech_threshold=0.45,
    logprob_threshold=-1.0,
    fp16=False
)

# Prepare clean JSON output
output = {
    "text": result.get("text", ""),
    "segments": [
        {
            "start": seg.get("start"),
            "end": seg.get("end"),
            "text": seg.get("text")
        }
        for seg in result.get("segments", [])
    ]
}

# ✅ ONLY JSON printed
print(json.dumps(output))
