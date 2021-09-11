'use strict';

const https = require('https');
const mongoose = require('mongoose');
const uri = process.env.DB;

module.exports = function (app) {

  
    mongoose.connect(uri);
    const StockLikes = mongoose.model('StockLikes', {
      name: String, 
      likes: Number,
      ips: Array
    });

    app.route('/api/stock-prices')
      .get(function (req, res){
        const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        const stock = req.query.stock;
        const like = req.query.like;
        const url = 'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/' + stock + '/quote';
        https.get(url, (response) => {
          let todo = '';
          response.on('data', (chunk) => {
            todo += chunk;
          })
          response.on('end', () => {
            StockLikes.findOne({name: stock}, (err, dbLikes) => {
              console.log(like);
              if (dbLikes === null){
                console.log('Ciao');
                const newStock = new StockLikes({
                  name: stock, 
                  likes: like === undefined ? 0 : 1,
                  ips: like === undefined ? [] : [ip]
                });
                newStock.save((err, data) => {
                  if (err) throw err;
                });
                dbLikes = like === undefined ? 0 : 1;
              }
              else{
                if (like && !dbLikes.ips.includes(ip)){
                  StockLikes.findOneAndUpdate({name: stock}, {
                    likes: dbLikes.likes + 1,
                    ips: dbLikes.ips.push(ip)
                  }, (err, docs) => {
                    if (err) throw err;
                    console.log('Original doc: ' + docs);
                  });
                }
                dbLikes = dbLikes.likes;
              }
              let data = JSON.parse(todo);
              res.send({
                stockData: {
                  stock: stock,
                  price: data.latestPrice,
                  likes: dbLikes
                }
              });
            });
          })
        })
      });
};
