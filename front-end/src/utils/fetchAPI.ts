import axios, { AxiosResponse, Method } from 'axios';

const fetchAPI = async <D = any, R = D>(
  method: Method,
  url: string,
  data?: D,
): Promise<AxiosResponse<R>> => {
  const PROTOCOL = process.env.REACT_APP_API_PROTOCOL;
  const HOST = process.env.REACT_APP_API_HOST;
  const PORT = process.env.REACT_APP_API_PORT;

  const userToken = localStorage.getItem('_zaratan_token') || '';
  const fetch = axios.create({
    baseURL: `${PROTOCOL}://${HOST}:${PORT}`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: userToken,
    },
  });

  return fetch.request({ method, url, data });
};

export default fetchAPI;
