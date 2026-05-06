const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const OUTPUT_FILE = './public/articles.json';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadAndUpdateArticle(imagePath, articleId) {
  try {
    // Check if image exists
    if (!fs.existsSync(imagePath)) {
      console.error(`✗ Image not found: ${imagePath}`);
      process.exit(1);
    }

    console.log(`Uploading image: ${imagePath}`);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: `telegraph/updates`,
      public_id: `article-${articleId}-img1`,
      overwrite: true,
      resource_type: 'auto'
    });

    const imageUrl = result.secure_url;
    console.log(`✓ Uploaded to Cloudinary: ${imageUrl}`);

    // Read current articles
    const articles = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));

    // Find article by ID
    const article = articles.find(a => a.id === articleId);

    if (!article) {
      console.error(`✗ Article with ID ${articleId} not found`);
      process.exit(1);
    }

    console.log(`Found article: "${article.title}"`);
    console.log(`Old image: ${article.image}`);

    // Update the image
    article.image = imageUrl;
    
    // Update the images field - add img1
    if (!article.images) {
      article.images = {};
    }
    article.images.img1 = imageUrl;

    console.log(`Updated images field - img1: ${imageUrl}`);

    // Write back to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2));

    console.log(`✓ Updated image and images field`);
    console.log(`✓ Saved to ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Get arguments from command line
const imagePath = process.argv[2];
const articleId = parseInt(process.argv[3]);

if (!imagePath || !articleId) {
  console.log('Usage: node upload-and-update-article.js <imagePath> <articleId>');
  console.log('Example: node upload-and-update-article.js "data/2026_05_04/Basketball/Antony/img1.jpg" 125');
  process.exit(1);
}

uploadAndUpdateArticle(imagePath, articleId);
