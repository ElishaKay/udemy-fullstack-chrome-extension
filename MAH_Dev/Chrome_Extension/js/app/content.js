console.log('content script ran');

var url = window.location.href;

console.log('url: ',url)

// Fetching Orders Page Data
if(url.includes('amazon.com/gp/css/order-history')){
	//first landing on the main orders page
	//send all the dropDown Options to the Background page
	//navigate to a specific Time Period ()
  	
	let purchaseYears = [];
	var theOptions = document.querySelectorAll('#timePeriodForm #orderFilter')[0].options;
	for (i = 0; i < theOptions.length; i++) { 
    	purchaseYears.push(theOptions[i].value);
	}
    sendToBackground("purchaseYears", purchaseYears);
    setTimeout(function(){ 
	    window.location.href = 'https://www.amazon.com/gp/your-account/order-history?orderFilter='+purchaseYears.slice(-1)[0]+'&ahf=on'; 
    	}, 
    10000);

}


function sendToBackground(eventName, eventData, callback){
	chrome.runtime.sendMessage({type: eventName, data: eventData }, 
            function(response){
                console.log('this is the response from the background page for the '+ eventName+ ' Event: ',response);
                if(eventName=='ordersPageDetails'){
                    if(response.nextWhat == 'nextYear'){
                      window.location.href = 'https://www.amazon.com/gp/your-account/order-history?orderFilter=year-'+response.year+'&ahf=on';
                    } else if (response.nextWhat == 'nextPage' && typeof response.year != 'undefined'){
                        window.location.href = 'https://www.amazon.com/gp/your-account/order-history/ref=ppx_yo_dt_b_pagination_1_2_3_4_5?ie=UTF8&orderFilter=year-'+response.year+'&search=&startIndex='+response.startIndex+'&ahf=on';
                    }
                } 
            }
    );
}