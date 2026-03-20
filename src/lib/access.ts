import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

/**
 * Validates if the given user has access to a specific resource or blog.
 * 
 * Logic:
 * - If resource is free (`is_paid = false`), return true.
 * - If paid, verify if user is logged in.
 * - If logged in, check the `purchases` table for an entry.
 */
export const checkAccess = async (user: User | null, resource: any): Promise<boolean> => {
  if (!resource.is_paid) {
    return true;
  }

  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('resource_id', resource.id)
    .maybeSingle();

  if (error) {
    console.error('Error checking access:', error.message);
    return false;
  }

  return !!data;
};
