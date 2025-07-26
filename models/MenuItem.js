import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
  name: String,
  status: {
    type: String,
    enum: ['Esgotado', 'Em preparo', 'Prato do dia', 'Sugestões', 'Pizzas', 'Bebidas', 'Pratos'],
    default: 'Pratos'
  },
  restaurantId: String,
  image: String,
  price: String,
  description: String,
  time: String,
}, { timestamps: true });

export default mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);