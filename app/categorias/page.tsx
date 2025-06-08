'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Categoria {
  id: number
  nombre: string
  descripcion?: string
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchCategorias()
  }, [])

  const fetchCategorias = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/categorias')
      if (!res.ok) throw new Error('Error al cargar categorías')
      const data = await res.json()
      setCategorias(data)
    } catch (err: any) {
      setError(err.message || 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar esta categoría?')) return

    setDeleteLoadingId(id)
    try {
      const res = await fetch(`/api/categorias/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Error al eliminar')
      }
      setCategorias((prev) => prev.filter(c => c.id !== id))
    } catch (err: any) {
      alert(err.message || 'Error inesperado al eliminar')
    } finally {
      setDeleteLoadingId(null)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Categorías</h1>

      <button
        onClick={() => router.push('/')}
        className="mb-6 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        ← Volver al inicio
      </button>

      <Link href="/categorias/new">
        <span className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-6 cursor-pointer ml-4">
          + Nueva categoría
        </span>
      </Link>

      {loading && <p className="text-gray-500">Cargando...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <ul className="space-y-4">
        {categorias.map(c => (
          <li key={c.id} className="p-4 border rounded shadow flex justify-between items-center">
            <div>
              <p className="text-xl font-semibold">{c.nombre}</p>
              <p className="text-sm text-gray-600">{c.descripcion || 'Sin descripción'}</p>
            </div>

            <div className="space-x-2">
              <Link
                href={`/categorias/edit/${c.id}`}
                className="inline-block bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Editar
              </Link>

              <button
                onClick={() => handleDelete(c.id)}
                disabled={deleteLoadingId === c.id}
                className={`inline-block px-3 py-1 rounded text-white ${
                  deleteLoadingId === c.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {deleteLoadingId === c.id ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
