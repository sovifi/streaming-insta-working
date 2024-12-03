import { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { getInstagramBusinessAccount } from '@/lib/services/instagram'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('=== Instagram Callback Started ===');
  const supabase = createServerSupabaseClient({ req, res })
  
  try {
    // Get user session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      console.log('No session found');
      return res.redirect('/dashboard?error=no_session')
    }
    console.log('User session found for:', session.user.email);

    // Get authorization code
    const { code } = req.query
    console.log('Authorization code received:', code ? 'Yes' : 'No');

    if (!code || typeof code !== 'string') {
      return res.redirect('/dashboard?error=no_code')
    }

    // Exchange code for access token
    console.log('Exchanging code for access token...');
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
      `client_id=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}&` +
      `client_secret=${process.env.FACEBOOK_APP_SECRET}&` +
      `redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback&` +
      `code=${code}`
    );

    const tokenData = await tokenResponse.json()
    console.log('Access token received:', tokenData.access_token ? 'Yes' : 'No');

    if (!tokenData.access_token) {
      console.error('Token error:', tokenData);
      return res.redirect('/dashboard?error=token_failed')
    }

    // Get Instagram account details
    console.log('Getting Instagram account details...');
    const igAccount = await getInstagramBusinessAccount(tokenData.access_token)
    console.log('Instagram account found:', {
      businessId: igAccount.igBusinessId,
      username: igAccount.igUsername
    });

    // Store in database
    console.log('Storing credentials in database...');
    const { data, error: insertError } = await supabase
      .from('instagram_accounts')
      .upsert({
        id: session.user.id,
        access_token: tokenData.access_token,
        instagram_business_id: igAccount.igBusinessId,
        page_id: igAccount.pageId,
        page_access_token: igAccount.pageAccessToken,
        updated_at: new Date().toISOString()
      })
      .select();

    if (insertError) {
      console.error('Database error:', insertError);
      return res.redirect('/dashboard?error=storage_failed')
    }

    console.log('Credentials stored successfully');
    return res.redirect('/dashboard?success=true')
  } catch (error) {
    console.error('Callback error:', error);
    return res.redirect('/dashboard?error=callback_failed&details=' + encodeURIComponent(error.message))
  }
} 