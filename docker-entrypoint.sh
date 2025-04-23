#!/bin/sh

# Ensure the App.tsx file is accessible
if [ -f "/app/src/App.tsx" ]; then
  echo "App.tsx exists, ensuring it's properly linked"
  # Create a backup if needed
  cp -f /app/src/App.tsx /app/src/App.tsx.bak
fi

# Ensure the reportWebVitals.ts file is accessible
if [ -f "/app/src/reportWebVitals.ts" ]; then
  echo "reportWebVitals.ts exists, ensuring it's properly linked"
  # Create a backup if needed
  cp -f /app/src/reportWebVitals.ts /app/src/reportWebVitals.ts.bak
fi

# Ensure the routes directory exists and AppRoutes.tsx is accessible
if [ -f "/app/src/routes/AppRoutes.tsx" ]; then
  echo "AppRoutes.tsx exists, ensuring it's properly linked"
  # Create a backup if needed
  cp -f /app/src/routes/AppRoutes.tsx /app/src/routes/AppRoutes.tsx.bak
fi

# Start the application
echo "Starting React application..."
exec npm start
