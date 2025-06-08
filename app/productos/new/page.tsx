'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NuevoProductoPage() {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [categorias, setCategorias] = useState([])
  const [error, setError] = useState('')
  const [loadingCategorias, setLoadingCategorias] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch('/api/categorias')
        if (!res.ok) throw new Error('No se pudieron cargar las categorías')
        const data = await res.json()
        setCategorias(data)
      } catch (err) {
        console.error(err)
        setError('Error al cargar las categorías')
      } finally {
        setLoadingCategorias(false)
      }
    }
    fetchCategorias()
  }, [])

  const validateForm = () => {
    if (!nombre.trim()) {
      setError('El nombre es obligatorio.')
      return false
    }
    if (!precio || isNaN(parseFloat(precio)) || parseFloat(precio) <= 0) {
      setError('El precio debe ser un número positivo.')
      return false
    }
    if (stock !== '' && (isNaN(parseInt(stock)) || parseInt(stock) < 0)) {
      setError('El stock debe ser un número entero igual o mayor a cero.')
      return false
    }
    if (!categoriaId) {
      setError('Debe seleccionar una categoría.')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          precio: parseFloat(precio),
          stock: stock === '' ? 0 : parseInt(stock),
          categoriaId: parseInt(categoriaId),
        }),
      })

      if (res.ok) {
        router.push('/productos')
      } else {
        const data = await res.json()
        setError(data.message || 'Error al crear producto.')
      }
    } catch {
      setError('Error de red. Intente nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md mt-10 text-black">
      <h1 className="text-2xl font-bold mb-6">Nuevo Producto</h1>

      {error && (
        <p role="alert" className="mb-4 text-red-600 font-semibold text-black">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="nombre" className="block mb-1 font-medium text-black">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="descripcion" className="block mb-1 font-medium text-black">
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="precio" className="block mb-1 font-medium text-black">
            Precio <span className="text-red-500">*</span>
          </label>
          <input
            id="precio"
            type="number"
            step="0.01"
            min="0"
            value={precio}
            onChange={e => setPrecio(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="stock" className="block mb-1 font-medium text-black">
            Stock
          </label>
          <input
            id="stock"
            type="number"
            min="0"
            value={stock}
            onChange={e => setStock(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="categoria" className="block mb-1 font-medium text-black">
            Categoría <span className="text-red-500">*</span>
          </label>
          {loadingCategorias ? (
            <p className="text-gray-600">Cargando categorías...</p>
          ) : (
            <select
              id="categoria"
              value={categoriaId}
              onChange={e => setCategoriaId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isSubmitting}
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md text-white font-semibold transition-colors ${
            isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
  )
}
