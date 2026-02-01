"use client";

import { useEffect } from "react";

export default function ClerkModalFix() {
  useEffect(() => {
    // Function to center the modal
    const centerModal = () => {
      // Find all possible modal containers
      const modals = document.querySelectorAll('[data-clerk-portal], div[style*="position: fixed"]');
      
      modals.forEach((modal) => {
        const element = modal as HTMLElement;
        
        // Check if this is a Clerk modal (for signup/login)
        if (element.style.position === 'fixed' && element.style.transform?.includes('translate')) {
          // Check if it's a modal (not user dropdown)
          const hasModalContent = element.querySelector('[data-clerk-modal], [role="dialog"]');
          
          if (hasModalContent) {
            // Override the positioning to center it
            element.style.position = 'fixed';
            element.style.top = '0';
            element.style.left = '0';
            element.style.right = '0';
            element.style.bottom = '0';
            element.style.display = 'flex';
            element.style.alignItems = 'center';
            element.style.justifyContent = 'center';
            element.style.zIndex = '999999';
            element.style.transform = 'none';
            element.style.margin = '0';
            element.style.padding = '1rem';
            
            // Also target the inner modal content
            const innerDiv = element.querySelector('div') as HTMLElement;
            if (innerDiv && innerDiv.style.position === 'relative') {
              innerDiv.style.position = 'relative';
              innerDiv.style.transform = 'none';
              innerDiv.style.margin = '0';
              innerDiv.style.top = 'auto';
              innerDiv.style.left = 'auto';
              innerDiv.style.right = 'auto';
              innerDiv.style.bottom = 'auto';
            }
          }
        }
      });
    };

    // Function to position user dropdown to the right
    const positionUserDropdown = () => {
      // Find user dropdown/popover elements
      const dropdowns = document.querySelectorAll('[data-clerk-popover], [role="menu"], div[style*="position: absolute"]');
      
      dropdowns.forEach((dropdown) => {
        const element = dropdown as HTMLElement;
        
        // Check if this is a user dropdown (not a modal)
        const isUserDropdown = element.closest('[data-clerk-user-button]') || 
                               element.getAttribute('role') === 'menu' ||
                               element.querySelector('[data-clerk-user-button]');
        
        if (isUserDropdown && element.style.position === 'absolute') {
          // Position to the right side of the viewport
          element.style.position = 'fixed';
          element.style.right = '1rem';
          element.style.top = '4rem';
          element.style.left = 'auto';
          element.style.transform = 'none';
          element.style.zIndex = '999999';
        }
      });
    };

    // Combined function to handle both
    const fixClerkElements = () => {
      centerModal();
      positionUserDropdown();
    };

    // Initial check
    fixClerkElements();

    // Set up a MutationObserver to catch dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          fixClerkElements();
        }
      });
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style']
    });

    // Also check periodically as a fallback
    const interval = setInterval(fixClerkElements, 100);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return null;
}
