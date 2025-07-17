import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import MenuItem from '@/models/MenuItem';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
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
    description: data.get('description')
  });

  return NextResponse.json(newItem);
}
