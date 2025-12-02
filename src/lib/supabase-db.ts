import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: string;
  luka_points: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  from_email: string;
  to_email: string;
  amount: number;
  status: string;
  transaction_type: string;
  created_at: string;
}

export const getProfileByEmail = async (email: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
};

export const createProfile = async (profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([profile])
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    return null;
  }

  return data;
};

export const updateProfilePoints = async (email: string, points: number): Promise<boolean> => {
  const { error } = await supabase
    .from('profiles')
    .update({ luka_points: points })
    .eq('email', email);

  if (error) {
    console.error('Error updating points:', error);
    return false;
  }

  return true;
};

export const transferPoints = async (
  fromEmail: string,
  toEmail: string,
  amount: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get sender profile
    const sender = await getProfileByEmail(fromEmail);
    if (!sender) {
      return { success: false, error: 'Sender not found' };
    }

    if (sender.luka_points < amount) {
      return { success: false, error: 'Insufficient points' };
    }

    // Get recipient profile
    const recipient = await getProfileByEmail(toEmail);
    if (!recipient) {
      return { success: false, error: 'Recipient not found' };
    }

    // Update sender points
    await updateProfilePoints(fromEmail, sender.luka_points - amount);

    // Update recipient points
    await updateProfilePoints(toEmail, recipient.luka_points + amount);

    // Create transaction record
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert([{
        from_email: fromEmail,
        to_email: toEmail,
        amount,
        status: 'completed',
        transaction_type: 'transfer'
      }]);

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      return { success: false, error: 'Failed to record transaction' };
    }

    return { success: true };
  } catch (error) {
    console.error('Transfer error:', error);
    return { success: false, error: 'Transfer failed' };
  }
};

export const getTransactionHistory = async (email: string): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .or(`from_email.eq.${email},to_email.eq.${email}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }

  return data || [];
};

export const getAllProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('luka_points', { ascending: false });

  if (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }

  return data || [];
};
