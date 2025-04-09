
/**
 * Security utilities for the application
 */

export const setupSecurityMeasures = () => {
  try {
    // Prevent console inspection in production
    if (process.env.NODE_ENV === 'production') {
      // Disable developer tools shortcuts
      document.addEventListener('keydown', (e) => {
        // Prevent F12
        if (e.key === 'F12' || 
            // Prevent Ctrl+Shift+I / Cmd+Option+I
            ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') || 
            // Prevent Ctrl+Shift+J / Cmd+Option+J
            ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') || 
            // Prevent Ctrl+Shift+C / Cmd+Option+C
            ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C')) {
          e.preventDefault();
        }
      });

      // Log a warning message when dev tools are opened
      const devToolsDetection = () => {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;
        
        if (widthThreshold || heightThreshold) {
          document.body.innerHTML = '<div style="text-align: center; padding: 50px;">For security reasons, developer tools are not permitted.</div>';
        }
      };

      setInterval(devToolsDetection, 1000);
    }
    
    // Add additional security check
    console.log("Security measures initialized");
  } catch (error) {
    // Silent fail for security measures
  }
};
