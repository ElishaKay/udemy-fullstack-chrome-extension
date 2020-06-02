console.log('background script ran');
let dev = true;
let domain = dev ? "http://localhost:8000/" : 'https://myamazonhistory.com/';

ajaxCall("GET", "user/me", {}, getStorageItem('user') ? getStorageItem('user').token : '', function(response){
    console.log('response from server is: ',response);
})

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        switch(message.type) {
            case "login":
                console.log('login logic ran with formData = to', message.data);
                let userLoginCreds = message.data;
                userLoginCreds.username = message.data.email.split('@')[0];
                ajaxCall("POST", "user/login", userLoginCreds, '', function(response){
                   console.log('response from server is: ',response);
                   setStorageItem('user',response);
                   sendResponse(response);
                })
                return true;
                break;
            case "signup":
            	console.log('signup logic with formData = to', message.data);
              let userCreds = message.data;
              userCreds.username = message.data.email.split('@')[0];
              ajaxCall("POST", "user/signup", userCreds, '', function(response){
                  console.log('response from server is: ',response);
                  sendResponse(response);
              })
            	return true;
                break;
            default:
            	console.log('couldnt find matching case');
        }
});


function ajaxCall(type, path, data, token, callback){
  $.ajax({
    url: domain+path,
    type: type,
    data: data,
    headers: {
        token: token
    },
    success: function(response){
      console.log('response: ', response)
      callback(response);
    },
    error: function(response){
      console.log('response: ', response)
      callback(response);
    }
  });
}

function setStorageItem(varName, data){
  console.log('varName: ', varName);
  if(varName!='searchPageData'){
    console.log('data', data);
    window.localStorage.setItem(varName, JSON.stringify(data));
  }
}

function getStorageItem(varName){
  return JSON.parse(localStorage.getItem(varName));
}