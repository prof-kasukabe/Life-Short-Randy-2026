#!/bin/bash

# Remove the 'visual' top-level tab and revert to 'Curated Works'
sed -i 's/>          Curated Verbal/>          Curated Works/g' src/pages/Admin.tsx
sed -i '/>          Curated Visual/,-3d' src/pages/Admin.tsx

