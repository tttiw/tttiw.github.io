# Convert to PNG

This code template converts an image to PNG format. 

## Code

```python
from js import input, get_file, download
import io
import micropip
await micropip.install("Pillow")
from PIL import Image, ImageDraw

file_name = await input("Enter the file name to convert (eg. pic.jpg): ")
save_name = await input("Enter the file name to save as (eg. pic.png): ")
radius_input = await input("Enter your desired corner radius (px) [eg. 50]: ")
try:
    radius = float(radius_input)
    if radius < 0:
        raise ValueError("Radius must be a non-negative number")
except ValueError:
    raise ValueError(f"Invalid radius value: {radius_input}. Must be a non-negative number.")

binary_data = get_file(file_name)
img = Image.open(io.BytesIO(binary_data)).convert("RGBA")
w, h = img.size
mask = Image.new("L", (w, h), 0)
draw = ImageDraw.Draw(mask)
draw.rounded_rectangle((0, 0, w, h), radius=radius, fill=255)
img.putalpha(mask)
buffer = io.BytesIO()
img.save(buffer, format="PNG")
download(save_name, buffer.getvalue())
```
