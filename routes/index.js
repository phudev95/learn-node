const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { catchErrors } = require( '../handlers/errorHandlers');

//# Home page
router.get('/', catchErrors(storeController.getStores));

//# Add and edit Store
router.get('/add', storeController.addStore);
router.post('/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);
router.post('/add/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);

//# [GET] Stores
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/:id/edit', catchErrors(storeController.editStore));

//# Store
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

//# Tags
router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

//# Debugging
router.get('/debug', storeController.debug);

module.exports = router;
