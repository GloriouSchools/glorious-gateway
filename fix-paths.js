const fs = require('fs');
const path = require('path');

// Read the movieData.ts file
const filePath = path.join(__dirname, 'src/data/movieData.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace all thumbnail paths
content = content.replace(/"thumbnail": "thumbnails\//g, '"thumbnail": "/assets/thumbnails/');

// Write back
fs.writeFileSync(filePath, content);

console.log('Fixed all thumbnail paths!');