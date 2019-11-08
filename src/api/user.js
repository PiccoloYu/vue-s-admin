import fetch from './fetch';

export function login(data) {
  return fetch({
    url: '/user/login',
    method: 'get',
    data
  });
}

export function test() {
  return fetch({
    url: '/test',
    method: 'get'
  });
}

export function logout() {
  return fetch({
    url: '/user/logout',
    method: 'get'
  });
}

