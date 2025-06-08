import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET - Obtener categoría por ID
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id)
    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: {
        productos: true
      }
    })

    if (!categoria) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(categoria)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener categoría' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar categoría
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id)
    const data = await request.json()
    const { nombre, descripcion } = data

    const categoria = await prisma.categoria.update({
      where: { id },
      data: {
        nombre,
        descripcion
      }
    })

    return NextResponse.json(categoria)
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe una categoría con ese nombre' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Error al actualizar categoría' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar categoría
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id)
    
    await prisma.categoria.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Categoría eliminada correctamente' })
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Error al eliminar categoría' },
      { status: 500 }
    )
  }
}