
var axios = require('axios');
var data = JSON.stringify({
  "operationName": null,
  "variables": {
    "c": "abcedfa"
    },
  "query": `
  mutation ($c: String!) {
        createPost(content: $c) {
            id, created, content
        }
    }`
});

var config = {
  method: 'post',
  url: 'http://localhost:3001/api',
  headers: { 
    'content-type': 'application/json', 
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
