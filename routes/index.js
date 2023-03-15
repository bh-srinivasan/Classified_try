const express = require('express');

const router = express.Router();

module.exports = params =>  {
  let categoryList = null;

  router.use('/', async (request, response, next) => {
    if (!categoryList) {
      try {
        console.log('Middleware function executing...');
        
        const { categoryService } = params;
        console.log('Calling categoryService.getNames()...');
        categoryList = await categoryService.getNames();
        console.log(`Category List is: ${categoryList}`);
      } catch (err) {
        next(err);
      }
    }
  
    response.locals.categoryList = categoryList;
    next();
  });
  
  router.get('/', (request, response) => {
    response.render('layout/index', { pageTitle: 'Home Page', template: 'index' });
  });
  
  

  return router;
};

/* Second Approach
let responseSent = false;

router.get('/', async (request, response, next) => {
  if (responseSent) {
    return;
  }

  try {
    console.log('Middleware function executing...');
    
    const { categoryService } = params;
    console.log('Calling categoryService.getNames()...');
    const categoryList = await categoryService.getNames();
    console.log(`Category List is: ${categoryList}`);
    
    response.render('layout/index', { pageTitle: 'Home Page', template: 'index' });
    responseSent = true;
  } catch (err) {
    next(err);
  }
});
*/
