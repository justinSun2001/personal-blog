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
