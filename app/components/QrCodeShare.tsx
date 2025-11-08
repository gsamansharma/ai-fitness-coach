'use client';

import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { QrCode } from 'lucide-react';

export default function QrCodeShare() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);
  if (!currentUrl) {
    return null;
  }

  return (
    <>
      {/* Share Button */}
      <button
        onClick={() => setModalOpen(true)}
        className="p-2 rounded-lg bg-(--surface-color) text-(--font-color) hover:bg-(--font-color)/10 transition-all"
        title="Share this plan (QR Code)"
      >
        <QrCode className="h-5 w-5" /> 
      </button>

      {/* QR Code Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative z-50 bg-(--background-color) p-6 rounded-lg shadow-xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium text-(--font-color) mb-4">
              Share this Plan
            </h3>
            
            <div className="p-4 bg-white inline-block rounded">
              <QRCode value={currentUrl} size={192} />
            </div>
            
            <p className="text-sm text-(--font-color-muted) mt-4 break-all max-w-xs">
              {currentUrl}
            </p>
            
            <button
              onClick={() => setModalOpen(false)}
              className="mt-6 w-full px-4 py-2 rounded-lg bg-(--surface-color) text-(--font-color) hover:bg-(--font-color)/10 text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}