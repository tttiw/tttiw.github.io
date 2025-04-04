# Apply Gaussian Blur

This code template applies a Gaussian blur to an image.

## Code

```python
from wCalc import input, get_file, download
import io
import micropip
await micropip.install("Pillow")
from PIL import Image, ImageFilter

file_name = await input("Enter the file name to convert (eg. pic.jpg): ")
save_name = await input("Enter the file name to save as (eg. pic.png): ")
radius_input = await input("Enter your desired blur radius (px) [eg. 50]: ")
try:
    radius = float(radius_input)
    if radius < 0:
        raise ValueError("Radius must be a non-negative number")
except ValueError:
    raise ValueError(f"Invalid radius value: {radius_input}. Must be a non-negative number.")

binary_data = get_file(file_name)
img = Image.open(io.BytesIO(binary_data)).convert("RGBA")
blurred = img.filter(ImageFilter.GaussianBlur(radius=radius))
buffer = io.BytesIO()
blurred.save(buffer, format="PNG")
download(save_name, buffer.getvalue())
```