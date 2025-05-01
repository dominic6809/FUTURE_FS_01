// client/src/utils/dateUtils.js

// Format a date in a readable format
export const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return '';
    
    // Format as "Month Year" (e.g., "January 2023")
    return date.toLocaleString('en-US', { 
      month: 'long', 
      year: 'numeric'
    });
  };
  
  // Get relative time (e.g., "2 days ago", "3 months ago")
  export const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return '';
    
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const now = new Date();
    const diffInMs = date - now;
    const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));
    const diffInMonths = Math.round(diffInDays / 30);
    const diffInYears = Math.round(diffInMonths / 12);
    
    if (Math.abs(diffInDays) < 30) {
      return rtf.format(diffInDays, 'day');
    } else if (Math.abs(diffInMonths) < 12) {
      return rtf.format(diffInMonths, 'month');
    } else {
      return rtf.format(diffInYears, 'year');
    }
  };
  
  // Format date as YYYY-MM-DD for input fields
  export const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return '';
    
    // Format as YYYY-MM-DD
    return date.toISOString().split('T')[0];
  };