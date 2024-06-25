'use client'

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { handleError } from '@/lib/utils';

const Checkout = ({ planId, amount, buyerId }: any) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Hindari submit form secara default

    setLoading(true);
    try {
      const response = await axios.post('/api/midtrans', {
        planId,
        buyerId,
      });

      const { token } = response.data.data;

      // Redirect to Midtrans payment page
      (window as any).snap.pay(token, {
        onSuccess: () => {
          router.push('/success');
        },
        onPending: () => {
          router.push('/pending');
        },
        onError: () => {
          router.push('/error');
        },
        onClose: () => {
          setLoading(false);
        },
      });
    } catch (error) {
      handleError(error);
      setLoading(false);
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
