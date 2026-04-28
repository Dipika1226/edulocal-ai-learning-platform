import json
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


def main():
    if len(sys.argv) < 4:
        print(
            json.dumps(
                {"error": "Usage: free_translate.py <file> <from_code> <to_code>"},
                ensure_ascii=False,
            )
        )
        sys.exit(1)

    input_path = sys.argv[1]
    from_code = sys.argv[2]
    to_code = sys.argv[3]

    try:
        from deep_translator import GoogleTranslator
    except ImportError:
        print(
            json.dumps(
                {
                    "error": (
                        "deep-translator is not installed in the Python environment. "
                        "Install it with: pip install deep-translator"
                    )
                },
                ensure_ascii=False,
            )
        )
        sys.exit(1)

    with open(input_path, "r", encoding="utf-8") as handle:
        text = handle.read()

    if not text.strip() or from_code == to_code:
        print(json.dumps({"translatedText": text}, ensure_ascii=False))
        return

    try:
        translated_text = GoogleTranslator(source=from_code, target=to_code).translate(text)
        print(json.dumps({"translatedText": translated_text or ""}, ensure_ascii=False))
    except Exception as exc:
        print(json.dumps({"error": str(exc)}, ensure_ascii=False))
        sys.exit(1)


if __name__ == "__main__":
    main()
