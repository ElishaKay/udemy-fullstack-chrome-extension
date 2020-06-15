console.log('content script ran');

var url = window.location.href;
console.log('url: ',url);
let orderDetails = [];

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
} else if (url.includes('amazon.com/gp/your-account/') && url.includes('&ahf=on') && url.includes('orderFilter=')){
    //got to yearly page - need to:
    //checkAndGetPagination
    //send OrderDetails to the Background
    console.log('on a yearly page now');
    
    if(getYear()=='undefined'){
        chrome.runtime.sendMessage({type: 'fetchingComplete', data: {fetchingComplete: true} }, 
                function(response){
                    console.log('this is the response from the popup page: ',response);
                }
        );
        
        setTimeout(function(){ 
            window.location.href = 'https://myamazonhistory.com/user/crud/blogs';
            }, 
        3000);
    }

    window.scrollTo(0,document.querySelector(".navLeftFooter").scrollHeight+5000);
    fetchYearlyOrders();

    setTimeout(function(){ 
        sendToBackground("ordersPageDetails", 
                         {"purchase_year": getYear(),
                          "page_number": getPageNumber(),
                          "orderDetails": orderDetails,
                          "paginationDetails": checkAndGetPagination()});
        }, 
    10000);
}


function sendToBackground(eventName, eventData, callback){
	chrome.runtime.sendMessage({type: eventName, data: eventData }, 
            function(response){
                console.log('this is the response from the background page for the '+ eventName+ ' Event: ',response);
                if(eventName=='ordersPageDetails'){
                    if(response.nextWhat == 'nextYear'){
                      // window.location.href = 'https://www.amazon.com/gp/your-account/order-history?orderFilter=year-'+response.year+'&ahf=on';
                    } else if (response.nextWhat == 'nextPage' && typeof response.year != 'undefined'){
                        // window.location.href = 'https://www.amazon.com/gp/your-account/order-history/ref=ppx_yo_dt_b_pagination_1_2_3_4_5?ie=UTF8&orderFilter=year-'+response.year+'&search=&startIndex='+response.startIndex+'&ahf=on';
                    }
                } 
            }
    );
}

//helpers
function getURLParam(paramName){
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  return urlParams.get(paramName);  
}


function getYear(){
  let orderFilter = getURLParam('orderFilter');
  if(orderFilter){
      return orderFilter.split('-')[1];
  } else {
    return 'orderFilter not found';
  }
}

function getPageNumber(){
    let startIndex = getURLParam('startIndex');
    if(startIndex){
        return (startIndex/10)*2;   
    } else {
        return 1;
    }
}

let page_number = 1;

function fetchYearlyOrders(){
    let products = document.querySelectorAll('.a-fixed-left-grid-inner')
    for (i = 0; i < products.length; i++) {
        let item = {};
        let cleanedUpValues = products[i].innerText.split("\n");
        item.product_title = cleanedUpValues[0];    
        item.product_by = cleanedUpValues[1]; 
        item.product_cost = cleanedUpValues[cleanedUpValues.indexOf('Buy it again')-1];
        item.product_link = products[i].firstElementChild.firstElementChild.firstElementChild.href;   
        let imgurl = products[i].firstElementChild.firstElementChild.firstElementChild.innerHTML.split("\"");
        item.product_imgurl = imgurl[imgurl.findIndex(element => element.includes("images/I"))];
        fetchSummaryAndReviews(item);
    }
}

function fetchSummaryAndReviews(product){
    ajaxGet(product.product_link.split('amazon.com')[1], function(response){
        let element = $($.parseHTML( response ));
        product.product_summary = element.find("div").attr("data-feature-name", 'editorialReviews').prev("noscript")[0].innerHTML;
        // product.product_summary = element.find("div [id*=dmusic_tracklist_player]");
        let reviews = element.find("div [id*=customer_review]");
        product.product_reviews = [];
        //save reviews html in array
        for (i = 0; i < reviews.length; i++) {
          let review = reviews[i];
          product.product_reviews.push($(review).find('div:nth-child(5)>span>div>div>span')[0].innerHTML.trim());
        }
        orderDetails.push(product);
    })
}

function ajaxGet(url, callback){
  $.ajax({
        url: url, 
        type: 'GET',
        success: function(a) {
          callback(a);
        },
        error: function(a) {
          console.log("Error: ",a);
        }
    });
}

function checkAndGetPagination(){
    let pageNumbers = [];
    let pagination = document.querySelectorAll('.pagination-full');
    if(pagination[0]){
        let extractedNumbers = pagination[0].innerText.match(/\d/g);
        for (i = 0; i < extractedNumbers.length; i++) { 
            pageNumbers.push(parseInt(extractedNumbers[i]));
        }
        return pageNumbers;
    } else {
        return [];
    }
}
