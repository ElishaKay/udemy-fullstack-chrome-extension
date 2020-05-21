console.log('background script ran');

$.ajax({
  url: "http://localhost:8000/save-products",
  data: {test: "test data"},
  type: 'POST',
  success: function(response){
  	console.log('response: ', response)
  },
  error: function(response){
  	console.log('response: ', response)
  }
});