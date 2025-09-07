
export const authConfig = {
  
  authority: 'https://api.asgardeo.io/t/yourdomain',
  
  
  clientId: 'YOUR_CLIENT_ID_HERE',
  

  redirectUri: window.location.origin + '/callback',
  
  
  postLogoutRedirectUri: window.location.origin,
  
  
  scope: 'openid profile email',
  
  
  apiBaseUrl: 'http://localhost:8080/api',
  
  
  responseType: 'code',
  
 
  automaticSilentRenew: true,
  
  
  validateIssuer: true,
  
 
  monitorSession: true
};


export const getAuthorizationEndpoint = () => {
  return `${authConfig.authority}/oauth2/authorize?client_id=${authConfig.clientId}&redirect_uri=${authConfig.redirectUri}&response_type=${authConfig.responseType}&scope=${authConfig.scope}`;
};


export const getLogoutEndpoint = () => {
  return `${authConfig.authority}/oidc/logout?client_id=${authConfig.clientId}&post_logout_redirect_uri=${authConfig.postLogoutRedirectUri}`;
};

export default authConfig;