import publicApi from './publicApi';

export const handle401 = async (error, apiInstance) => {
  const originalRequest = error.config;

  if (
    (error.response?.status === 401 || error.response?.status === 403) &&
    !originalRequest._retry &&
    originalRequest.url !== '/refresh'
  ) {
    originalRequest._retry = true;
    try {
      const refreshResponse = await publicApi.post('/refresh');
      if (refreshResponse.data.user) {
        window.dispatchEvent(
          new CustomEvent('user-refreshed', {
            detail: refreshResponse.data.user,
          })
        );
      }
      return apiInstance(originalRequest);
    } catch (refreshError) {
      window.dispatchEvent(new CustomEvent('auth-error'));
      return Promise.reject(refreshError);
    }
  }

  return Promise.reject(error);
};
