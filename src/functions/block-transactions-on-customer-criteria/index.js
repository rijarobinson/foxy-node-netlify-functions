const FoxyWebhook = require("../../foxy/FoxyWebhook.js");
const MatchList = require("./matchlist.json");
//const { config } = require("../../../config.js");


/**
 * Receives the request, processes it and sends the response.
 * 
 * @param {Object} requestEvent the request event built by Netlify Functions
 * @returns {Promise<{statusCode: number, body: string}>} the response object
 */

 async function handler(requestEvent) {

  // Validation
  // this will be empty if just run in the browser, duh


 const customerEmail = extractCustomerEmail(requestEvent.body);
 const customerIP = extractCustomerIP(requestEvent.body);

// add other strings to reject that maybe aren't emails
// like just 2nd level domain, or maybe use regex. Not sure how includes would process that
  // make changes, commit, then push. Netlify will auto-deploy, then can refresh netlify url in browser to get response
//return validCustomer(customerData, emailsToReject); 

if (getEmailList().includes(customerEmail) || getIPAddressList().includes(customerIP)) {
  return {
    body: JSON.stringify({ details: "Sorry, the transaction cannot be completed.", ok: false }),
    statusCode: 200,
  }
}
// for testing, remove when done and uncomment return statement below
return {
  body: JSON.stringify({ details: JSON.stringify(getIPAddressList()), ok: false }),
  statusCode: 200,
}

// return {
//   body: JSON.stringify({ details: "", ok: true }),
//   statusCode: 200,
// }

}

/**
 * Extract Customer Email from payload received from FoxyCart
 *
 * @param {string} body of the data received from payload
 * @returns {string} email address of transaction
 */
function extractCustomerEmail(body) {
  const objBody = JSON.parse(body);
  if (objBody && objBody._embedded && objBody._embedded['fx:customer']['email']) {
    return objBody._embedded['fx:customer']['email'];
  }
  return "";
}

/**
 * Extract Customer IP Address from payload received from FoxyCart
 *
 * @param {string} body of the data received from payload
 * @returns {string} ip address of transaction
 */
 function extractCustomerIP(body) {
  const objBody = JSON.parse(body);
  if (objBody && objBody['customer_ip']) {
    return objBody['customer_ip'];
  }
  return "";
}

/**
 * Opens file and returns list of emails
 *
 * @param {Object} email to be validated
 * @returns {array} array of email addresses
 */

function getEmailList() {
  const emailsToReject = MatchList["email_addresses"];
  if (emailsToReject) {
    return emailsToReject;
  }
  return [];
}

/**
 * Opens file and returns IP Addresses to block
 *
 * @param {Object} IP Addresses to be validated
 * @returns {array} array of IP Addresses
 */

 function getIPAddressList() {
  const ipsToReject = MatchList["ip_addresses"];
  if (ipsToReject) {
    return ipsToReject;
  }
  return [];
}

module.exports = {
  handler
}
