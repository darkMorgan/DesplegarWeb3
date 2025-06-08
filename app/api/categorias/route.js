import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET - Obtener todas las categorías
export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany({
      include: {
        productos: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(categorias)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener categorías' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva categoría
export async function POST(request) {
  try {
    const data = await request.json()
    const { nombre, descripcion } = data

    if (!nombre) {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      )
    }

    const categoria = await prisma.categoria.create({
      data: {
        nombre,
        descripcion
      }
    })

    return NextResponse.json(categoria, { status: 201 })
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe una categoría con ese nombre' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Error al crear categoría' },
      { status: 500 }
    )
  }
}