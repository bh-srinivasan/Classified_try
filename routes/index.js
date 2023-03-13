const express = require('express');

const router = express.Router();

module.exports = () => {
 
    router.get('/', async (request, response,next) => {
        
        // Getting list of speakers and passing to page
        try{
         
        return response.render('layout/index', { pageTitle: 'Home Page', template: 'index',} );
        }
        catch(err){
          return next(err);
        }
        

  });
    

  return router;
};