// lib/fetcher.ts
export const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: 'include', // This sends cookies automatically
  });
  
  // If we get 401 (access token expired), try to refresh
  if (res.status === 401) {
    console.log('🔄 Access token expired, attempting auto-refresh...');
    
    try {
      // Call the refresh endpoint
      const refreshRes = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // Send refresh_token cookie
      });
      
      if (refreshRes.ok) {
        console.log('✅ Token refreshed! Retrying original request...');
        // Retry the original request with new access token
        const retryRes = await fetch(url, {
          credentials: 'include',
        });
        
        if (retryRes.ok) {
          return retryRes.json();
        }
      }
    } catch (error) {
      console.error('❌ Auto-refresh failed:', error);
    }
    
    // If we get here, refresh failed
    throw new Error('Session expired. Please login again.');
  }
  
  // For other errors
  if (!res.ok) {
    const error = new Error('Request failed');
    (error as any).status = res.status;
    throw error;
  }
  
  return res.json();
};