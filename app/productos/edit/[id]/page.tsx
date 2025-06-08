'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditarProductoPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState(0)
  const [stock, setStock] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/api/productos/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('No se pudo cargar el producto')
        return res.json()
      })
      .then(data => {
        setNombre(data.nombre)
        setDescripcion(data.descripcion || '')
        setPrecio(data.precio)
        setStock(data.stock)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const res = await fetch(`/api/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion, precio, stock }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Error al actualizar producto')
      }
      router.push('/productos')
    } catch (err) {
      setError(err.message || 'Error inesperado')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="p-6 text-center text-gray-700">Cargando producto...</p>

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl text-gray-800">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">Editar Producto</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Precio</label>
              <input
                type="number"
                value={precio}
                onChange={e => setPrecio(Number(e.target.value))}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={e => setStock(Number(e.target.value))}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}
