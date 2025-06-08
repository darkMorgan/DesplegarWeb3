import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET - Obtener todos los productos
export async function GET() {
  try {
    const productos = await prisma.producto.findMany({
      include: {
        categoria: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(productos)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo producto
export async function POST(request) {
  try {
    const data = await request.json()
    const { nombre, descripcion, precio, stock, categoriaId } = data

    if (!nombre || !precio || !categoriaId) {
      return NextResponse.json(
        { error: 'Nombre, precio y categoría son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que la categoría existe
    const categoria = await prisma.categoria.findUnique({
      where: { id: parseInt(categoriaId) }
    })

    if (!categoria) {
      return NextResponse.json(
        { error: 'La categoría especificada no existe' },
        { status: 400 }
      )
    }

    const producto = await prisma.producto.create({
      data: {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        stock: parseInt(stock) || 0,
        categoriaId: parseInt(categoriaId)
      },
      include: {
        categoria: true
      }
    })

    return NextResponse.json(producto, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    )
  }
}