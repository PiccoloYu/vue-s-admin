import fetch from './fetch';

export function minCharts() {
  return fetch({
    url: './data/getchart.json', // https://piccoloyu.github.io/vue-s-admin//data/getchart.json
    method: 'get'
  });
}
