'use strict';

const https = require('https');
const mongoose = require('mongoose');

const uri = process.env.DB;

module.exports = function(app) {


    mongoose.connect(uri);
    const StockLikes = mongoose.model('StockLikes', {
        name: String,
        likes: Number,
        ips: [String]
    });

    app.route('/api/stock-prices')
        .get((req, res) => {
            const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
            const stock = req.query.stock;
            const like = req.query.like || false;

            if (typeof stock === 'string') {
                const url = 'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/' + stock + '/quote';
                https.get(url, (response) => {

                    let todo = '';

                    response.on('data', (chunk) => {
                        todo += chunk;
                    });

                    response.on('end', () => {
                        let data = JSON.parse(todo);
                        let likes = 0;

                        StockLikes.findOne({
                            name: stock
                        }, (err, dbLikes) => {
                            if (err) throw err;
                            if (dbLikes === null) {
                                addStock(StockLikes, stock, like, ip);
                                if (like) likes = 1;
                            } else {
                                let included = dbLikes.ips.includes(ip);
                                if (like && !included){
                                    updateStockLikes(StockLikes, dbLikes, stock, ip);
                                    likes = dbLikes.likes + 1;
                                }
                                else{
                                    likes = dbLikes.likes;
                                }
                            }
                            res.send({
                                stockData: {
                                    stock: stock,
                                    price: data.latestPrice,
                                    likes: likes
                                }
                            });
                        });
                    });
                });
            } else {
                const url1 = 'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/' + stock[0] + '/quote';
                const url2 = 'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/' + stock[1] + '/quote';
                https.get(url1, response => {
                    let todo = '';
                    response.on('data', d => {
                        todo += d;
                    });
                    response.on('end', () => {
                        let data1 = JSON.parse(todo);
                        https.get(url2, response => {
                            todo = '';
                            response.on('data', d => {
                                todo += d;
                            });
                            response.on('end', () => {
                                let data2 = JSON.parse(todo);
                                let likes1 = 0;
                                let likes2 = 0;

                                StockLikes.findOne({
                                    name: stock[0]
                                }, (err, dbLikes) => {
                                    if (err) throw err;
                                    if (dbLikes === null) {
                                        addStock(StockLikes, stock[0], like, ip);
                                        if (like) likes1 = 1;
                                    } else {
                                        if (like && !dbLikes.ips.includes(ip)){
                                            updateStockLikes(StockLikes, dbLikes, stock[0], ip);
                                            likes1 = dbLikes.likes + 1;
                                        }
                                        else
                                            likes1 = dbLikes.likes;
                                    }
                                    StockLikes.findOne({
                                        name: stock[1]
                                    }, (err, dbLikes) => {
                                        if (err) throw err;
                                        if (dbLikes === null) {
                                            addStock(StockLikes, stock[1], like, ip);
                                            if (like) likes2 = 1;
                                        } else {
                                            if (like && !dbLikes.ips.includes(ip)){
                                                updateStockLikes(StockLikes, dbLikes, stock[1], ip);
                                                likes2 = dbLikes.likes + 1;
                                            }
                                            else
                                                likes2 = dbLikes.likes;
                                        }
                                        res.send({
                                            stockData: [{
                                                stock: stock[0],
                                                price: data1.latestPrice,
                                                rel_likes: likes1 - likes2
                                            }, {
                                                stock: stock[1],
                                                price: data2.latestPrice,
                                                rel_likes: likes2 - likes1
                                            }]
                                        });
                                    });

                                });

                            });
                        });
                    });
                });
            }
        });
};

function updateStockLikes(model, object, name, ip) {
    model.findOneAndUpdate({
        name: name
    }, {
        likes: object.likes + 1,
        ips: [...object.ips, ip]
    }, (err, docs) => {
        if (err) throw err;
        console.log('Original doc: ' + docs);
    });
}

function addStock(model, stock, like, ip) {
    const newStock = new model({
        name: stock,
        likes: like ? 1 : 0,
        ips: like ? [ip] : []
    });
    newStock.save((err, data) => {
        if (err) throw err;
    });
}
