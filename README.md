# Telegraph App

A sports news application built with React.

## Running the App

```bash
npm start
```

Opens the app in development mode at [http://localhost:3000](http://localhost:3000).

## Updating Data

Articles are stored in the `data/` directory organized by date and category:

```
data/
├── yyyy_mm_dd/
│   ├── Category/
│   │   └── Article Title/
│   │       ├── article.docx          # Article content
│   │       ├── img1.jpg              # Article preview image
│   │       ├── img2.jpg              # Additional images
│   │       └── ...
```

### Steps to Add or Update Articles:

1. Create a folder in `data/` with the date format `yyyy_mm_dd`
2. Inside, create a category folder (e.g., `Football`, `Tennis`, `F1`)
3. Inside the category, create a folder with the article title
4. Add your `.docx` file (article content)
5. Add images named `img1.jpg`, `img2.png`, `img3.gif`, etc. (supports JPG, PNG, GIF, WebP)
6. Reference images in your article using `[img1]`, `[img2]`, etc.
7. Run `node generate-articles.js` to process all articles and generate `public/articles.json`

Images are automatically uploaded to Cloudinary and linked in the article.
