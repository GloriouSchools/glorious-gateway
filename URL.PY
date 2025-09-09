import pandas as pd

# Load your CSV
input_file = r"C:\Users\Fresh Teacher\Downloads\students_rows.csv"
output_file = r"C:\Users\Fresh Teacher\Downloads\students_with_photos.csv"

# Base URL
base_url = "https://fresh-teacher.github.io/gloriouschool/"

# Load CSV
df = pd.read_csv(input_file)

# Column B is index 1 (since pandas starts at 0)
# Column E is index 4
df.iloc[:, 4] = base_url + df.iloc[:, 1].astype(str) + ".JPG"

# Save updated file
df.to_csv(output_file, index=False)

print("✅ Photo URLs updated in column E! Saved as:", output_file)
