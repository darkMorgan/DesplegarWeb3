'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProductosPage() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteLoadingId, setDeleteLoadingId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    try {
      const res = await fetch('/api/productos')
      if (!res.ok) throw new Error('Error al cargar productos')
      const data = await res.json()
      setProductos(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return
    setDeleteLoadingId(id)
    try {
      const res = await fetch(`/api/productos/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Error al eliminar producto')
      setProductos(prev => prev.filter(p => p.id !== id))
    } catch (err: any) {
      alert(err.message || 'Error al eliminar')
    } finally {
      setDeleteLoadingId(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Productos</h1>

      {/* Botón regresar al inicio */}
      <button
        onClick={() => router.push('/')}
        className="mb-6 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        ← Volver al inicio
      </button>

      <Link href="/productos/new">
        <span className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-6 ml-4">
          + Nuevo producto
        </span>
      </Link>

      {loading && <p className="text-gray-500">Cargando...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <ul className="space-y-4">
        {productos.map(p => (
          <li key={p.id} className="p-4 border rounded shadow">
            <p className="text-xl font-semibold">{p.nombre}</p>
            <p className="text-sm text-gray-600">{p.descripcion || 'Sin descripción'}</p>
            <p className="text-sm text-gray-600">Precio: ${p.precio}</p>
            <p className="text-sm text-gray-600">Stock: {p.stock}</p>
            <p className="text-sm text-gray-600">Categoría: {p.categoria?.nombre || 'Sin categoría'}</p>

            <div className="mt-4 flex space-x-2">
              <Link
                href={`/productos/edit/${p.id}`}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Editar
              </Link>

              <button
                onClick={() => handleDelete(p.id)}
                disabled={deleteLoadingId === p.id}
                className={`px-3 py-1 rounded text-white ${
                  deleteLoadingId === p.id
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {deleteLoadingId === p.id ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
