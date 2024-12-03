export type FacebookConfig = {
  appId: string
  appSecret: string
  redirectUri: string
}

export const facebookConfig: FacebookConfig = {
  appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
  appSecret: process.env.FACEBOOK_APP_SECRET || '',
  redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`,
}

export const getFacebookAuthUrl = () => {
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
  if (!appId) {
    throw new Error('Facebook App ID is not configured');
  }

  const url = new URL('https://www.facebook.com/v18.0/dialog/oauth');
  url.searchParams.append('client_id', appId);
  url.searchParams.append('redirect_uri', `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`);
  
  // Updated permissions to include both personal and business accounts
  url.searchParams.append('scope', [
    'instagram_basic',
    'instagram_content_publish',
    'instagram_manage_comments',
    'instagram_manage_insights',
    'pages_show_list',
    'pages_read_engagement',
    'business_management',
    'pages_manage_metadata',
    'pages_manage_posts',
    'public_profile'
  ].join(','));
  
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('state', 'instagram_auth');
  
  // Force account selection dialog
  url.searchParams.append('auth_type', 'rerequest');
  url.searchParams.append('display', 'popup');
  url.searchParams.append('enable_profile_selector', 'true');
  url.searchParams.append('account_selection', 'all');
  
  console.log('Generated auth URL:', url.toString());
  return url.toString();
}

export const getInstagramAccounts = async (accessToken: string) => {
  try {
    // First get all Facebook Pages
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
    );
    
    if (!pagesResponse.ok) {
      const error = await pagesResponse.text();
      console.error('Failed to fetch pages:', error);
      throw new Error('Failed to fetch Facebook pages');
    }
    
    const pages = await pagesResponse.json();
    console.log('Found Facebook pages:', pages);

    // Get Instagram accounts for each page
    const accounts = [];
    
    for (const page of pages.data) {
      const igResponse = await fetch(
        `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account{id,username,profile_picture_url}&access_token=${accessToken}`
      );
      
      if (igResponse.ok) {
        const igData = await igResponse.json();
        if (igData.instagram_business_account) {
          accounts.push({
            pageId: page.id,
            pageAccessToken: page.access_token,
            igBusinessId: igData.instagram_business_account.id,
            igUsername: igData.instagram_business_account.username,
            profilePicture: igData.instagram_business_account.profile_picture_url
          });
        }
      }
    }

    // Also try to get personal Instagram account
    const personalIgResponse = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,instagram_account{id,username,profile_picture_url}&access_token=${accessToken}`
    );

    if (personalIgResponse.ok) {
      const personalData = await personalIgResponse.json();
      if (personalData.instagram_account) {
        accounts.push({
          pageId: null,
          pageAccessToken: accessToken,
          igBusinessId: personalData.instagram_account.id,
          igUsername: personalData.instagram_account.username,
          profilePicture: personalData.instagram_account.profile_picture_url,
          isPersonal: true
        });
      }
    }

    console.log('Found Instagram accounts:', accounts);
    return accounts;
  } catch (error) {
    console.error('Error getting Instagram accounts:', error);
    throw error;
  }
}

export const getInstagramBusinessAccount = async (accessToken: string) => {
  try {
    // First get Facebook Pages
    console.log('Fetching Facebook pages...');
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
    );
    
    if (!pagesResponse.ok) {
      const error = await pagesResponse.text();
      console.error('Failed to fetch pages:', error);
      throw new Error('Failed to fetch Facebook pages');
    }
    
    const pages = await pagesResponse.json();
    console.log('Available Facebook pages:', pages.data.map(p => p.name));
    
    // Get Instagram accounts for each page
    for (const page of pages.data) {
      console.log(`Checking Instagram account for page: ${page.name}`);
      
      const igResponse = await fetch(
        `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account{id,username,profile_picture_url}&access_token=${accessToken}`
      );
      
      if (igResponse.ok) {
        const igData = await igResponse.json();
        console.log('Instagram data for page:', igData);
        
        if (igData.instagram_business_account) {
          // Get more details about the Instagram account
          const igDetailsResponse = await fetch(
            `https://graph.facebook.com/v18.0/${igData.instagram_business_account.id}?fields=username,profile_picture_url,name&access_token=${accessToken}`
          );
          
          const igDetails = await igDetailsResponse.json();
          console.log('Instagram account details:', igDetails);

          return {
            pageId: page.id,
            pageAccessToken: page.access_token,
            igBusinessId: igData.instagram_business_account.id,
            igUsername: igDetails.username,
            igName: igDetails.name
          };
        }
      }
    }

    throw new Error('No Instagram Business Account found');
  } catch (error) {
    console.error('Error in getInstagramBusinessAccount:', error);
    throw error;
  }
} 