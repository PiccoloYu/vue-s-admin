import Mock from 'mockjs';

Mock.mock('http://localhost:8082/test', {
  'serInfo|4': [{
    'id|+1': 1,
    'name': '@cname',
    'ago|18-28': 25,
    'sex|1': ['男', '女'],
    'job|1': ['web', 'UI', 'python', 'php']
  }]
});

const userInfo = {// 'password': '123456',
  'username': 'admin',
  'password': '123456',
  'code': 'V9AM'
};

const tokens = {
  admin: {
    token: 'admin-mytoken'
  },
  editor: {
    token: 'editor-mytoken'
  }
};

Mock.mock('http://localhost:8082/user/login', 'get', function(options) {
  const data = JSON.parse(options.body);
  const token = tokens[data['username']];
  const a = Mock.valid(userInfo, data);
  if (token) {
    if (a.length === 0) {
      return {
        code: 200,
        token: token.token,
        message: 'login successful!'
      };
    } else {
      for (let i = 0; i < a.length; i++) {
        if (a[i].path[1] === 'username' || a[i].path[1] === 'password') {
          return {
            code: 401,
            message: 'Incorrect username or password!'
          };
        } else if (a[i].path[1] === 'code') {
          return {
            code: 402,
            message: 'Verification code erro!'
          };
        }
      }
    }
  } else {
    return {
      code: 401,
      message: 'Incorrect username or password!'
    };
  }
});

Mock.mock('http://localhost:8082/user/logout', 'get', function(options) {
  return {
    code: 200,
    data: 'success'
  };
});

/* Mock.mock('http://localhost:8082/getchart/min', 'get', function(option) {
  return fetch('./data/getchart.json')
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return {
        'data': data
      };
    })
    .catch((e) => {
      console.log(e);
    });
});*/
