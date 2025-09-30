"use client";

import { useState } from "react";
import { useCoinbaseRampTransaction } from "../contexts/CoinbaseRampTransactionContext";

export const AmountInput = () => {
  const {
    isOnrampActive,
    selectedCurrency,
    rampTransaction,
    setRampTransaction,
  } = useCoinbaseRampTransaction();

  const [isFocused, setIsFocused] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow numbers and a single decimal point
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      // Update the amount in the context
      setRampTransaction({
        ...rampTransaction,
        amount: value,
      });
    }
  };

  const getCurrencySymbol = () => {
    if (isOnrampActive && selectedCurrency) {
      return selectedCurrency.id;
    }
    return "USD";
  };

  // Define min and max values (these would normally come from the context)
  const minAmount = "10";
  const maxAmount = "1000";

  return (
    <div className="w-full">
      <div className="mb-2 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          <span>
            Min: {minAmount} {getCurrencySymbol()}
          </span>
          <span className="mx-2">|</span>
          <span>
            Max: {maxAmount} {getCurrencySymbol()}
          </span>
        </div>
      </div>

      <div
        className={`relative rounded-md shadow-sm ${
          isFocused
            ? "ring-2 ring-green-500 border-green-500"
            : "border-gray-300"
        }`}
      >
        <input
          type="text"
          name="amount"
          id="amount"
          className="block w-full rounded-md border-0 py-3 pl-4 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
          placeholder="0.00"
          value={rampTransaction?.amount || ""}
          onChange={handleAmountChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-gray-500 sm:text-sm">
            {getCurrencySymbol()}
          </span>
        </div>
      </div>

      {rampTransaction?.amount && parseFloat(rampTransaction.amount) > 0 && (
        <div className="mt-2">
          {parseFloat(rampTransaction.amount) < parseFloat(minAmount) && (
            <p className="text-sm text-red-600">
              Amount is below the minimum of {minAmount} {getCurrencySymbol()}
            </p>
          )}
          {parseFloat(rampTransaction.amount) > parseFloat(maxAmount) && (
            <p className="text-sm text-red-600">
              Amount is above the maximum of {maxAmount} {getCurrencySymbol()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AmountInput;
