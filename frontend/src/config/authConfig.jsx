export const authConfig = {
  authority: 'https://myaccount.asgardeo.io/t/yourdomain',
  clientId: 'YOUR_CLIENT_ID_HERE',
  redirectUri: window.location.origin + '/callback',
  scope: 'openid profile email',
};

export const getAuthorizationEndpoint = () => {
  return `${authConfig.authority}/oauth2/authorize?client_id=${authConfig.clientId}&redirect_uri=${authConfig.redirectUri}&response_type=code&scope=${authConfig.scope}`;
};

export default authConfig;