export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-10">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-4xl font-extrabold mb-6 text-gray-800 text-center">
          Bienvenido a la Farmacia
        </h1>

        <ul className="list-disc list-inside space-y-4 text-lg text-gray-700">
          <li>
            <a
              href="/categorias"
              className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
            >
              Ver Categorías
            </a>
          </li>
          <li>
            <a
              href="/productos"
              className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
            >
              Ver Productos
            </a>
          </li>
        </ul>
      </div>
    </main>
  )
}
