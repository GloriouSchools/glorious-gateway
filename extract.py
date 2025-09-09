import os
import shutil

# Set the main folder where subfolders with photos are stored
source_folder = r"C:\Users\Fresh Teacher\Downloads\PASSPORTS"

# Set the folder where you want all photos to be collected
destination_folder = r"C:\Users\Fresh Teacher\Downloads\ALL_PHOTOS"

# Create destination folder if it does not exist
os.makedirs(destination_folder, exist_ok=True)

# Allowed photo extensions
photo_extensions = {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"}

# Go through all subfolders
for root, dirs, files in os.walk(source_folder):
    for file in files:
        # Check if the file is a photo
        if os.path.splitext(file)[1].lower() in photo_extensions:
            source_file = os.path.join(root, file)
            destination_file = os.path.join(destination_folder, file)

            # If a file with the same name already exists, rename it
            base, ext = os.path.splitext(file)
            counter = 1
            while os.path.exists(destination_file):
                destination_file = os.path.join(destination_folder, f"{base}_{counter}{ext}")
                counter += 1

            # Copy the file
            shutil.copy2(source_file, destination_file)

print("✅ All photos have been collected into:", destination_folder)
