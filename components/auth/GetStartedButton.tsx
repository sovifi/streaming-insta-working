import { useState } from 'react';
import { RegisterPopup } from './RegisterPopup';

export function GetStartedButton() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsPopupOpen(true)}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Get Started
      </button>
      <RegisterPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
      />
    </>
  );
} 