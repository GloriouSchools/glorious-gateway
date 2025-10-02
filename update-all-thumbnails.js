// Simple script to fix all thumbnail paths
const fs = require('fs');

const filePath = 'src/data/movieData.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace all paths that still use "thumbnails/"
const updatedContent = content.replace(/"thumbnail": "thumbnails\//g, '"thumbnail": "/assets/thumbnails/');

fs.writeFileSync(filePath, updatedContent);
console.log('Updated all thumbnail paths!');