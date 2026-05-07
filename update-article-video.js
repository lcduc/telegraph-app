const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function updateArticleVideo() {
  const OUTPUT_FILE = './public/articles.json';
  
  // Read current articles.json
  const articles = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
  
  // Find article ID 104
  const article = articles.find(a => a.id === 104);
  if (!article) {
    console.error('Article ID 104 not found');
    process.exit(1);
  }

  console.log(`Updating article ID 104: ${article.title}`);

  // Check if article already has videos property
  if (!article.videos) {
    article.videos = {};
  }

  // Look for video placeholders in body
  const videoPlaceholderRegex = /[\[\{]vid(\d+)[\]\}]/gi;
  const videoPlaceholders = [...article.body.matchAll(videoPlaceholderRegex)];

  if (videoPlaceholders.length === 0) {
    console.log('No video placeholders found in article');
    process.exit(0);
  }

  // Parse article folder path from image URL (extract date/category/folder)
  // Example: https://res.cloudinary.com/dfjnqcbj0/image/upload/v1778121579/telegraph/2026_04_09/Football/Barca%200-2%20ATM/article-103-1.webp
  const imageUrl = article.images?.img1;
  if (!imageUrl) {
    console.error('No images found in article to determine folder path');
    process.exit(1);
  }

  // Extract date and folder from URL
  const urlParts = imageUrl.split('/telegraph/')[1]?.split('/');
  if (!urlParts || urlParts.length < 3) {
    console.error('Could not parse folder path from image URL');
    process.exit(1);
  }

  const dateFolder = urlParts[0]; // e.g., 2026_04_09
  const category = urlParts[1];   // e.g., Football
  const newsFolder = urlParts[2]; // e.g., Barca%200-2%20ATM (URL encoded)
  const decodedNewsFolder = decodeURIComponent(newsFolder); // Decode URL encoding

  const newsPath = path.join('./data', dateFolder, category, decodedNewsFolder);
  console.log(`News path: ${newsPath}`);

  if (!fs.existsSync(newsPath)) {
    console.error(`News folder not found: ${newsPath}`);
    process.exit(1);
  }

  // Process video placeholders
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];
  let videosUpdated = 0;

  for (const match of videoPlaceholders) {
    const vidNum = match[1];
    const videoName = `vid${vidNum}`;

    // Look for video file matching the placeholder
    for (const ext of videoExtensions) {
      const videoPath = path.join(newsPath, `${videoName}${ext}`);
      if (fs.existsSync(videoPath)) {
        try {
          console.log(`  Uploading ${videoName}${ext}...`);
          // Upload to Cloudinary as video
          const result = await cloudinary.uploader.upload(videoPath, {
            folder: `telegraph/${dateFolder}/${category}/${decodedNewsFolder}`,
            public_id: `article-104-${vidNum}`,
            overwrite: true,
            resource_type: 'video'
          });

          article.videos[videoName] = result.secure_url;
          videosUpdated++;

          console.log(`  ✓ Uploaded to Cloudinary: ${videoName} (${result.public_id})`);
        } catch (uploadError) {
          console.error(`  ✗ Failed to upload ${videoName}:`, uploadError.message);
        }
        break;
      }
    }

    if (!article.videos[videoName]) {
      console.warn(`  ⚠ Video file ${videoName} not found in ${newsPath}`);
    }
  }

  // Write updated articles.json
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2));
  console.log(`\n✓ Article ID 104 updated with ${videosUpdated} video(s)`);
  console.log(`✓ Updated ${OUTPUT_FILE}`);
}

updateArticleVideo().catch(err => {
  console.error('Error updating article:', err);
  process.exit(1);
});
