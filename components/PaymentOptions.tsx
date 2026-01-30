import React, { useState } from 'react';
import { IconCreditCard, IconGCash, IconMaya, IconCheckCircle } from './Icons.tsx';
import type { Invoice } from '../types.ts';

interface PaymentOptionsProps {
  invoice: Invoice;
  onPaymentSuccess: (invoiceId: string) => void;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ invoice, onPaymentSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      setTimeout(() => {
        onPaymentSuccess(invoice.id);
      }, 1500);
    }, 2000);
  };

  if (isPaid) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in">
        <IconCheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h3 className="text-xl font-bold">Payment Successful!</h3>
        <p className="text-gray-500">Your payment for invoice {invoice.name} has been confirmed.</p>
      </div>
    );
  }

  const paymentMethods = [
    { name: 'Credit Card', icon: IconCreditCard },
    { name: 'GCash', icon: IconGCash },
    { name: 'Maya', icon: IconMaya },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-gray-500">You are paying</p>
        <p className="text-4xl font-bold text-blue-500">₱{invoice.amount}</p>
        <p className="text-sm text-gray-500">for {invoice.name}</p>
      </div>
      <div className="space-y-3">
        {paymentMethods.map(method => {
          const Icon = method.icon;
          return (
            <button 
              key={method.name}
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full flex items-center gap-4 p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <Icon className="w-8 h-8 text-gray-600" />
              <span className="font-semibold">{method.name}</span>
            </button>
          );
        })}
      </div>
      {isProcessing && (
        <div className="text-center text-sm text-gray-500 animate-pulse">
          Processing payment...
        </div>
      )}
    </div>
  );
};

export default PaymentOptions;
