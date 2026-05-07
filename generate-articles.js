const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const DATA_DIR = './data';
const OUTPUT_FILE = './public/articles.json';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function generateArticles() {
  const articles = [];
  let articleId = 1;

  // Scan all date folders (yyyy_mm_dd format)
  const dateFolders = fs.readdirSync(DATA_DIR);

  for (const dateFolder of dateFolders) {
    const datePath = path.join(DATA_DIR, dateFolder);
    if (!fs.statSync(datePath).isDirectory()) continue;

    // Scan all category folders in the date folder
    const categoryFolders = fs.readdirSync(datePath);

    for (const category of categoryFolders) {
      const categoryPath = path.join(datePath, category);
      if (!fs.statSync(categoryPath).isDirectory()) continue;

      // Scan all news folders in the category
      const newsFolders = fs.readdirSync(categoryPath);

      for (const newsFolder of newsFolders) {
        const newsPath = path.join(categoryPath, newsFolder);
        if (!fs.statSync(newsPath).isDirectory()) continue;

        // Find docx file
        const files = fs.readdirSync(newsPath);
        const docxFile = files.find(f => f.endsWith('.docx'));

        if (docxFile) {
          const filePath = path.join(newsPath, docxFile);
        
        try {
          // Configure mammoth to preserve formatting including alignment and centered text
          const styleMap = [
            "p[style-name='Centered'] => p.centered-text",
            "p[alignment='center'] => p.centered-text",
            // Also handle right-aligned
            "p[style-name='Right'] => p.right-text",
            "p[alignment='right'] => p.right-text",
          ];
          
          const result = await mammoth.convertToHtml({ 
            path: filePath,
            styleMap: styleMap
          });
          let htmlText = result.value;
          
          // Post-process HTML to properly style centered and aligned paragraphs
          // Handle paragraph with centered-text class (with or without other attributes)
          htmlText = htmlText.replace(/<p[^>]*class="centered-text"[^>]*>/g, (match) => {
            return match.replace('>', ' style="text-align: center;">');
          });
          htmlText = htmlText.replace(/<p[^>]*class="centered-text"[^>]*>/g, (match) => {
            // Don't double-style if already has style
            if (match.includes('style=')) return match;
            return match.replace('>', ' style="text-align: center;">');
          });
          
          // Handle paragraph with right-text class
          htmlText = htmlText.replace(/<p[^>]*class="right-text"[^>]*>/g, (match) => {
            if (match.includes('style=')) return match;
            return match.replace('>', ' style="text-align: right;">');
          });
          
          // Also extract plain text for title and excerpt
          const plainTextResult = await mammoth.extractRawText({ path: filePath });
          let plainText = plainTextResult.value.trim();
          
          // Look for ALL image placeholders like [img1], {img1}, [img2], etc.
          const imagePlaceholderRegex = /[\[\{]img(\d+)[\]\}]/gi;
          const imagePlaceholders = [...plainText.matchAll(imagePlaceholderRegex)];
          
          const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
          const imagesMap = {}; // Map of img1 -> /images/articles/article-1-1.jpg
          let primaryImage = `https://via.placeholder.com/400x250?text=Article`;
          let img1Found = false; // Track if img1 exists
          
          // First, try to find and upload img1 specifically for preview
          for (const ext of imageExtensions) {
            const img1Path = path.join(newsPath, `img1${ext}`);
            if (fs.existsSync(img1Path)) {
              img1Found = true;
              try {
                const result = await cloudinary.uploader.upload(img1Path, {
                  folder: `telegraph/${dateFolder}/${category}/${newsFolder}`,
                  public_id: `article-${articleId}-1`,
                  overwrite: true,
                  resource_type: 'auto'
                });
                imagesMap['img1'] = result.secure_url;
                primaryImage = result.secure_url;
                console.log(`  ✓ Uploaded to Cloudinary: img1 (${result.public_id})`);
              } catch (uploadError) {
                console.error(`  ✗ Failed to upload img1:`, uploadError.message);
              }
              break;
            }
          }
          
          // Process remaining image placeholders
          for (const match of imagePlaceholders) {
            const imgNum = match[1];
            const imageName = `img${imgNum}`;
            
            // Skip img1 since we already processed it
            if (imageName === 'img1') continue;
            
            // Look for image file matching the placeholder
            for (const ext of imageExtensions) {
              const imagePath = path.join(newsPath, `${imageName}${ext}`);
              if (fs.existsSync(imagePath)) {
                try {
                  // Upload to Cloudinary
                  const result = await cloudinary.uploader.upload(imagePath, {
                    folder: `telegraph/${dateFolder}/${category}/${newsFolder}`,
                    public_id: `article-${articleId}-${imgNum}`,
                    overwrite: true,
                    resource_type: 'auto'
                  });
                  
                  imagesMap[imageName] = result.secure_url;
                  
                  console.log(`  ✓ Uploaded to Cloudinary: ${imageName} (${result.public_id})`);
                } catch (uploadError) {
                  console.error(`  ✗ Failed to upload ${imageName}:`, uploadError.message);
                }
                break;
              }
            }
          }

          // Process video placeholders like [vid1], [vid2], etc.
          const videosMap = {}; // Map of vid1 -> cloudinary video URL
          const videoPlaceholderRegex = /[\[\{]vid(\d+)[\]\}]/gi;
          const videoPlaceholders = [...plainText.matchAll(videoPlaceholderRegex)];
          const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];

          for (const match of videoPlaceholders) {
            const vidNum = match[1];
            const videoName = `vid${vidNum}`;

            // Look for video file matching the placeholder
            for (const ext of videoExtensions) {
              const videoPath = path.join(newsPath, `${videoName}${ext}`);
              if (fs.existsSync(videoPath)) {
                try {
                  // Upload to Cloudinary as video
                  const result = await cloudinary.uploader.upload(videoPath, {
                    folder: `telegraph/${dateFolder}/${category}/${newsFolder}`,
                    public_id: `article-${articleId}-${vidNum}`,
                    overwrite: true,
                    resource_type: 'video'
                  });

                  videosMap[videoName] = result.secure_url;

                  console.log(`  ✓ Uploaded to Cloudinary: ${videoName} (${result.public_id})`);
                } catch (uploadError) {
                  console.error(`  ✗ Failed to upload ${videoName}:`, uploadError.message);
                }
                break;
              }
            }
          }

          // Parse plain text for title and excerpt
          const lines = plainText.split('\n').filter(l => l.trim());
          const title = (lines[0] || 'Untitled').substring(0, 100);
          const excerpt = lines.slice(1, 3).join(' ').substring(0, 150) + '...';

          // Parse date from folder name (DD_MM_YYYY format)
          const [day, month, year] = dateFolder.split('_');
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const formattedDate = `${parseInt(day)} ${monthNames[parseInt(month) - 1]} ${year}`;

          const article = {
            id: articleId,
            title: title,
            category: category.toUpperCase(),
            featured: articleId <= 3,
            author: 'Telegraph Sports',
            authorTitle: 'Sports Correspondent',
            date: formattedDate,
            image: primaryImage,
            images: imagesMap, // Store all images keyed by img1, img2, etc
            videos: videosMap, // Store all videos keyed by vid1, vid2, etc
            excerpt: excerpt,
            body: htmlText, // Store HTML with formatting
            relatedArticles: []
          };

          articles.push(article);
          articleId++;

          console.log(`✓ Loaded: ${dateFolder}/${category}/${newsFolder} (ID: ${article.id - 1})`);
        } catch (error) {
          console.error(`✗ Error reading ${filePath}:`, error.message);
        }
        }
      }
    }
  }

  // Sort articles by date (newest first)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  articles.sort((a, b) => {
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split(' ');
      const monthIndex = monthNames.indexOf(month);
      return new Date(year, monthIndex, day);
    };
    return parseDate(b.date) - parseDate(a.date);
  });

  // Re-assign IDs after sorting
  articles.forEach((article, index) => {
    article.id = index + 1;
  });

  // Add related articles (link each article to similar ones)
  for (let i = 0; i < articles.length; i++) {
    const relatedByCategory = articles
      .map((a, idx) => ({ article: a, index: idx }))
      .filter(({ article, index }) => 
        article.category === articles[i].category && index !== i
      )
      .slice(0, 3)
      .map(({ article }) => article.id);
    
    articles[i].relatedArticles = relatedByCategory;
  }

  // Write to public folder so React can access it
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2));
  console.log(`\n✓ Articles saved to ${OUTPUT_FILE}`);
  console.log(`✓ Images uploaded to Cloudinary`);
  console.log(`Total articles: ${articles.length}`);
}

generateArticles().catch(err => {
  console.error('Error generating articles:', err);
  process.exit(1);
});
