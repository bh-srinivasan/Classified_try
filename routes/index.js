const express = require('express');

const router = express.Router();

module.exports = params =>  {
 
    router.get('/', async (request, response,next) => {
        
        // Getting list of speakers and passing to page
        try{
          const { categoryService } = params;
          const categoryList = await categoryService.getList()
          console.log(`Category List is:${categoryList}`)
        return response.render('layout/index', { pageTitle: 'Home Page', template: 'index',} );
        }
        catch(err){
          return next(err);
        }
        

  });
    

  return router;
};