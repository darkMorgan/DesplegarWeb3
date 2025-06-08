'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditarCategoriaPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/api/categorias/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('No se pudo cargar la categoría')
        return res.json()
      })
      .then(data => {
        setNombre(data.nombre)
        setDescripcion(data.descripcion || '')
      })
      .catch(err => {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Error inesperado')
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const res = await fetch(`/api/categorias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Error al actualizar categoría')
      }
      router.push('/categorias')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Error inesperado')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="p-6 text-center">Cargando categoría...</p>

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Editar Categoría</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  )
}
