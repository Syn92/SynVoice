const fs = require('fs');
const path = require('path');

// Read dictionary files
const enDict = JSON.parse(fs.readFileSync('./app/[lang]/dictionaries/en.json', 'utf8'));
const frDict = JSON.parse(fs.readFileSync('./app/[lang]/dictionaries/fr.json', 'utf8'));

// CSV data array
const csvData = [];

// Helper function to escape CSV values
function escapeCSV(value) {
  if (typeof value !== 'string') return value;
  // Escape quotes and wrap in quotes if contains comma, quote, or newline
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

// Helper function to flatten nested objects
function flattenSection(sectionName, sectionData, enData, frData, prefix = '') {
  Object.keys(sectionData).forEach(key => {
    const currentPath = prefix ? `${prefix}.${key}` : key;
    const fieldName = prefix ? `${prefix} > ${key}` : key;
    
    if (typeof sectionData[key] === 'object' && !Array.isArray(sectionData[key])) {
      // Recursive call for nested objects
      flattenSection(sectionName, sectionData[key], enData[key], frData[key], fieldName);
    } else if (Array.isArray(sectionData[key])) {
      // Handle arrays (like testimonials, FAQ items)
      sectionData[key].forEach((item, index) => {
        if (typeof item === 'object') {
          Object.keys(item).forEach(itemKey => {
            csvData.push([
              sectionName,
              `${fieldName} [${index + 1}] > ${itemKey}`,
              escapeCSV(enData[key][index][itemKey]),
              escapeCSV(frData[key][index][itemKey])
            ]);
          });
        } else {
          csvData.push([
            sectionName,
            `${fieldName} [${index + 1}]`,
            escapeCSV(enData[key][index]),
            escapeCSV(frData[key][index])
          ]);
        }
      });
    } else {
      // Simple string values
      csvData.push([
        sectionName,
        fieldName,
        escapeCSV(enData[key]),
        escapeCSV(frData[key])
      ]);
    }
  });
}

// Process each section
Object.keys(enDict).forEach(sectionName => {
  const sectionDisplayName = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
  flattenSection(sectionDisplayName, enDict[sectionName], enDict[sectionName], frDict[sectionName]);
});

// Create CSV header
const csvHeader = ['Section', 'Field', 'English', 'French'];

// Combine header and data
const fullCSV = [csvHeader, ...csvData];

// Convert to CSV string
const csvString = fullCSV.map(row => row.join(',')).join('\n');

// Write to file
const outputPath = './website-content.csv';
fs.writeFileSync(outputPath, csvString);

console.log(`✅ CSV generated successfully!`);
console.log(`📄 File saved as: ${outputPath}`);
console.log(`📊 Total entries: ${csvData.length}`);
console.log(`\n🚀 You can now:`);
console.log(`   1. Open the CSV file in Excel/Google Sheets`);
console.log(`   2. Share with your team for content review`);
console.log(`   3. Make edits collaboratively`);
console.log(`   4. Import changes back to update the dictionaries`); 