import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET - Obtener producto por ID
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id)
    const producto = await prisma.producto.findUnique({
      where: { id },
      include: {
        categoria: true
      }
    })

    if (!producto) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(producto)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener producto' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar producto
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id)
    const data = await request.json()
    const { nombre, descripcion, precio, stock, categoriaId } = data

    // Verificar que la categoría existe si se proporciona
    if (categoriaId) {
      const categoria = await prisma.categoria.findUnique({
        where: { id: parseInt(categoriaId) }
      })

      if (!categoria) {
        return NextResponse.json(
          { error: 'La categoría especificada no existe' },
          { status: 400 }
        )
      }
    }

    const producto = await prisma.producto.update({
      where: { id },
      data: {
        ...(nombre && { nombre }),
        ...(descripcion !== undefined && { descripcion }),
        ...(precio && { precio: parseFloat(precio) }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(categoriaId && { categoriaId: parseInt(categoriaId) })
      },
      include: {
        categoria: true
      }
    })

    return NextResponse.json(producto)
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar producto
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id)
    
    await prisma.producto.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Producto eliminado correctamente' })
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    )
  }
}