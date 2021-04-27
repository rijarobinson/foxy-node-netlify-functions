import * as IdevAffiliate from "../../../src/functions/idevaffiliate-marketplace/idevaffiliate-marketplace.js";
import * as MockFoxyRequests from "../../MockFoxyRequests.js";
import { before, beforeEach, describe, it } from "mocha";
import chai from "chai";
import { config } from "../../../config.js";

const expect = chai.expect;

let sentRequests = [];

describe("Idev Affiliate", function() {

  before(
    function () {
      config.foxy.api.clientId = 'foo';
    }
  );

  beforeEach(
    function () {
      sentRequests = [];
    }
  );

  it ("Should validate requests", async function () {
    const response = await IdevAffiliate.handler({});
    expect(response.statusCode).to.equal(400);
    expect(JSON.parse(response.body).details).to.equal("Payload is not valid JSON.");
  });

  it ("Should inform of unsupported evets", async function () {
    const request = MockFoxyRequests.validRequest();
    request.headers['foxy-webhook-event'] = 'validation/payment';
    const response = await IdevAffiliate.handler(request);
    expect(response.statusCode).to.equal(501);
    expect(JSON.parse(response.body).details).to.equal("Unsupported event.");
  });

  it ("Should send items to Idev Affiliate", async function () {
    const request = MockFoxyRequests.validRequest({
      _embedded: {
        'fx:items': [
          {code: 'foo', name: 'foo', price: 1},
          {code: 'bar', name: 'bar', price: 2},
        ]
      }
    });
    request.headers['foxy-webhook-event'] = 'transaction/created';
    const response = await IdevAffiliate.handler(request);
    expect(sentRequests.map(i => i[1].body)
      .every(i => i.has('affiliate_id') &&
        i.has('idev_saleamt') &&
        i.has('idev_ordernum')
      )).to.be.true;
    expect(response.statusCode).to.equal(200);
  });

});
