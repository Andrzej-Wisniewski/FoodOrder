import mongoose from 'mongoose';

export default function validateObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
