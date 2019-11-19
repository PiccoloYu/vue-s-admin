import fetch from './fetch';

export function minCharts() {
  return fetch({
    url: '/data/getchart.json',
    method: 'get'
  });
}
