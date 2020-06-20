
<a href='https://www.udemy.com/course/build-a-full-stack-chrome-extension-with-nodejs-and-mongdb/'>Repo For The Udemy Course: 'Build a Full-Stack Chrome Extension with NodeJS and MongDB'</a>

First Step for setting up this repo:

Git Clone or Download the folder (if you download as a Zip file, be sure to unzip it before uploading the extension code to chrome)

<h3>How To Setup Your Server</h3>

1) Install NodeJS: <a href="https://nodejs.org/en/download/">download link</a>

2) Create a MongoDB Database (and User) on <a href="https://mlab.com">mLab</a> (or your local machine).

3) Create a .env file within your Server's root folder
DEV_DB=mongodb://root:{{password}}@ds215229.mlab.com:15229/udemy-extension-db
where root = your mongo username, and {{password}} = your db password


<h3>How To Setup Your Chrome Extension</h3>

1) Navigate to your <a href="chrome://extensions">Chrome Extensions Tab</a>

2) Click the "Developer Mode" switch (on the top right of the screen) (should be enabled)

3) Click "Load Unpacked" button. Choose the directory of the unzipped folder (the manifest.json file should be in the root directory chosen).

4) Visit <a href="amazon.com">https://www.amazon.com</a>, and open your Dev Console. You should see the text 'content script ran' logged in your dev console. 

5) If/when you add a Background.js page, visit your <a href="chrome://extensions">Chrome Extensions Tab</a> again, and find the new Extension you just uploaded. Click the "background.html" link - this will give you a Chrome developer tools GUI to view what's happening in the "background.js" of your Chrome Extension.

<h3>Chrome Extension Structure</h3>

<img src="Authentication%20flow%20-%20architecture.png">

<h3>Best Practices: Make Post Requests from the Background (not Content Page)</h3>

Most sites have triggers that listen for when external apps are making post requests directly from the DOM (i.e. the Content.js page). As a Chrome Extension developer, you have the most privacy from the 'popup.js' page, and the 'background.js' pages, because popup.js and background.js are part of the Chrome Browser's Internal Structure.

Here's a code example of how the communication between background.js and content.js might look like:


Content.js:
```javascript
chrome.runtime.sendMessage({type: "imageData", images: stuffToSave});
```

And here's how to listen for a message from the Popup.js, or Background.js:
```javascript
chrome.runtime.onMessage.addListener(
        function(message, sender, sendResponse) {
            switch(message.type) {
                case "imageData":
                    console.log('got image Data from content.js: ', message)

```


Because the chrome.runtime.onMessage API goes out to the content.js, background.js, and popup.js pages, Chrome Extension developers frequently use the JavaScript switch statement when listening for these events.

You can use the following template in any of your main extension pages:

```javascript
chrome.runtime.onMessage.addListener(
        function(message, sender, sendResponse) {
            switch(message.type) {
            	case x:
		    // code block
		    break;
		case y:
		    // code block
		    break;
		default:
		    // code block
            }
        }
);
```

<h3>Messaging: Important Note</h3>

'if you're debugging your extension and the Dev Tools window is open and focused, the array will be empty. You should check for that.'

<a href='https://stackoverflow.com/questions/29681477/background-script-messaging-with-javascript'>source</a>
