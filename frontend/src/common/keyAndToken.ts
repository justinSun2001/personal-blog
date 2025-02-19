// Method to store the RSA public key in localStorage
export const setKeyInLocal = (key:string) => {
  try {
    // Store the public key as a string in localStorage
    localStorage.setItem('rsaPublicKey', key);
  } catch (error) {
    console.error('Error storing RSA key in localStorage:', error);
  }
};

// Method to retrieve the RSA public key from localStorage
export const getKeyByLocal = () => {
  try {
    // Retrieve the public key from localStorage
    return localStorage.getItem('rsaPublicKey');
  } catch (error) {
    console.error('Error retrieving RSA key from localStorage:', error);
    return null;
  }
};
export const setTokenInLocal = (token:string) => {
  try {
    // Store the refresh token as a string in localStorage
    localStorage.setItem('token', token);
  }
  catch (error) {
    console.error('Error storing refresh token in localStorage:', error);
  }
}
export const getTokenByLocal = () => {
  try {
    // Retrieve the refresh token from localStorage
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error retrieving token from localStorage:', error);
    return null;
  }
}
export const setRefreshTokenInLocal = (token:string) => {
  try {
    // Store the refresh token as a string in localStorage
    localStorage.setItem('refreshToken', token);
  }
  catch (error) {
    console.error('Error storing refresh token in localStorage:', error);
  }
}
export const getRefreshTokenByLocal = () => {
  try {
    // Retrieve the refresh token from localStorage
    return localStorage.getItem('refreshToken');
  } catch (error) {
    console.error('Error retrieving refresh token from localStorage:', error);
    return null;
  }
}


