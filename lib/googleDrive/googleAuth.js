import GoogleAuth from 'google-auth-library';

export default function googleAuth(googleApi) {
  const auth = new GoogleAuth();
  const redirectUrl = 'urn:ietf:wg:oauth:2.0:oob';
  const { clientId, clientSecret, accessToken, refreshToken, expiryDate } = googleApi;
  const googleAuthObject = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  googleAuthObject.credentials = {
    access_token: accessToken,
    token_type: 'Bearer',
    refresh_token: refreshToken,
    expiry_date: expiryDate,
  };
  return googleAuthObject;
}
