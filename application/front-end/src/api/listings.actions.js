import axios from "axios";
import api_config from './config/api.config';

export const getListings = (params, handleResponse, headers = {}) => {
  axios({
    method: 'get',
    url: `http://${api_config.environment}/listings`,
    params: params,
    headers: headers
  }).then((res) => {
    handleResponse(res.data);
  });
};

export const getListing = (id, handleResponse) => {
  axios({
    method: 'get',
    url: `http://${api_config.environment}/listings/one/${id}`,
  }).then((res) => {
    handleResponse(res.data);
  });
};

export const getHouseTypes = (handleResponse) => {
  axios.get(`http://${api_config.environment}/listings/types`)
    .then((res) => {
      handleResponse(res.data);
    });
};

export const createPosting = (body, handleResponse) => {
  let session = JSON.parse(sessionStorage.getItem('session'))
  axios({
    method: 'post',
    url: `http://${api_config.environment}/listings/new`,
    data: body,
    headers: {
      'Session': session.token
    },
  }).then((res) => {
    handleResponse();
  });
};

export const approveListing = (id, approve, handleResponse) => {
  let session = JSON.parse(sessionStorage.getItem('session'))
  axios({
    method: 'put',
    url: `http://${api_config.environment}/listings/one/${id}`,
    headers: {
      'Session': session.token
    },
    params: {
      approve: approve
    }
  }).then((res) => {
    handleResponse();
  });
}

export const deleteListing = (id, onSuccess) => {
  let session = JSON.parse(sessionStorage.getItem('session'))
  axios({
    method: 'delete',
    url: `http://${api_config.environment}/listings/one/${id}`,
    headers: {
      'Session': session.token
    }
  }).then(onSuccess);
}
