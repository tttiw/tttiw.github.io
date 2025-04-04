# wCalc API Reference

To use the following functions, you need to import them first:

```python
from wCalc import input, get_loaded_file
```

## Reference

### `wCalc.input(prompt)`

The `input` function for wCalc. Note that `__builtins__.input()` is not supported by wCalc.

| Argument            | Type  | Description                           |
|---------------------|-------|---------------------------------------|
| `prompt` (optional) | `str` | The prompt shown when awaiting input. |

---

### `wCalc.get_file(file_name)`

Returns the binary data of a previously loaded file.

| Argument    | Type  | Description                            |
|-------------|-------|----------------------------------------|
| `file_name` | `str` | Name of the file, including extension. |

| Return Type  | Description                                |
|--------------|--------------------------------------------|
| `memoryview` | Provides access to the file's memory data. |

---

### `wCalc.download(file_name, file_content, write=True)`

Downloads a file to your Downloads folder. If the file does not exist, it will be created.

**Paths:**

- Windows: `C:\Users\user\Downloads`
- Android: `/storage/emulated/0/Android/data/com.tttiw.wcalc/files/Download/`

| Argument           | Type                                   | Description                              |
|--------------------|----------------------------------------|------------------------------------------|
| `file_name`        | `str`                                  | Name of the file (with extension).       |
| `file_content`     | `bytes` \| `bytearray` \| `memoryview` | Binary content of the file.              |
| `write` (optional) | `bool`                                 | Overwrites the file if `True` (default). |

| Return Type | Description |
|-------------|-------------|
| `None`      | N/A         |

---

### `wCalc.get_all_file_names()`

Returns a list of file names currently loaded into wCalc.

| Return Type | Description                    |
|-------------|--------------------------------|
| `list[str]` | List of file names as strings. |

---

### `wCalc.get_current_lang`

Returns the current language code.

| Return Type | Description                 |
|-------------|-----------------------------|
| `str`       | Language code (e.g., "en"). |

---

### `wCalc.get_startup_script()`

Returns the startup script of the editor.

| Return Type | Description              |
|-------------|--------------------------|
| `str`       | The startup script code. |

---

### `wCalc.set_startup_script(script)`

Sets the startup script of the editor.

| Argument | Type  | Description                |
|----------|-------|----------------------------|
| `script` | `str` | The script content to set. |

| Return Type | Description |
|-------------|-------------|
| `None`      | N/A         |

---

### `wCalc.reset_startup_script()`

Resets the startup script to default.

| Return Type | Description |
|-------------|-------------|
| `None`      | N/A         |