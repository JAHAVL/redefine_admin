#!/bin/bash

# Fix all NEW.tsx files to use direct imports for MainPageTemplate
echo "Fixing MainPageTemplate imports in all NEW.tsx files..."

# Find all NEW.tsx files, output as one file per line
find "/Users/jordanhardison/Documents/Code Projects/EMERGENCY/redefine_admin/src/pages" -name "*NEW.tsx" -type f | while read file; do
  echo "Checking $file"
  
  # Check if the file uses the dynamic require pattern for MainPageTemplate
  if grep -q "const MainPageTemplate = require(getComponentPath" "$file"; then
    echo "Fixing $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Process the file line by line to replace the dynamic imports
    cat "$file" | (
      main_import_added=false
      comment_replaced=false
      
      while IFS= read -r line; do
        # Replace the dynamic require with a direct import
        if [[ "$line" == *"const MainPageTemplate = require(getComponentPath"* ]]; then
          # Skip this line - we'll add the import at the top
          continue
        # Replace the comment line if found
        elif [[ "$line" == *"// Using pathconfig system for consistent imports"* ]]; then
          echo "// Using direct import for MainPageTemplate and pathconfig for other components" >> "$temp_file"
          comment_replaced=true
        # Add the direct import right after the getComponentPath import
        elif [[ "$line" == *"import { getComponentPath } from '../../utils/pathconfig';"* ]] && [ "$main_import_added" = false ]; then
          echo "$line" >> "$temp_file"
          echo "import MainPageTemplate from '../../layouts/MainPageTemplate/MainPageTemplate';" >> "$temp_file"
          main_import_added=true
        else
          echo "$line" >> "$temp_file"
        fi
      done
    )
    
    # Move the temporary file to replace the original
    mv "$temp_file" "$file"
  fi
done

echo "Done fixing all pages!"
