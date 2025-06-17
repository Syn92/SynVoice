const fs = require('fs');
const csv = require('csv-parse/sync');

console.log('📥 Importing content from CSV back to dictionaries...\n');

try {
  // Read the CSV file
  const csvContent = fs.readFileSync('./website-content.csv', 'utf8');
  
  // Parse CSV
  const records = csv.parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  });

  console.log(`📄 Found ${records.length} entries in CSV`);

  // Initialize dictionary objects
  const enDict = {};
  const frDict = {};

  // Helper function to set nested object property
  function setNestedProperty(obj, path, value) {
    const keys = path.split(' > ');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      
      // Handle array notation [1], [2], etc.
      if (key.includes('[') && key.includes(']')) {
        const arrayKey = key.substring(0, key.indexOf('['));
        const arrayIndex = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']'))) - 1;
        
        if (!current[arrayKey]) current[arrayKey] = [];
        if (!current[arrayKey][arrayIndex]) current[arrayKey][arrayIndex] = {};
        current = current[arrayKey][arrayIndex];
      } else {
        if (!current[key]) current[key] = {};
        current = current[key];
      }
    }
    
    const finalKey = keys[keys.length - 1];
    if (finalKey.includes('[') && finalKey.includes(']')) {
      const arrayKey = finalKey.substring(0, finalKey.indexOf('['));
      const arrayIndex = parseInt(finalKey.substring(finalKey.indexOf('[') + 1, finalKey.indexOf(']'))) - 1;
      
      if (!current[arrayKey]) current[arrayKey] = [];
      current[arrayKey][arrayIndex] = value;
    } else {
      current[finalKey] = value;
    }
  }

  // Process each record
  records.forEach((record, index) => {
    const section = record.Section.toLowerCase();
    const field = record.Field;
    const english = record.English;
    const french = record.French;

    try {
      // Initialize section if it doesn't exist
      if (!enDict[section]) enDict[section] = {};
      if (!frDict[section]) frDict[section] = {};

      // Set the values
      setNestedProperty(enDict[section], field, english);
      setNestedProperty(frDict[section], field, french);
      
    } catch (error) {
      console.warn(`⚠️  Warning: Could not process row ${index + 1}: ${error.message}`);
    }
  });

  // Write back to dictionary files
  fs.writeFileSync('./app/[lang]/dictionaries/en.json', JSON.stringify(enDict, null, 2));
  fs.writeFileSync('./app/[lang]/dictionaries/fr.json', JSON.stringify(frDict, null, 2));

  console.log('\n✅ Dictionaries updated successfully!');
  console.log('📁 Updated files:');
  console.log('   - app/[lang]/dictionaries/en.json');
  console.log('   - app/[lang]/dictionaries/fr.json');
  console.log('\n🚀 Your website content has been updated!');

} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('\n💡 Make sure:');
  console.log('   1. website-content.csv exists in the root directory');
  console.log('   2. The CSV has the correct format (Section, Field, English, French)');
  console.log('   3. Run: npm install csv-parse');
} 