import { supabase } from '../supabase'

export type InstagramCredentials = {
  access_token: string;
  page_id: string;
  instagram_user_id: string;
}

export const saveInstagramCredentials = async (
  userId: string, 
  credentials: InstagramCredentials
) => {
  const { data, error } = await supabase
    .from('instagram_accounts')
    .upsert({
      id: userId,
      access_token: credentials.access_token,
      page_id: credentials.page_id,
      instagram_user_id: credentials.instagram_user_id,
      updated_at: new Date().toISOString()
    })

  if (error) throw error;
  return data;
}

export const getInstagramCredentials = async (userId: string) => {
  const { data, error } = await supabase
    .from('instagram_accounts')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error;
  return data as InstagramCredentials;
} 