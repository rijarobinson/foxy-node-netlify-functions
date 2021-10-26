const FoxyWebhook = require("../../foxy/FoxyWebhook.js");
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
  
 const emailsToReject = ["rija@example.com"];

// add other strings to reject that maybe aren't emails
// like just 2nd level domain, or maybe use regex. Not sure how includes would process that
  // make changes, commit, then push. Netlify will auto-deploy, then can refresh netlify url in browser to get response
//return validCustomer(customerData, emailsToReject); 

if (emailsToReject.includes(customerEmail)) {
  return {
    body: JSON.stringify({ details: "problem", ok: false }),
    statusCode: 200,
  }

}

return {
  body: JSON.stringify({ details: customerData, ok: false }),
  statusCode: 200,
}

}

/**
 * Extract Customer Details from payload received from FoxyCart
 *
 * @param {string} body of the data received from datastore or file
 * @returns {Array} an array of items
 */
function extractCustomerEmail(body) {
  const objBody = JSON.parse(body);
  if (objBody && objBody._embedded && objBody._embedded['fx:customer']['email']) {
    return objBody._embedded['fx:customer']['email'];
  }
  return [];
}

/**
 * Checks if email is on blocklist
 *
 * @param {Object} email to be validated
 * @returns {boolean} valid
 */
/*function validCustomer(email, emailsToReject) {
  if (!email || emailsToReject.includes(email)) {
    return {
      body: JSON.stringify({ details: "Sorry, the transaction cannot be completed.", ok: false }),
      statusCode: 200,
    };
  }
  return {
    body: JSON.stringify({ details: "Ok.", ok: true }),
    statusCode: 200,
  }}*/

module.exports = {
  handler
}
