import React, { useState } from 'react';
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

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please log in to purchase this content.');
      navigate('/login', { state: { from: location } });
      return;
    }

    setLoading(true);
    
    // Simulate purchase by inserting into `purchases` table
    const { error } = await supabase.from('purchases').insert([
      {
        user_id: user.id,
        resource_id: resourceId,
      }
    ]);

    setLoading(false);

    if (error) {
      if (error.code === '23505') { // Postgres Unique Violation code
        toast.info('You already own this item!');
        onUnlocked();
      } else {
        toast.error('Failed to unlock content: ' + error.message);
      }
    } else {
      toast.success('Successfully purchased and unlocked!');
      onUnlocked();
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
          <div className="text-3xl font-display text-orange mr-2">
            ${price}
          </div>
          <Button 
            onClick={handlePurchase} 
            disabled={loading} 
            size="lg" 
            className="w-full sm:w-auto font-bold gap-2 text-primary-foreground"
          >
            {loading ? 'Processing...' : (
              <>
                <CreditCard className="h-5 w-5" />
                Unlock Now
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
