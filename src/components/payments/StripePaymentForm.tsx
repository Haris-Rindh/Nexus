import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../../utils/api';

export const StripePaymentForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setPaymentStatus('');

    try {
      const { data } = await api.post('/payments/create-intent', { amount: 500 }); // $500.00 mock
      const clientSecret = data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: 'Intern Tester',
          },
        },
      });

      if (result.error) {
        setPaymentStatus(`Payment Failed: ${result.error.message}`);
      } else if (result.paymentIntent?.status === 'succeeded') {
        // Here we could call our backend mock deposit
        await api.post('/payments/deposit', { amount: 500 });
        setPaymentStatus('Payment Completed successfully! Submitting to database...');
      }
    } catch (error) {
      console.error(error);
      setPaymentStatus('System Error initiating payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md p-6 bg-white border rounded-xl shadow-md space-y-6">
      <h3 className="text-xl font-bold text-gray-800">Deposit Funds</h3>
      
      <div className="p-4 border rounded-md shadow-sm border-gray-200">
        <CardElement options={{ hidePostalCode: true }} />
      </div>

      <button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isProcessing ? 'Processing Transaction...' : 'Pay $500.00'}
      </button>

      {paymentStatus && (
        <div className={`p-3 text-sm font-medium rounded-lg ${paymentStatus.includes('Completed') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {paymentStatus}
        </div>
      )}
    </form>
  );
};
