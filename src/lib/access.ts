import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type PaidContentType = 'resource' | 'blog';

/** true = access granted, false = no access, 'error' = could not verify */
export type AccessResult = boolean | 'error';

/**
 * Validates if the given user has access to a specific resource or blog.
 * 
 * Logic:
 * - If resource is free (`is_paid = false`), return true.
 * - If paid, verify if user is logged in.
 * - If logged in, check the `purchases` table for an entry.
 * - On error, return 'error' so the UI can show a retry message instead of paywall.
 */
export const checkAccess = async (user: User | null, content: any, contentType: PaidContentType = 'resource'): Promise<AccessResult> => {
  if (!content.is_paid) {
    return true;
  }

  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq(contentType === 'resource' ? 'resource_id' : 'blog_id', content.id)
    .maybeSingle();

  if (error) {
    console.error('Error checking access:', error.message);
    return 'error';
  }

  return !!data;
};

