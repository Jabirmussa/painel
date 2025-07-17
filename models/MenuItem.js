import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
  name: String,
  status: {
    type: String,
    enum: ['Disponível', 'Esgotado', 'Em preparo'],
    default: 'Disponível'
  },
  restaurantId: String,
  image: String,
  price: String,
  description: String,
}, { timestamps: true });

export default mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);
