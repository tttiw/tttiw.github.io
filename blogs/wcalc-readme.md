# README for wCalc

**wCalc** is a lightweight, interactive tool for quick Python scripts and everyday tasks.

[Download wCalc](https://github.com/tttiw/wCalc/releases)

---

## ✨ Features

- No Python installation needed
- No "Save?" prompts before execution or exit
- Beginner-friendly experience (even if you've never coded)
- Pre-written templates for common tasks like math, image processing, etc.
- Apache-2.0 license

---

## Platform Support

- ✅ Windows
- ✅ Android
- ⏳ Linux
- ❌ iOS/macOS (dev account too expensive)

---

## Getting Started

wCalc works half like a REPL.
You write code in the editor, execute it, then continue building on top of your previous code.

You can customize the startup script with:

```python
wCalc.set_startup_script("""
# your script here
""")
```

For more functions that wCalc provides, check out the [wCalc API reference](@blogs/wcalc-api.md).

---

## 📸 Example Workflow

1. Drag a photo into the window
2. Open **Code Templates** and pick "Apply Gaussian Blur"
3. Copy and paste the template into the editor
4. Press **Execute**
5. wCalc asks for file names
6. The processed photo appears in your **Downloads** folder 🎉
7. Happily exit wCalc

---

## Built With:

- Tauri 2.0
- Pyodide
- My time
- My energy

---

## Why I Built This

I wanted a convenient and satisfying tool that could take advantage of powerful Python libraries
(like `sympy` and `Pillow`) without needing to install packages on my machine, save scripts, or open a full-blown IDE.

So I built wCalc for myself, and now for you too. Hope you enjoy it!

---

## Feedback

You can open an issue [here](https://github.com/tttiw/wCalc/issues) if you encounter a problem or have a suggestion.

