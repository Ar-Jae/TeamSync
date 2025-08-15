export function getAuthToken() {
  try {
    return localStorage.getItem('token') || '';
  } catch (e) {
    return '';
  }
}

export function getAuthHeader() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
