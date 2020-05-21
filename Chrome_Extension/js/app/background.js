console.log('background script ran');
let dev = true;
let domain = dev ? "http://localhost:8000/" : 'www.myamazonhistory.com/';

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        switch(message.type) {
            case "login":
                console.log('login logic ran with formData = to', message.data);
                return true;
                break;
            case "signup":
            	console.log('signup logic with formData = to', message.data);
              let userCreds = message.data;
              userCreds.username = message.data.email.split('@')[0];
              ajaxCall("POST", 'user/signup', userCreds, function(response){
                console.log('response from server: ', response);
              })
            	return true;
                break;
            default:
            	console.log('couldnt find matching case');
        }
});


function ajaxCall(type, path, data, callback){
  $.ajax({
    url: domain+path,
    type: type,
    data: data,
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
