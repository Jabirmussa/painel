import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
  name: String,
  status: {
    type: String,
    enum: ['Disponível', 'Esgotado', 'Em preparo', 'Prato do dia', 'Sugestões'],
    default: 'Disponível'
  },
  restaurantId: String,
  image: String,
  price: String,
  description: String,
  time: String,
}, { timestamps: true });

export default mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);
