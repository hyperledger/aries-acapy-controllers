# TRACTION DEMO ISSUANCE

Demo page for testing with the Traction system.  
Version 1.0 created by [www.credivera.ca](https://www.credivera.ca)  
Licensed under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)

[![Demo Video](https://img.youtube.com/vi/OI1JIt91K8g/0.jpg)](https://youtu.be/OI1JIt91K8g)

 - [Set up Traction](#Traction)
 - [Run App](#App)

## Tunnel Setup
As the simple demo application shown here requires listening for webhooks sent back to the app, a prerequisite is for the system the demo app is running on to have a public endpoint to call to.

If running on `localhost` then you will require a secure tunnel to expose the local server.

There are many options for running this on your local computer such as 
- [Localtunnel](https://theboroer.github.io/localtunnel-www/)
- [ngrok](https://ngrok.com/)
- [cloudflared (Cloudflare Tunnel)](https://github.com/cloudflare/cloudflared)

In this example, localtunnel is suggested, as the demo app builds with Node as well.

1. Install Localtunnel with  
`npm install -g localtunnel`
2. Start Localtunnel on port 8080 (the port used by the demo app) with  
`lt --port 8080`
3. Note the URL given to you by the last command to use in a later step. It will be something like `https://abc-xyz.loca.lt`

**Note:** Your mileage may vary for using secure tunnel public endpoint services based on organizational firewalls or other factors.


## Traction
1. Go to: https://traction-sandbox-tenant-ui.apps.silver.devops.gov.bc.ca
2. Click the link:  `Create Request!`
3. Enter a Tenant name and your email address
4. Save the Wallet ID and Wallet Key
5. Sign in using the Wallet ID and Key
6. Go to Profile page
7. Add the Tenant ID from the Profile page to the config.json file
8. Click the connect button to connect to bcovrin-test
9. Go to the Settings page
10. Add the url to your exposed tunnel endpoint in the **WebHook URL**  
  For example, if Localtunnel gave you `https://abc-xyz.loca.lt` then the Webhook URL will be `https://abc-xyz.loca.lt`
11. Enter the **WebHook Key** of: `demo-issuance`
12. Save changes
13. Go to the API Keys page
14. Click the Create API Key, give it an alias and submit
15. Add the generated API Key to the config.json file
16. Go to the Configuration > Schema Storage page
17. Click the Create Schema button, enter the values and submit:  
  Name: Demo Issuance Schema  
  Version: 1.0  
  Attributes:  
    &nbsp;&nbsp;&nbsp;given_name  
    &nbsp;&nbsp;&nbsp;family_name  
    &nbsp;&nbsp;&nbsp;expires
18. Click the + icon in the Credential Definition(s) column
19. Enter the values and submit:  
  Tag: Demo Issuance  
  Revocation Enabled: selected
20. Click the credential icon in the Credential Definition(s) column to go to the definition
21. Add the ID of the definition to the config.json file

## App
1. Add additional info to the config.json file  
  Set autoIssue:  
    &nbsp;&nbsp;&nbsp;true means Traction will automatically issue the credential once the user accepts  
    &nbsp;&nbsp;&nbsp;false means this app will issue the credential once the user accepts  
  Set the credential data  
  &nbsp;&nbsp;&nbsp;expires should be a date in the future with the format of YYYYMMDD
2. Make sure your computer is accessible through port 8080 (see Tunnel Setup above)
3. Run: `npm install`
4. Run: `npm start`