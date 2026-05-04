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
        from deep_translator import GoogleTranslator, MyMemoryTranslator
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
        text = handle.read().lstrip("\ufeff")

    if not text.strip() or from_code == to_code:
        print(json.dumps({"translatedText": text}, ensure_ascii=False))
        return

    try:
        translated_text = None
        provider_errors = []

        providers = [
            ("google", lambda: GoogleTranslator(source=from_code, target=to_code).translate(text)),
            ("mymemory", lambda: MyMemoryTranslator(source=from_code, target=to_code).translate(text)),
        ]

        for provider_name, provider in providers:
            try:
                candidate = provider()
                if candidate and candidate.strip():
                    translated_text = candidate
                    break
            except Exception as provider_exc:
                provider_errors.append(f"{provider_name}: {provider_exc}")

        if not translated_text:
            raise RuntimeError("; ".join(provider_errors) or "No free translation provider returned text")

        print(
            json.dumps(
                {"translatedText": translated_text.lstrip("\ufeff")},
                ensure_ascii=False,
            )
        )
    except Exception as exc:
        print(json.dumps({"error": str(exc)}, ensure_ascii=False))
        sys.exit(1)


if __name__ == "__main__":
    main()
