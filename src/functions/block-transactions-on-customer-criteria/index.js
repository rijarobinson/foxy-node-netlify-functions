const FoxyWebhook = require("../../foxy/FoxyWebhook.js");
const { config } = require("../../../config.js");




/**
 * @param {Object} requestEvent the request event built by Netlify Functions
 * @returns {Promise<{statusCode: number, body: string}>} the response object
 */


 async function handler(requestEvent) {

  // Validation
  // this will be empty if just run in the browser, duh
 //const customerData = JSON.stringify(extractCustomerDetails(requestEvent.body));
  const objBody = JSON.parse(requestEvent.body);

  const customerData = objBody._embedded['fx:customer']['email'];

  const emailsToReject = ["rija@example.com"];


  // START HERE!!! just printing stuff. customerData was empty, so not getting body correctly?
// make changes, commit, then push. Netlify will auto-deploy, then can refresh netlify url in browser to get response
//return validCustomer(customerData, emailsToReject); 

if (emailsToReject.includes("rija@example.com")) {
  return {
    body: JSON.stringify({ details: "problem", ok: false }),
    statusCode: 200,
  }

}



}

/*  if (!validation.customer.validate(customerData)) {
    return validation.customer.response(customerData);
  }*/
/*  const values = [];
  const cache = createCache();
  // Fetch information needed to validate the cart
  try {
    await customerData.reduce(
      (p, i) => p.then(
        (accum) => fetchItem(cache, i).then((fetched) => {
          values.push(fetched);
          return accum;
        }),
      ), Promise.resolve(values),
    );
    let failed = findMismatch(values);
    if (!failed) {
      const outOfStock = outOfStockItems(values);
      if (outOfStock) {
        failed = getMessages().insufficientInventory + " " + outOfStock;
      }
    }
    if (failed) {
      return {
        body: JSON.stringify({ details: failed, ok: false, }),
        statusCode: 200,
      };
    } else {
      console.log('OK: payment approved - no mismatch found')
      return {
        body: JSON.stringify({ details: '', ok: true, }),
        statusCode: 200,
      };
    }
  } catch (e) {
    console.error(e);
    return {
      body: JSON.stringify({ details: "An internal error has occurred", ok: false, }),
      statusCode: 500,
    };
  }*/
//}

/**
 * Extract Customer Details from payload received from FoxyCart
 *
 * @param {string} body of the data received from datastore or file
 * @returns {Array} an array of items
 */
function extractCustomerDetails(body) {
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

/**
 * Validation checks
 */
/*const validation = {
  validate: function (requestEvent) {
    this.errorMessage = FoxyWebhook.validFoxyRequest(requestEvent);
    return !this.errorMessage;
  },
  customer: {
    response: (body) => ({
      body: JSON.stringify({
        details: `Invalid items: ${customer_data.join(',')}`,
        ok: false,
      }),
      statusCode: 200,
    }),
    validate: (customer_data) => customer.every(e => validItem(e)),
  }
}*/

module.exports = {
  handler
}
