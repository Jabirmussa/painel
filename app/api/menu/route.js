import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import MenuItem from '@/models/MenuItem';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: Listar o menu
export async function GET() {
  try {
    await connectDB();
    const items = await MenuItem.find();
    return NextResponse.json(items);
  } catch (err) {
    console.error('Erro ao buscar menu:', err);
    return NextResponse.json({ error: 'Erro ao buscar menu' }, { status: 500 });
  }
}

// POST: Cadastrar um prato
export async function POST(req) {
  try {
    await connectDB();

    const data = await req.formData();
    const file = data.get('image');

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'menu-items' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(buffer);
    });

    const newItem = await MenuItem.create({
      name: data.get('name'),
      price: data.get('price'),
      status: data.get('status'),
      restaurantId: data.get('restaurantId'),
      image: uploadResult.secure_url,
      description: data.get('description') || '',
      time: data.get('time') || '',
    });

    return NextResponse.json(newItem);
  } catch (err) {
    console.error('Erro ao criar item do menu:', err);
    return NextResponse.json({ error: 'Erro ao criar item' }, { status: 500 });
  }
}

// PUT: Atualizar um prato
export async function PUT(req) {
  try {
    await connectDB();

    const data = await req.formData();
    const itemId = data.get('id');
    const file = data.get('image');

    let imageUrl;
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'menu-items' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(
      itemId,
      {
        name: data.get('name'),
        price: data.get('price'),
        status: data.get('status'),
        restaurantId: data.get('restaurantId'),
        image: imageUrl || undefined,
        description: data.get('description') || '',
        time: data.get('time') || '',
      },
      { new: true }
    );

    return NextResponse.json(updatedItem);
  } catch (err) {
    console.error('Erro ao atualizar item do menu:', err);
    return NextResponse.json({ error: 'Erro ao atualizar item' }, { status: 500 });
  }
}

// DELETE: Excluir um prato
export async function DELETE(req) {
  try {
    await connectDB();

    const body = await req.json(); // 👈 Aqui muda!
    const itemId = body.id;

    const deletedItem = await MenuItem.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Item excluído com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir item do menu:', err);
    return NextResponse.json({ error: 'Erro ao excluir item' }, { status: 500 });
  }
}

