const handleFacebookLogin = async (response) => {
  try {
    // Store the access token
    const accessToken = response.accessToken;
    
    // Make your API call to handle the connection
    const result = await connectFacebookAccount(accessToken);
    
    if (result.success) {
      // Update local state/context to reflect connected status
      setIsConnected(true);
      
      // Redirect to dashboard explicitly
      navigate('/dashboard');
    }
  } catch (error) {
    console.error('Facebook connection error:', error);
    // Handle error state
  }
} 