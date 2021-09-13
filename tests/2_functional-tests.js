const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    suite('GET request at /api/stock-prices', () => {
        test('Viewing one stock', (done) => {
            chai.request(server)
                .get('/api/stock-prices')
                .query({
                    stock: 'GOOG'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200, "Server isn't connected");
                    assert.isObject(res.body, "GET request doesn't return an object");
                    assert.equal(res.body.stockData.stock, 'GOOG', "Stock value is wrong");
                    assert.isNumber(res.body.stockData.likes, "Likes value isn't a number");
                    assert.isNumber(res.body.stockData.price, "Price value isn't a number");
                    done();
                });
        });
        test('Viewing one stock and liking it', (done) => {
            chai.request(server)
                .get('/api/stock-prices')
                .query({
                    stock: 'GOOG',
                    like: true
                })
                .end((err, res) => {
                    assert.equal(res.status, 200, "Server isn't connected");
                    assert.isObject(res.body, "GET request doesn't return an object");
                    assert.equal(res.body.stockData.stock, 'GOOG', "Stock value is wrong");
                    assert.isNumber(res.body.stockData.price, "Price value isn't a number");
                    assert.isNumber(res.body.stockData.likes, "Likes value isn't a number");
                    assert.equal(res.body.stockData.likes, 1, "Likes value isn't one");
                    done();
                });
        });
        test('Viewing the same stock and liking it again', (done) => {
            chai.request(server)
                .get('/api/stock-prices')
                .query({
                    stock: 'GOOG',
                    like: true
                })
                .end((err, res) => {
                    assert.equal(res.status, 200, "Server isn't connected");
                    assert.isObject(res.body, "GET request doesn't return an object");
                    assert.equal(res.body.stockData.stock, 'GOOG', "Stock value is wrong");
                    assert.isNumber(res.body.stockData.price, "Price value isn't a number");
                    assert.isNumber(res.body.stockData.likes, "Likes value isn't a number");
                    assert.equal(res.body.stockData.likes, 1, "Likes value has changed");
                    done();
                });
        });
        test('Viewing two stocks', (done) => {
            chai.request(server)
                .get('/api/stock-prices')
                .query({
                    stock: ['GOOG', 'MSFT'],
                })
                .end((err, res) => {
                    assert.equal(res.status, 200, "Server isn't connected");
                    assert.isObject(res.body, "GET request doesn't return an object");
                    assert.isArray(res.body.stockData, "StockData isn't an array");
                    assert.equal(res.body.stockData[0].stock, 'GOOG', "First stock value is wrong");
                    assert.isNumber(res.body.stockData[0].price, "First price value isn't a number");
                    assert.isNumber(res.body.stockData[0].rel_likes, "First likes value isn't a number");
                    assert.equal(res.body.stockData[1].stock, 'MSFT', "Second stock value is wrong");
                    assert.isNumber(res.body.stockData[1].price, "Second price value isn't a number");
                    assert.isNumber(res.body.stockData[1].rel_likes, "Second likes value isn't a number");
                    done();
                });
        });
        test('Viewing two stocks and liking them', (done) => {
            chai.request(server)
                .get('/api/stock-prices')
                .query({
                    stock: ['GOOG', 'MSFT'],
                    like: true
                })
                .end((err, res) => {
                    assert.equal(res.status, 200, "Server isn't connected");
                    assert.isObject(res.body, "GET request doesn't return an object");
                    assert.isArray(res.body.stockData, "StockData isn't an array");
                    assert.equal(res.body.stockData[0].stock, 'GOOG', "First stock value is wrong");
                    assert.isNumber(res.body.stockData[0].price, "First price value isn't a number");
                    assert.isNumber(res.body.stockData[0].rel_likes, "First likes value isn't a number");
                    assert.equal(res.body.stockData[1].stock, 'MSFT', "Second stock value is wrong");
                    assert.isNumber(res.body.stockData[1].price, "Second price value isn't a number");
                    assert.isNumber(res.body.stockData[1].rel_likes, "Second likes value isn't a number");
                    assert.equal(res.body.stockData[0].rel_likes, 0, "First likes value isn't a number");
                    assert.equal(res.body.stockData[1].rel_likes, 0, "First likes value isn't a number");
                    done();
                });
        });
    });

});
