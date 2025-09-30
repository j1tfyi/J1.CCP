"use client";

import React, { useState, useEffect } from "react";

interface OfframpNotificationProps {
  status: string;
  onClose: () => void;
}

export default function OfframpNotification({
  status,
  onClose,
}: OfframpNotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 10 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // Handle different status types
  const getNotificationContent = () => {
    switch (status) {
      case "success":
        return {
          title: "Demo Transaction Initiated",
          message:
            "This is a demo app. In a real implementation, your offramp transaction would be initiated. Note that actual payments require ownership of assets and sufficient funds.",
          icon: (
            <svg
              className="w-6 h-6 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          ),
          bgColor: "bg-green-50",
          borderColor: "border-green-400",
          textColor: "text-green-800",
        };
      case "pending":
        return {
          title: "Transaction Pending",
          message:
            "Your offramp transaction is pending. Please check your wallet for the next steps.",
          icon: (
            <svg
              className="w-6 h-6 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          ),
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-400",
          textColor: "text-yellow-800",
        };
      case "error":
        return {
          title: "Transaction Failed",
          message:
            "There was an error with your offramp transaction. Please try again.",
          icon: (
            <svg
              className="w-6 h-6 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          ),
          bgColor: "bg-red-50",
          borderColor: "border-red-400",
          textColor: "text-red-800",
        };
      default:
        return {
          title: "Transaction Status",
          message: "Your offramp transaction status has been updated.",
          icon: (
            <svg
              className="w-6 h-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          ),
          bgColor: "bg-blue-50",
          borderColor: "border-blue-400",
          textColor: "text-blue-800",
        };
    }
  };

  const content = getNotificationContent();

  if (!visible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border ${
        content.bgColor
      } ${content.borderColor} max-w-md transition-all duration-300 transform ${
        visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{content.icon}</div>
        <div className="ml-3 w-0 flex-1">
          <p className={`text-sm font-medium ${content.textColor}`}>
            {content.title}
          </p>
          <p className={`mt-1 text-sm ${content.textColor}`}>
            {content.message}
          </p>
          <div className="mt-4 flex">
            <button
              onClick={() => {
                setVisible(false);
                onClose();
              }}
              className={`${content.textColor} text-sm font-medium underline hover:text-opacity-75`}
            >
              Dismiss
            </button>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={() => {
              setVisible(false);
              onClose();
            }}
            className="inline-flex text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
