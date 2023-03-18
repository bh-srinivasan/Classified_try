const express = require('express');

const router = express.Router();

let categoryData;

module.exports = params => {
  let categoryList = null;

  router.use('/', async (req, res, next) => {
    if (!categoryList) {
      try {
        const { categoryService } = params;
        categoryList = await categoryService.getNames();
        categoryData = await categoryService.getListShort();
      } catch (err) {
        next(err);
      }
    }

    res.locals.categoryList = categoryList;
    res.locals.categoryData = categoryData; // corrected variable name
    next();
  });

  router.get('/', (req, res) => {
    res.render('layout/index', { pageTitle: 'Home Page', template: 'index' });
  });

  router.get('/category/:name/subcategories', async (req, res, next) => {
    try {
      const { categoryService } = params;
      const subcategories = await categoryService.getSubCategoriesForCategory(req.params.name.toString());
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
