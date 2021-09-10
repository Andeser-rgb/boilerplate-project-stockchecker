'use strict';

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      const stock = req.query.stock;
      const likes = req.query.likes;
      const url = 'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/' + stock + '/quote';
      let newXHR = new XMLHttpRequest();
      newXHR.open("GET", url);
      newXHR.onreadystatechange = () => {
        if (this.status === 200 && this.readyState === 4){
          data = JSON.parse(this.response);
          res.send({
            stockData: {
              stock: stock,
              price: data.latestPrice,
              likes: 1
            }
          });
        }
      }

      
    });
    
};
