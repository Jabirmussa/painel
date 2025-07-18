import mongoose from 'mongoose';

const PedidoSchema = new mongoose.Schema({
  itemId: String,
  name: String,
  price: String,
  restaurantId: String,
  status: String,
  data: Date
});

export default mongoose.models.Pedido || mongoose.model('Pedido', PedidoSchema);
