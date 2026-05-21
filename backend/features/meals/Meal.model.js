import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ['Starter', 'Soup', 'Main Dish', 'Dessert', 'Drinks'],
      required: true,
    },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Meal', mealSchema);
