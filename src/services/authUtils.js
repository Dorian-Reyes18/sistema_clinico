// authUtils.js
const createAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

export default createAuthHeaders;
