'use strict';

const https = require('https');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      const stock = req.query.stock;
      const likes = req.query.likes;
      https.get('https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/' + stock + '/quote', (response) => {
        let todo = '';
        response.on('data', (chunk) => {
          todo += chunk;
        })

        response.on('end', () => {
          data = JSON.parse(todo);
          res.send({
            stockData: {
              stock: stock,
              price: data.latestPrice,
              likes: 1
            }
          });
        })

      })
    });
    
};
