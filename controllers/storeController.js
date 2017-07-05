const Store = require('../models/Store');

exports.homePage = (req, res) => {
  res.render('index', {title: 'Home'});
};

exports.addStore = (req, res) => {
  res.render('editStore', {title: 'Add Store'});
};

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body).save());
  req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  // 1. Query the database for a list of all stores
  const stores = await Store.find();
  res.render('stores', { stores });
};

exports.editStore = async (req, res) => {
  // 1. Find the store given the ID
  const { id } = req.params;
  const store = await Store.findOne({ _id: id });
  // 2. Confirm they are the owner of the store
  // TODO
  // 3. Render out the edit form so the user can update theis store
  res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
  // 1. Find and update the store
  const { id } = req.params;
  const store = await Store.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true
  });

  // 2. Redirect the the store and tell them it worked
  req.flash('success', `Successfully Updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store →</a>`)
  res.redirect(`/stores/${store._id}/edit`);
};

exports.debug = (req, res) => {
  res.status(200);
  res.format({
    'text/html': () => {
      res.render('index', {title: 'Debug with HTML/CSS style.'});
    },
    'application/json': () => {
      res.render('index', {title: 'Debug with Json style.'});
    }
  });
};
