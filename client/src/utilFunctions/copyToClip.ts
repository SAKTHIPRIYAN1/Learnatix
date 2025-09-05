async function copyTextToClipboard(textToCopy:string) {
  try {
    // Check if the Clipboard API is available in the current environment
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(textToCopy);
      console.log('Text copied to clipboard successfully!');
      // Optionally, provide user feedback (e.g., a temporary "Copied!" message)
    } else {
      console.warn('Clipboard API not available in this browser.');
      // Fallback for older browsers if necessary (e.g., using document.execCommand)
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}

export default copyTextToClipboard;