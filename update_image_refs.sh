#!/bin/bash

# Script to update image file references in out/docs/llm.txt
# Maps original filenames to their hashed versions in out/_next/static/media/

set -e

LLM_FILE="out/docs/llm.txt"
MEDIA_DIR="out/_next/static/media"

if [[ ! -f "$LLM_FILE" ]]; then
    echo "Error: $LLM_FILE not found"
    exit 1
fi

if [[ ! -d "$MEDIA_DIR" ]]; then
    echo "Error: $MEDIA_DIR directory not found"
    exit 1
fi

# Function to find hashed filename in media directory
find_hashed_file() {
    local original_name="$1"
    local base_name="${original_name%.*}"
    local extension="${original_name##*.}"
    
    # Look for files that start with the base name and end with the extension
    find "$MEDIA_DIR" -name "${base_name}.*${extension}" | head -1
}

# Extract unique image filenames from llm.txt
echo "Extracting image references from $LLM_FILE..."
image_files=$(grep -oE '\./images/[^)]+\.(png|svg|jpg|jpeg)' "$LLM_FILE" | sed 's|./images/||' | sort -u)

declare -A replacements

# Build replacement mapping
echo "Building filename mappings..."
while IFS= read -r original_file; do
    if [[ -n "$original_file" ]]; then
        hashed_file=$(find_hashed_file "$original_file")
        if [[ -n "$hashed_file" ]]; then
            hashed_basename=$(basename "$hashed_file")
            replacements["./images/$original_file"]="/_next/static/media/$hashed_basename"
            echo "  $original_file -> $hashed_basename"
        else
            echo "  WARNING: No hashed version found for $original_file"
        fi
    fi
done <<< "$image_files"

# Apply replacements
echo "Applying replacements to $LLM_FILE..."
temp_file=$(mktemp)
cp "$LLM_FILE" "$temp_file"

for original_path in "${!replacements[@]}"; do
    new_path="${replacements[$original_path]}"
    sed -i "s|${original_path}|${new_path}|g" "$temp_file"
done

mv "$temp_file" "$LLM_FILE"

# Show summary of changes
echo ""
echo "Summary of changes:"
for original_path in "${!replacements[@]}"; do
    new_path="${replacements[$original_path]}"
    count=$(grep -c "$new_path" "$LLM_FILE" || true)
    echo "  $original_path -> $new_path ($count occurrences)"
done