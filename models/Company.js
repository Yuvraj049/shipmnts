const mongoose = require('mongoose');
const { Schema } = mongoose; // Correctly import Schema

const companySchema = new Schema({
  name: String,
  contact: String
});

const Company = mongoose.model('companycontacts', companySchema);

module.exports = Company;