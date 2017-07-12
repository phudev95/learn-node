const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
      type: Number,
      required:'You must supply coordinates!'
    }],
    address: {
      type: String,
      required: 'You must supply an address!'
    }
  },
  tags: [String],
  photo: String
});

storeSchema.pre('save', async function (next) {
  if (!this.isModified('name')) {
    next();
    return;
  }

  this.slug = slug(this.name);
  // find other stores that have a slug of wes, wes-1, wes-2
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const storeWithSlug = await this.constructor.find({slug: slugRegEx});

  if (storeWithSlug.length) {
    this.slug = `${this.slug}-${storeWithSlug.length + 1}`;
  }

  next();
});

storeSchema.statics.getTagsList = function () {
  return this.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};

module.exports = mongoose.model('Store', storeSchema);
