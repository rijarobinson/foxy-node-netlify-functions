//const FoxyWebhook = require("../../foxy/FoxyWebhook.js");
//const { config } = require("../../../config.js");

return {
  body: JSON.stringify({ details: "The message", ok: false, }),
  statusCode: 500,
};

//const emailsToReject = ["rija@example.com"];

/**
 * @param {Object} requestEvent the request event built by Netlify Functions
 * @returns {Promise<{statusCode: number, body: string}>} the response object
 */
/*async function handler(requestEvent) {
  // Validation
  const customerData = extractCustomerDetails();
  if (!validation.customer.validate(customerData)) {
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
/*function extractCustomerDetails(body) {
  const objBody = JSON.parse(body);
  if (objBody && objBody._embedded && objBody._embedded['fx:customer']) {
    return objBody._embedded['fx:customer'];
  }
  return [];
}*/

/**
 * Checks if email is on blocklist
 *
 * @param {Object} email to be validated
 * @returns {boolean} valid
 */
/*function validCustomer(customer) {
  const errors = [];
  if (!(customer.email || listOfBadEmails.Includes(customer.email))) {
    errors.push("Sorry, the transaction cannot be completed.")
  }
  if (errors.length) {
    return false;
  }
  return true;
}*/

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
}

module.exports = {
  handler,
  extractCustomerDetails
}*/
