import React, { useState, useEffect } from 'react';
import { Lock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface PaywallProps {
  price: string | number;
  resourceId: string;
  onUnlocked: () => void;
}

export const Paywall = ({ price, resourceId, onUnlocked }: PaywallProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Dynamically inject the Razorpay checkout script
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
      toast.error('Please log in to purchase this content.');
      navigate('/login', { state: { from: location } });
      return;
    }

    setLoading(true);
    toast('Initializing secure checkout...');

    try {
      // 1. Fetch Order ID from Local Backend
      const res = await fetch('http://localhost:5000/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: Number(price) }),
      });

      if (!res.ok) {
        throw new Error('Could not establish secure connection to payment gateway.');
      }

      const order = await res.json();

      // 2. Open Razorpay Interface
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder', // Setup env var locally
        amount: order.amount,
        currency: order.currency,
        name: 'Premium Resource',
        description: 'Unlock premium content forever',
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Payment Success Callback -> Fulfill the Order
          toast.success('Payment processed! Unlocking resource...');

          const { error } = await supabase.from('purchases').insert([
            {
              user_id: user.id,
              resource_id: resourceId,
            }
          ]);

          if (error) {
            if (error.code === '23505') {
              toast.info('You already own this item!');
              onUnlocked();
              navigate('/my-library');
            } else {
              toast.error('Failed to register ownership: ' + error.message);
            }
          } else {
            toast.success('Successfully purchased and unlocked!');
            onUnlocked();
            navigate('/my-library');
          }
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: '#f97316', // Primary Orange Theme
        },
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        toast.error('Payment failed: ' + response.error.description);
        setLoading(false);
      });

      rzp.open();
    } catch (err: any) {
      toast.error(err.message || 'Payment initialization failed.');
    } finally {
      // Setup reset timeout allowing modal to capture screen
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-orange/50 bg-deep-black p-8 text-center shadow-2xl shadow-orange/10 animate-in zoom-in-95 duration-500 max-w-lg mx-auto my-12">
      <div className="absolute inset-0 bg-gradient-to-br from-orange/10 to-transparent pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center">
        <div className="h-16 w-16 bg-orange/10 rounded-full flex items-center justify-center mb-6">
          <Lock className="h-8 w-8 text-orange" />
        </div>
        <h3 className="text-2xl font-bold text-off-white font-heading tracking-tight mb-2">
          This is Premium Content
        </h3>
        <p className="text-mid-gray mb-6 max-w-sm">
          Unlock this resource to get full access to the secure downloads, guides, and premium insights!
        </p>
        
        <div className="flex flex-col w-full gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Button 
            onClick={handlePurchase} 
            disabled={loading} 
            size="lg" 
            className="w-full sm:w-auto font-bold gap-2 text-primary-foreground"
          >
            {loading ? 'Processing...' : (
              <>
                <CreditCard className="h-5 w-5" />
                Buy Now — ₹{price}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
