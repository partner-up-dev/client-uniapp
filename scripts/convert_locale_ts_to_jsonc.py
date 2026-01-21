import re
from pathlib import Path

LOCALES = ["zh-Hans", "en-US"]
BASE_DIR = Path(__file__).resolve().parents[1]

ARROW_TEMPLATE_RE = re.compile(
    r":\s*\(\s*\{[^}]*named[^}]*\}\s*:\s*[^)]*\)\s*=>\s*`([^`]*)`",
    re.DOTALL,
)

KEY_RE = re.compile(r"^(\s*)([A-Za-z_][\w]*)(\s*:)", re.MULTILINE)
NUM_KEY_RE = re.compile(r"^(\s*)(\d+)(\s*:)", re.MULTILINE)
IMPORT_RE = re.compile(r"^\s*import[^\n]+;?\s*\n?", re.MULTILINE)
EXPORT_RE = re.compile(r"^\s*export\s+default\s+", re.MULTILINE)


def replace_named_template(template: str) -> str:
    def repl(match: re.Match[str]) -> str:
        return "{" + match.group(1) + "}"

    return re.sub(r"\$\{\s*named\(\s*['\"]([^'\"]+)['\"]\s*\)\s*\}", repl, template)


def replace_arrow_functions(text: str) -> str:
    def repl(match: re.Match[str]) -> str:
        template = replace_named_template(match.group(1))
        escaped = template.replace("\\", "\\\\").replace('"', "\\\"")
        return f': "{escaped}"'

    return ARROW_TEMPLATE_RE.sub(repl, text)


def convert_single_quotes(text: str) -> str:
    out: list[str] = []
    i = 0
    in_single = False
    in_double = False
    in_template = False
    in_line_comment = False
    in_block_comment = False

    while i < len(text):
        ch = text[i]
        next_ch = text[i + 1] if i + 1 < len(text) else ""

        if in_line_comment:
            out.append(ch)
            if ch == "\n":
                in_line_comment = False
            i += 1
            continue

        if in_block_comment:
            out.append(ch)
            if ch == "*" and next_ch == "/":
                out.append(next_ch)
                i += 2
                in_block_comment = False
                continue
            i += 1
            continue

        if not in_single and not in_double and not in_template:
            if ch == "/" and next_ch == "/":
                out.append(ch)
                out.append(next_ch)
                i += 2
                in_line_comment = True
                continue
            if ch == "/" and next_ch == "*":
                out.append(ch)
                out.append(next_ch)
                i += 2
                in_block_comment = True
                continue

        if in_single:
            if ch == "\\":
                out.append(ch)
                i += 1
                if i < len(text):
                    out.append(text[i])
            elif ch == "'":
                out.append('"')
                in_single = False
            else:
                if ch == '"':
                    out.append('\\"')
                else:
                    out.append(ch)
        elif in_double:
            out.append(ch)
            if ch == "\\":
                i += 1
                if i < len(text):
                    out.append(text[i])
            elif ch == '"':
                in_double = False
        elif in_template:
            out.append(ch)
            if ch == "\\":
                i += 1
                if i < len(text):
                    out.append(text[i])
            elif ch == '`':
                in_template = False
        else:
            if ch == "'":
                in_single = True
                out.append('"')
            elif ch == '"':
                in_double = True
                out.append(ch)
            elif ch == '`':
                in_template = True
                out.append(ch)
            else:
                out.append(ch)
        i += 1
    return "".join(out)


def quote_keys(text: str) -> str:
    text = KEY_RE.sub(lambda m: f'{m.group(1)}"{m.group(2)}"{m.group(3)}', text)
    text = NUM_KEY_RE.sub(lambda m: f'{m.group(1)}"{m.group(2)}"{m.group(3)}', text)
    return text


def strip_import_export(text: str) -> str:
    text = IMPORT_RE.sub("", text)
    text = EXPORT_RE.sub("", text)
    text = text.strip()
    if text.endswith(";"):
        text = text[:-1]
    return text.strip()


def convert_file(path: Path) -> str:
    raw = path.read_text(encoding="utf-8")
    text = strip_import_export(raw)
    text = replace_arrow_functions(text)
    text = convert_single_quotes(text)
    text = quote_keys(text)
    return text + "\n"


def main() -> None:
    locale_dir = BASE_DIR / "src" / "locale"
    for locale in LOCALES:
        target_dir = locale_dir / locale
        for ts_path in target_dir.glob("*.ts"):
            jsonc_path = ts_path.with_suffix(".jsonc")
            converted = convert_file(ts_path)
            jsonc_path.write_text(converted, encoding="utf-8")


if __name__ == "__main__":
    main()
