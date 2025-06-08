'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NuevaCategoriaPage() {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!nombre.trim()) {
      setError('El nombre es obligatorio.')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion }),
      })

      if (res.ok) {
        router.push('/categorias')
      } else {
        const data = await res.json()
        setError(data.message || 'Error al crear categoría.')
      }
    } catch {
      setError('Error de conexión. Intenta más tarde.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10 text-black">
      <h1 className="text-3xl font-semibold mb-6 text-center">Nueva Categoría</h1>

      {error && (
        <p
          role="alert"
          className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6 border border-red-300"
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="nombre" className="block font-medium mb-1">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese el nombre de la categoría"
            required
            disabled={isLoading}
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="descripcion" className="block font-medium mb-1">
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded resize-none text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Opcional: Describe brevemente la categoría"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded text-white font-semibold transition-colors ${
            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
  )
}
