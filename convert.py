import os
import json

folder_path = r"e:/uganda-education-hub/public"

all_files = os.listdir(folder_path)
image_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff')
image_files = [f for f in all_files if f.lower().endswith(image_extensions)]

data = {"images": image_files}

with open("images.json", "w") as json_file:
    json.dump(data, json_file, indent=4)

print(f"JSON file created with {len(image_files)} images.")
