'use strict';

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      let stock = req.query.stock;
      let likes = req.query.likes;
      fetch('https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/' + stock + '/quote')
      .then(response => response.json())
      .then(data => {
        res.send({
          stockData: {
            stock: stock,
            price: data.latestPrice,
            likes: 1
          }
        });
      });
      
    });
    
};
