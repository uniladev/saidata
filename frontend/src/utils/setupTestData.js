// ===== Test Data Setup Function =====
// frontend/src/utils/setupTestData.js

export const setupTestFormData = () => {
  // Clear any existing forms
  localStorage.removeItem('myForms');
  
  // Import sample forms
  const { sampleForms } = require('../data/sampleForms');
  
  // Save sample forms to localStorage
  localStorage.setItem('myForms', JSON.stringify(sampleForms));
  
  console.log('Sample forms loaded:', sampleForms.length);
  console.log('Form IDs:', sampleForms.map(f => f.form.id));
  
  return sampleForms;
};