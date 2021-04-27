import { describe, it, before, after } from "mocha";
import chai from "chai";
import sinon from "sinon";
import * as originalWebhook from "../../../src/functions/datastore-integration-orderdesk/webhook.js";
const expect = chai.expect;

const MockFoxyWebhook = {
  getItems: function() {return [this.item];},
  item: {},
  messageInsufficientInventory: () => 'insufficientInventory',
  messagePriceMismatch: () => 'priceMismatch'
}

const getDataStore = () => MockDatastore;
const FoxyWebhook = MockFoxyWebhook;
const webhook = {...originalWebhook};

const MockDatastore = {
  item: {},
  updateResponse: {
    status: 'success'
  }, 
  differences: [],
  fetchInventoryItems:  async function() {
    return [arbitraryCanonicalItem(
      this.item, this.differences
    )]
  },
  updateInventoryItems: async function(i) {
    this.item = i[0];
    return this.updateResponse;
  },
  convertToCanonical: (i) => i
}

/**
 * Creates an Arbitrary Cart Item
 */
function arbitraryCartItem() {
  return {
    code: 1,
    name: 'foo',
    parent_code: 4,
    price: 1,
    quantity: 2,
    quantity_max: 3,
    quantity_min: 1,
    subscription_frequency: '1m',
    subscription_start_date: new Date().toISOString(),
    weight: 3,
  }
}

/**
 * Creates an Arbitrary Order Desk Item
 * @param {import(../../../foxy/FoxyWebhook).PrepaymentItem} item
 * @param {Array<string>} differences to exist between the pairs
 */
function arbitraryCanonicalItem(item = {}, differences = []) {
  item = {
    name: item.name,
    price: item.price,
    inventory: item.inventory,
    code: item.code,
    parent_code: item.parent_code
  }
  for (let d of differences) {
    item[d] += 1;
  }
  return item;
}

function resetMocks() {
  MockFoxyWebhook.item = arbitraryCartItem();
  MockDatastore.item = {...MockFoxyWebhook.item};
  MockDatastore.item.inventory = MockDatastore.item.quantity;
  MockDatastore.differences = [];
}

async function prePaymentExpectOk() {
  const result = await webhook.prePayment('foo');
  expect(result.statusCode).to.equal(200);
  expect(result.body).to.exist;
  const parsed = JSON.parse(result.body);
  expect(parsed.ok).to.be.true;
  expect(parsed.details).to.equal("");
  return parsed;
}

async function prePaymentExpectInvalid(reg) {
  const result = await webhook.prePayment('foo');
  expect(result.statusCode).to.equal(200);
  expect(result.body).to.exist;
  const parsed = JSON.parse(result.body);
  expect(parsed.ok).to.be.false;
  expect(parsed.details).to.match(reg);
  return parsed;
}

describe("OrderDesk Pre-payment Webhook", function() {
  let log;
  let logError;

  before(
    function() {
      log = sinon.stub(console, 'log');
      logError = sinon.stub(console, 'error');
    }
  );

  after(
    function() {
      log.restore();
      logError.restore();
    }
  );

  describe("Validates the cart items prices against a datastore", function() {
    it("Accepts if the prices are the same", async function () {
      resetMocks();
      await prePaymentExpectOk();
    });

    it("Accepts prices zero", async function () {
      resetMocks();
      MockFoxyWebhook.item.price = 0;
      MockDatastore.item.price = 0;
      await prePaymentExpectOk();
    });

    it("Accepts if the datastore has no price", async function () {
      resetMocks();
      MockDatastore.item.price = undefined;
      await prePaymentExpectOk();
    });

    it("Rejects if the prices are different", async function () {
      resetMocks();
      MockDatastore.item.price = 10;
      const result = await webhook.prePayment('foo');
      expect(result.statusCode).to.equal(200);
      expect(result.body).to.exist;
      expect(JSON.parse(result.body).ok).to.be.false;
      expect(JSON.parse(result.body).details).to.match(/priceMismatch/);
    });

    it("Rejects if the cart has no price and the datastore does", async function() {
      resetMocks();
      MockFoxyWebhook.item.price = undefined;
      await prePaymentExpectInvalid(/priceMismatch/);
    });
  });

  describe("Validates the cart items quantities agains a datastore", function() {
    it("Accepts if the quantity is the same or lower as the inventory", async function () {
      resetMocks();
      await prePaymentExpectOk();
      resetMocks();
      MockDatastore.item.inventory += 1;
      await prePaymentExpectOk();
    });

    it("Accepts if the quantity is zero", async function () {
      resetMocks();
      MockFoxyWebhook.item.quantity = 0;
      await prePaymentExpectOk();
      MockDatastore.item.inventory = -1;
      await prePaymentExpectOk();
    });

    it("Accepts if the the inventory field is null", async function () {
      resetMocks();
      MockDatastore.item.inventory = undefined;
      await prePaymentExpectOk();
    });

    it("Rejects if the quantity is higher", async function () {
      resetMocks();
      MockFoxyWebhook.item.quantity = 10;
      await prePaymentExpectInvalid(/insufficientInventory/);
    });

  });
});

describe("Transaction Created Webhook", function() {
  describe("Updates the datastore", function() {
    it("Deduces the quantity from the inventory.", async function () {
      resetMocks();
      await webhook.transactionCreated('foo');
      expect(MockDatastore.item.stock).to.equal(0);
      resetMocks();
      MockDatastore.item.inventory = 5;
      MockFoxyWebhook.item.quantity = 3;
      await webhook.transactionCreated('foo');
      expect(MockDatastore.item.stock).to.equal(2);
    });
    it("Sets Foxy.io OrderDesk Webhook as the update method");
  });

  describe("Responds useful messages", function() {
    it("Informs Foxy.io that the update was not successful.", async function () {
      const prevResponse = MockDatastore.updateResponse;
      MockDatastore.updateResponse = {
        status: 'fail'
      };
      let result = await webhook.transactionCreated('foo');
    });
  });

});
