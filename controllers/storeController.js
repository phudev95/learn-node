const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That filetype isn\'t allowed!' }, false);
    }
  }
};

exports.homePage = (req, res) => {
  res.render('index', {title: 'Home'});
};

exports.addStore = (req, res) => {
  res.render('editStore', {title: 'Add Store'});
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    next(); // skip to the next middleware
    return;
  }

  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // now we resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // once we have written the photo to our filesystem, keep going!
  next();
};

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body).save());
  req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  // 1. Query the database for a list of all stores
  const stores = await Store.find();
  res.render('stores', { stores, title: 'Stores' });
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

exports.getStoreBySlug = async (req, res, next) => {
  const { slug } = req.params;
  const store = await Store.findOne({ slug });
  if (!store) return next();

  res.render('store', {store, title: store.name});
};

exports.getStoresByTag = async (req, res) => {
  const { tag } = req.params;
  const tagQuery = tag || { $exists: true };
  const tagsPromise = Store.getTagsList();
  const storesPromise = Store.find({ tags: tagQuery });
  const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);
  res.render('tag', { tag, tags, stores, title: 'Tags' });
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
