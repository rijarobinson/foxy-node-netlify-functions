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

//const country = transactionData['_embedded']['fx:shipments']['country'];
//const category = transactionData['_embedded']['fx:items'][0]['_embedded']['fx:item_category']['code'];
// US — all customers 0% tax
// outside US — 12% tax non-dealers, 5% dealers

// need total to tax shipping amount
//const order_total = transactionData['total_item_price'];
//let tax_rate = 0;

//if (country != "US") {
//  if (category.toLowerCase() == "dealer") {
//    tax_rate = .05;
//  } else {
//    tax_rate = .12;
//  }
//} else {
//  tax_rate = 0;
//}

// need to fix this. rate is not updating correctly
let tax_amount = .3 * order_total;

 let taxConfiguration = {
   "ok":true,
   "details":"",
   "name":"custom tax",
   "expand_taxes":[
     {
       "name":"Tax",
       "rate":.3,
       "amount":tax_amount
      }
    ],
    "total_amount":tax_amount,
    "total_rate":.3
  };


 return {
   body: JSON.stringify(taxConfiguration),
   statusCode: 200
  };

// return {
//   body: JSON.stringify(transactionData),
//   statusCode: 200
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
