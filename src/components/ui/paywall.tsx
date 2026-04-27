import React, { useState, useEffect } from 'react';
import { Lock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatPrice } from '@/lib/pricing';

interface PaywallProps {
  price: string | number;
  currency?: string;
  contentId: string;
  contentType?: 'resource' | 'blog';
  onUnlocked: () => void;
}

export const Paywall = ({
  price,
  currency = 'INR',
  contentId,
  contentType = 'resource',
  onUnlocked,
}: PaywallProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Determine API base — works on Vercel and local dev
  const apiBase = import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? 'http://localhost:5000' : '');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please sign in or create an account to purchase this content.');
      navigate('/login', { state: { from: location } });
      return;
    }

    setLoading(true);
    toast('Initializing secure checkout...');

    try {
      // Step 1: Create Razorpay order (price fetched server-side)
      const res = await fetch(`${apiBase}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, contentType, userId: user.id }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Could not connect to payment gateway.');
      }

      const order = await res.json();

      // Step 2: Open Razorpay modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Premium Content',
        description: 'One-time unlock — yours forever',
        order_id: order.id,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          // Step 3: Verify payment server-side and record purchase
          toast('Verifying payment...');
          try {
            const verifyRes = await fetch(`${apiBase}/api/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                contentId,
                contentType,
                userId: user.id,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
              throw new Error(
                verifyData?.error ||
                `Payment verified but recording failed. Save this Payment ID: ${response.razorpay_payment_id}`
              );
            }

            if (verifyData.alreadyOwned) {
              toast.info('You already own this item!');
            } else {
              toast.success('Purchase successful! Content unlocked.');
            }

            onUnlocked();

            if (contentType === 'resource') {
              navigate('/my-library');
            }
          } catch (verifyErr: any) {
            toast.error(verifyErr.message || 'Verification failed. Contact support.');
          } finally {
            setLoading(false);
          }
        },
        prefill: { email: user.email },
        theme: { color: '#f97316' },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        toast.error('Payment failed: ' + (response.error?.description || 'Unknown error'));
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || 'Payment initialization failed.');
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-orange/50 bg-deep-black p-8 text-center shadow-2xl shadow-orange/10 animate-in zoom-in-95 duration-500 max-w-lg mx-auto my-12">
      <div className="absolute inset-0 bg-gradient-to-br from-orange/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.18),_transparent_45%)] pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-orange/30 bg-orange/10">
          <Lock className="h-8 w-8 text-orange" />
        </div>
        <h3 className="mb-2 text-2xl font-bold tracking-tight text-off-white font-heading">
          Premium Content
        </h3>
        <p className="mb-3 rounded-full border border-orange/20 bg-orange/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-light">
          One-time unlock • Yours forever
        </p>
        <p className="mb-4 max-w-md text-base leading-relaxed text-off-white/90">
          Unlock full access including downloads, guides, and premium insights.
          Your purchase is saved to your account permanently.
        </p>
        <div className="mb-6 grid w-full max-w-md gap-2 rounded-xl border border-dark-gray bg-near-black/60 p-4 text-left text-sm text-off-white/85">
          <p className="font-semibold mb-1">What you get:</p>
          <p>✓ Full content access — no preview lock</p>
          <p>✓ Secure file downloads</p>
          <p>✓ Saved to your library permanently</p>
          <p>✓ Access from any device, any time</p>
        </div>
        <Button
          onClick={handlePurchase}
          disabled={loading}
          size="lg"
          className="w-full sm:w-auto font-bold gap-2 text-primary-foreground shadow-[0_10px_30px_rgba(249,115,22,0.35)]"
        >
          {loading ? 'Processing...' : (
            <>
              <CreditCard className="h-5 w-5" />
              Buy Now — {formatPrice(price, currency)}
            </>
          )}
        </Button>
        {!user && (
          <p className="mt-4 text-xs text-mid-gray">
            You'll be asked to sign in or create a free account before checkout.
          </p>
        )}
      </div>
    </div>
  );
};
