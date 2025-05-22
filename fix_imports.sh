#!/bin/bash

# Fix all NEW.tsx files to use direct imports for MainPageTemplate
echo "Fixing MainPageTemplate imports in all NEW.tsx files..."

# Find all NEW.tsx files
FILES=$(find /Users/jordanhardison/Documents/Code\ Projects/EMERGENCY/redefine_admin/src/pages -name "*NEW.tsx")

for file in $FILES; do
  echo "Checking $file"
  
  # Check if the file uses the dynamic require pattern for MainPageTemplate
  if grep -q "const MainPageTemplate = require(getComponentPath" "$file"; then
    echo "Fixing $file"
    
    # Replace the dynamic require with a direct import
    sed -i '' 's/const MainPageTemplate = require(getComponentPath.*).default;/import MainPageTemplate from '"'"'..\/..\/layouts\/MainPageTemplate\/MainPageTemplate'"'"';/g' "$file"
    
    # Ensure we're not duplicating import statements
    if grep -q "import.*getComponentPath.*from.*'..\/..\/utils\/pathconfig'" "$file" && grep -q "// Using pathconfig system for consistent imports" "$file"; then
      sed -i '' 's/\/\/ Using pathconfig system for consistent imports/\/\/ Using direct import for MainPageTemplate and pathconfig for other components/g' "$file"
    fi
  fi
done

echo "Done fixing imports!"
