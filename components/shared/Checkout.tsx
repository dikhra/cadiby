'use client';

import { Button } from '@/components/ui/button';
import { handleError } from '@/lib/utils';
import { useEffect } from 'react';

const Checkout = ({ name, planId, amount, credits, buyerId }: any) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY as string);
    script.async = true;

    script.onload = () => {
      console.log('Snap.js loaded.');
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const data = {
        name: name,
        planId: planId,
        amount: amount,
        credits: credits,
        buyerId: buyerId,
      };

      const response = await fetch('api/midtrans', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      const requestData = await response.json();

      if ((window as any).snap && (window as any).snap.pay) {
        (window as any).snap.pay(requestData.token);
      } else {
        throw new Error('Snap is not initialized properly');
      }
    } catch (error) {
      handleError(error); // Handle error appropriately
    }
  };

  return (
    <form onSubmit={handleCheckout}>
      <section>
        <Button
          type="submit"
          className="w-full rounded-full bg-purple-gradient bg-cover"
        >
          Buy Credit
        </Button>
      </section>
    </form>
  );
};

export default Checkout;
