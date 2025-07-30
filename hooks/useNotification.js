import { useState, useRef } from 'react';

export default function useNotification(duration = 3000) {
  const [showNotification, setShowNotification] = useState(false);
  const timeoutRef = useRef(null);

  const notify = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setShowNotification(true);
    
    // Set new timeout and store its ID
    timeoutRef.current = setTimeout(() => {
      setShowNotification(false);
      timeoutRef.current = null;
    }, duration);
  };

  return {
    showNotification,
    notify
  };
}

/* HOW TO USE THIS HOOK:

1. Import the hook:
   import useNotification from '@/hooks/useNotification';

2. Initialize the hook with optional duration (default is 3000ms):
   const { showNotification, notify } = useNotification(3000);

3. Use the notify function to show notification:
   <button onClick={()=>notify()}>Show Notification</button>

4. Render your notification component when showNotification is true:
   {showNotification && (
     <div className="notification-container">
       <AlertNotification 
         message="Your message here"
         linkName="Optional Link"
         linkHref="/path-to-your-link"
       />
     </div>
   )}

*/
