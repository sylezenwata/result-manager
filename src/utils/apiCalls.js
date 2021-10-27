import axios from 'axios';
import config from './config';
import { sessionToken } from './funcs';

/**
 * set fetch init/options handler func
 * @param {Object} param0 
 * @returns {Object}
 */
const setInit = ({ url, headers, method = 'post', data = null}) => {
    let staticHeaders = {
        'Accept': '*/*',
        'Content-Type': 'application/json; charset=utf-8'
    };
    headers = headers && typeof headers === 'object' ? Object.assign(staticHeaders, headers) : staticHeaders;
    return { url, method, headers, data };
};

/**
 * fetch handler func
 * @param {String} url 
 * @param {Ubject} init 
 * @returns {Object}
 */
const fetchWithErrorHandling = async (reqParams, _config = null) => {
  let prevReqData = {
    reqParams, 
    _config
  };
  try {
    return await (await axios(reqParams, _config)).data;
  } catch (err) {
    let code = err.response?.data.code;
    if (code && code === 401) {
      try {
        let tokens = await (await axios(setInit({ url: `${config.API_URL}/auth/refreshToken?client=admin`, data: {refresh_token: sessionToken(null, 'refresh').token } }))).data;
        await sessionToken(tokens);
        // update prevReqData authorization header and resend req
        prevReqData.reqParams.headers['Authorization'] = `Bearer ${tokens?.access.token}`;
        return await (await axios(prevReqData.reqParams, prevReqData._config)).data;
      } catch (err2) {
        let _message = ((err2.response?.data.message) || err2.message || 'An error occurred sending request, try again')
        let code = err.response?.data.code;
        if (code && code === 401) {
          _message = 'Login session expired, login again';
        }
        return { error: true, message: _message };
      }
    }
    return { error: true, message: ((err.response?.data.message) || err.message || 'An error occurred sending request, try again') };
  }
};

/**
 * login api handler func
 * @param {String} email 
 * @param {String} password 
 * @returns {Object}
 */
export const callLogin = async ({ email, password }) => {
  let data = JSON.stringify({ email, password });
  return fetchWithErrorHandling(setInit({ url: `${config.API_URL}/auth/login?client=admin`, data }));
};

/**
 * logout api handler func
 * @param {Object} token 
 * @returns 
 */
export const callLogout = async ({ token }) => {
  let data = JSON.stringify({ refresh_token: token });
  return fetchWithErrorHandling(setInit({ url: `${config.API_URL}/auth/logout?client=admin`, data }));
};

/**
 * result upload api handler func
 * @param {Object} param0 
 * @returns 
 */
export const callResultUpload = async ({ file }) => {
  // form data
  let data = new FormData();
  data.append('csv_file', file);
  // headers
  const { token = null } = sessionToken(null, 'access');
  let headers = {
    'Content-Type': false,
    'Authorization': `Bearer ${token}`
  };
  return fetchWithErrorHandling(setInit({ url: `${config.API_URL}/result`, headers, data }));
};

/**
 * result fetch api handler func
 * @param {Object} filter 
 * @returns 
 */
export const callGetResult = async (filter = null) => {
  // set filter
  if (filter) {
    filter = Object.keys(filter).reduce((arr, key) => {
      arr.push(`${key}=${filter[key]}`);
      return arr.join('&');
    }, []);
  }
  const { token = null } = sessionToken(null, 'access');
  let headers = {
    'Authorization': `Bearer ${token}`
  };
  return fetchWithErrorHandling(setInit({ url: `${config.API_URL}/result${filter ? '?'+filter : ''}`, method: 'GET', headers }));
};