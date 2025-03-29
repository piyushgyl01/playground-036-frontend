// src/utils/slugify.js

/**
 * Converts a string to a URL-friendly slug
 * @param {string} text - The text to convert to a slug
 * @returns {string} The slugified text
 */
export const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')        // Replace spaces with -
      .replace(/&/g, '-and-')      // Replace & with 'and'
      .replace(/[^\w\-]+/g, '')    // Remove all non-word characters
      .replace(/\-\-+/g, '-')      // Replace multiple - with single -
      .replace(/^-+/, '')          // Trim - from start of text
      .replace(/-+$/, '')          // Trim - from end of text
      .concat('-', Date.now().toString().slice(-6)); // Add timestamp to ensure uniqueness
  };