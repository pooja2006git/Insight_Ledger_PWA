import React, { useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

function ToggleOfflineButton() {
  const [isOffline, setIsOffline] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-50 flex flex-col items-center space-y-2">
      {/* Switch Mode Tooltip */}
      <div className="bg-white text-black text-xs font-semibold px-3 py-1 rounded-full shadow-md">
        Switch Mode
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOffline(!isOffline)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium shadow-lg transition-all duration-300 ${
          isOffline
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        {isOffline ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
        <span>{isOffline ? 'Offline' : 'Online'}</span>
      </button>
    </div>
  );
}

export default ToggleOfflineButton;