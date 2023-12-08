import ejs from 'ejs';
import fs from 'fs/promises';
import * as path from 'path';
import { readdirSync } from 'fs';

const currentFilePath = new URL(import.meta.url).pathname;
const __dirname = path.dirname(currentFilePath).replace(/^\/([A-Z]):/, '$1:');

const ejsDir = path.join(__dirname, 'views').replace(/^\/([A-Z]):/, '$1:'); // Directory containing EJS files
const outputDir = path.join(__dirname, 'output').replace(/^\/([A-Z]):/, '$1:'); // Directory to store generated HTML files

// Function to render EJS template to HTML
async function renderToHTML(fileName) {
    try {
        const filePath = path.join(ejsDir, fileName);
        console.log('Processing:', filePath); // Log the file being processed
        const ejsTemplate = await fs.readFile(filePath, 'utf8');
        const html = ejs.render(ejsTemplate);
        const htmlFileName = fileName.replace('.ejs', '.html');
        const outputPath = path.join(outputDir, htmlFileName);
        await fs.writeFile(outputPath, html);
        console.log('Reading:', filePath);
        console.log('HTML:', html);
        console.log('Generated:', outputPath); // Log the generated HTML file
    } catch (err) {
        console.error('Error:', err);
    }
}
async function createDirectories() {
    try {
        await fs.mkdir(ejsDir, { recursive: true });
        await fs.mkdir(outputDir, { recursive: true });
    } catch (err) {
        console.error('Error creating directories:', err);
    }
}

// Create output directory if it doesn't exist
async function createOutputDir() {
    try {
        await fs.mkdir(outputDir, { recursive: true });
    } catch (err) {
        console.error('Error creating output directory:', err);
    }
}

// Read all EJS files and generate HTML
async function generateHTML() {
    try {
        await createDirectories();
        await createOutputDir();
        console.log('EJS Directory:', ejsDir);
        const files = await fs.readdir(ejsDir);
        console.log('Files:', files);
        for (const file of files) {
            console.log('File:', file);
            if (file.endsWith('.ejs')) {
                await renderToHTML(path.join(ejsDir, file));
            }
        }
    } catch (err) {
        console.error('Error generating HTML:', err);
    }
}
function listFilesSync(directory) {
    try {
        const files = readdirSync(directory);
        console.log('Files:', files);
    } catch (err) {
        console.error('Error listing files:', err);
    }
}

listFilesSync(ejsDir);
generateHTML(); // Execute the HTML generation process
