"use client";

import React, { memo } from "react";

interface GeneratedLinkModalProps {
  title: string;
  url: string;
  onClose: () => void;
  onCopy: () => void;
  onOpen: () => void;
}

// Memoize the component to prevent unnecessary re-renders
const GeneratedLinkModal = memo(function GeneratedLinkModal({
  title,
  url,
  onClose,
  onCopy,
  onOpen,
}: GeneratedLinkModalProps) {
  // Truncate extremely long URLs to prevent rendering issues
  const displayUrl = url.length > 500 ? url.substring(0, 500) + "..." : url;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-700 mb-2">
            URL to redirect users to Coinbase:
          </p>
          <div className="bg-blue-50 p-3 rounded-lg overflow-hidden border border-blue-100">
            <div className="text-xs text-gray-800 break-all max-h-20 overflow-y-auto">
              {displayUrl}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCopy}
            className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-2 px-4 rounded-lg font-medium"
          >
            Copy URL
          </button>
          <button
            onClick={onOpen}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
          >
            Open URL
          </button>
        </div>
      </div>
    </div>
  );
});

export default GeneratedLinkModal;
