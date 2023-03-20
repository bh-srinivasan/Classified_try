const express = require('express');

const router = express.Router();

module.exports = (params) => {
  console.log('Inside index.js');
  let categoryList;
  let categoryData;

  router.get('/', async (request, response, next) => {
    try {
      console.log(`Inside router get`);
      const { categoryService } = params;
      categoryList = await categoryService.getNames();
      categoryData = await categoryService.getListShort();
    } catch (err) {
      next(err);
    }

    response.locals.categoryList = categoryList;
    response.locals.categoryData = categoryData;
    response.render('layout/index', {
      pageTitle: 'Home Page',
      template: 'index',
    });
  });

  router.get('/category/:name/subcategories', async (req, res, next) => {
    try {
      const { categoryService } = params;
      const subcategories = await categoryService.getSubCategoriesForCategory(
        req.params.name.toString()
      );
      console.log(req.params.name);
      console.log(subcategories);
      res.json(subcategories);
    } catch (err) {
      next(err);
    }
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
