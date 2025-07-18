import { connectDB } from '@/lib/mongodb';
import Pedido from '@/models/Pedido';

export async function POST(req) {
  try {
    const body = await req.json();
    await connectDB();

    const novoPedido = new Pedido(body);
    await novoPedido.save();

    return new Response(JSON.stringify({ message: 'Pedido criado!' }), {
      status: 201,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Erro ao criar pedido' }), {
      status: 500,
    });
  }
}
