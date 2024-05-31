import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  query: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    //required: true,
  },
  industry: {
    type: String,
    //required: true,
  },
  address: {
    type: String,
    //required: true,
  },
  city: {
    type: String,
    //required: true,
  },
  state: {
    type: String,
    //required: true,
  },
  country: {
    type: String,
    //required: true,
  },
  postalCode: {
    type: String,
    //required: true,
  },
  phoneNumber: {
    type: String,
    //required: true,
  },
  email: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  contactPerson: {
    type: String,
    //required: true,
  },
  contactPersonTitle: {
    type: String,
  },
  additionalNotes: {
    type: String,
  },
  reports: [reportSchema],
});

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
