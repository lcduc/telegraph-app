const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

// Find the docx file by scanning the data/football directory
const dataDir = path.resolve('./data/football');

let docxPath = null;

try {
  const items = fs.readdirSync(dataDir);
  
  for (const item of items) {
    const itemPath = path.join(dataDir, item);
    const stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      const newsItems = fs.readdirSync(itemPath);
      
      for (const newsItem of newsItems) {
        if (newsItem.endsWith('.docx')) {
          docxPath = path.join(itemPath, newsItem);
          break;
        }
      }
    }
  }
} catch (err) {
  console.error('Error scanning:', err.message);
}

if (!docxPath) {
  console.error('Could not find docx file');
  process.exit(1);
}

async function inspectDocx() {
  try {
    const result = await mammoth.convertToHtml({ path: docxPath });
    
    const html = result.value;
    
    // Get the section around img2
    const img2Index = html.indexOf('[img2]');
    if (img2Index > -1) {
      console.log('=== HTML AROUND [img2] (500 chars before and after) ===');
      const start = Math.max(0, img2Index - 500);
      const end = Math.min(html.length, img2Index + 500);
      console.log(html.substring(start, end));
      console.log('\n=== RAW SUBSTRING ===');
      const section = html.substring(img2Index, img2Index + 200);
      console.log(JSON.stringify(section));
    }
    
    console.log('\n=== CHECKING FOR STYLE ATTRIBUTES ===');
    if (html.includes('style="') || html.includes('align=')) {
      console.log('Found style or align attributes');
      const styleMatches = html.match(/style="[^"]*center[^"]*"/g) || [];
      const alignMatches = html.match(/align="[^"]*center[^"]*"/g) || [];
      console.log('Style center matches:', styleMatches.length);
      console.log('Align center matches:', alignMatches.length);
      styleMatches.slice(0, 3).forEach(match => console.log('  -', match));
      alignMatches.slice(0, 3).forEach(match => console.log('  -', match));
    } else {
      console.log('NO style or align attributes found in HTML');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

inspectDocx();
