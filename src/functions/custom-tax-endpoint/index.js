const { json } = require("body-parser");
const FoxyWebhook = require("../../foxy/FoxyWebhook.js");
const MatchList = require("./matchlist.json");

/**
 * Receives the request, processes it and sends the response.
 * 
 * @param {Object} requestEvent the request event built by Netlify Functions
 * @returns {Promise<{statusCode: number, body: string}>} the response object
 */
// check out node example for custom shipping endpoint
async function handler(requestEvent) {
 const transactionData = JSON.parse(requestEvent.body);

// getting issues with the data, maybe print transactionData to browser 

// const country = transactionData['_embedded']['fx:shipment']['country'];
// const category = transactionData['__embedded']['fx:items'][0]['_embedded']['fx:item_category']['code'];
// doesn't tax shipping amount
// const order_total = transactionData['_embedded']['fx:shipment']['total_item_price'];
// let tax_rate = .12;

//if (category.toLowerCase() == "dealer") {
//  tax_rate = .05;
//}

//if (country == "US") {
//  tax_rate = 0;
//}

//let tax_amount = tax_rate * order_total;

 // if (getEmailList().includes(customerEmail) || getIPAddressList().includes(customerIP)) {
//  let taxConfiguration = {
//    "ok":true,
//    "details":"",
//    "name":"custom tax",
//    "expand_taxes":[
//      {
//        "name":"Tax",
//        "rate":tax_rate,
//        "amount":tax_amount
//       }
//     ],
//     "total_amount":tax_amount,
//     "total_rate":tax_rate
//   };


//  return {
//    body: JSON.stringify(taxConfiguration),
//    statusCode: 200
//   };

return JSON.stringify(transactionData);
      
//  }
 // return {
//    body: JSON.stringify({ details: "", ok: true }),
//    statusCode: 200,
//  }
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
