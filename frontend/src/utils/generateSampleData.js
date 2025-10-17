// ===== Sample Data Generator Function =====
// frontend/src/utils/generateSampleData.js

export const generateSampleData = (fields) => {
  const sampleData = {};
  
  fields.forEach(field => {
    switch (field.type) {
      case 'text':
        if (field.name.includes('firstName')) {
          sampleData[field.name] = 'John';
        } else if (field.name.includes('lastName')) {
          sampleData[field.name] = 'Doe';
        } else if (field.name.includes('city')) {
          sampleData[field.name] = 'San Francisco';
        } else if (field.name.includes('state')) {
          sampleData[field.name] = 'California';
        } else if (field.name.includes('postalCode')) {
          sampleData[field.name] = '94102';
        } else if (field.name.includes('jobTitle')) {
          sampleData[field.name] = 'Senior Software Engineer';
        } else {
          sampleData[field.name] = `Sample ${field.label}`;
        }
        break;
        
      case 'email':
        sampleData[field.name] = 'john.doe@example.com';
        break;
        
      case 'phone':
        sampleData[field.name] = '+1 (555) 123-4567';
        break;
        
      case 'date':
        const today = new Date();
        if (field.name.includes('birth')) {
          sampleData[field.name] = '1990-01-15';
        } else if (field.name.includes('start')) {
          const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
          sampleData[field.name] = nextMonth.toISOString().split('T')[0];
        } else {
          sampleData[field.name] = today.toISOString().split('T')[0];
        }
        break;
        
      case 'time':
        sampleData[field.name] = '09:00';
        break;
        
      case 'number':
        if (field.name.includes('years')) {
          sampleData[field.name] = '5';
        } else if (field.name.includes('age')) {
          sampleData[field.name] = '30';
        } else {
          sampleData[field.name] = String(Math.floor((field.min + field.max) / 2) || 10);
        }
        break;
        
      case 'textarea':
        if (field.name.includes('address')) {
          sampleData[field.name] = '123 Main Street\nApartment 4B';
        } else if (field.name.includes('about')) {
          sampleData[field.name] = 'I am a passionate professional with extensive experience in my field. I enjoy working in collaborative environments and am always eager to learn new skills.';
        } else {
          sampleData[field.name] = 'This is sample text for the textarea field. It can contain multiple lines of content.';
        }
        break;
        
      case 'select':
        if (field.options && field.options.length > 0) {
          sampleData[field.name] = field.options[0].value;
        }
        break;
        
      case 'radio':
        if (field.options && field.options.length > 0) {
          sampleData[field.name] = field.options[0].value;
        }
        break;
        
      case 'checkbox':
        if (field.options && field.options.length > 0) {
          // Select first two options
          sampleData[field.name] = field.options.slice(0, 2).map(opt => opt.value);
        }
        break;
        
      case 'rating':
        sampleData[field.name] = field.maxRating ? Math.ceil(field.maxRating * 0.8) : 4;
        break;
        
      case 'range':
        const midValue = Math.floor((field.min + field.max) / 2);
        sampleData[field.name] = midValue;
        break;
        
      case 'color':
        sampleData[field.name] = '#3B82F6'; // Nice blue color
        break;
        
      case 'url':
        if (field.name.includes('linkedin')) {
          sampleData[field.name] = 'https://linkedin.com/in/johndoe';
        } else {
          sampleData[field.name] = 'https://example.com';
        }
        break;
        
      case 'file':
        // Can't auto-fill file inputs, but we can indicate what should be uploaded
        console.log(`File field "${field.label}" expects: ${field.fileOptions?.accept || 'any file type'}`);
        break;
        
      default:
        // Skip section headers and unknown types
        break;
    }
  });
  
  return sampleData;
};
