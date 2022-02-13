# fingerprinting-and-antibot
A clientside script that collects user data that has the potential to determine wether a user is a human


## `Description and Purpose`

This is going to be a long term project I will be working on. I will be adding many more client side data collection and fingerprinting functions in the future. 
I will also be adding a server side middleware that will determine if the data submitted by the client is consistent with a human or not.


## `How to Use`

Load the script on the client side and make the client send a post request to your endpoint with the collected data

## `Ideal Use Cases`

In the current state of this project, if you would like to implement this script on your website, I would send the client data collected by the script to a database. 
From there once you collect some data you can start creating server side checks the user's data that can look for consistencies and inconsistencies with human activity. 
I recommend you to encode the data being sent to your server and obfuscate the script so that it is very difficult for malicious users to forge the data. 

