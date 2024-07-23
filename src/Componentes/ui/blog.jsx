import React, { useState, useEffect } from 'react';

const formatDate = (dateString) => {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
};

export default function Example() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch('https://back-end-siveth-g8vc.vercel.app/api/records'); // Cambia la ruta según tu configuración de ruta en tu servidor
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  return (
    <div className="bg-white py-20 pt-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-center flex-col">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">Lugares más visitados</h2>
          <p className="text-gray-600">¡Anímate a viajar con nosotros!</p>
        </div>

        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {records.map((record) => (
            <article key={record.id} className="flex max-w-xl flex-col items-start justify-between">
              <div className="flex items-center gap-x-4 text-xs">
                <time dateTime={record.date} className="text-gray-500">
                  {formatDate(record.date)}
                </time>
              </div>
              <div className="group relative">
                <img
                  src={`http://localhost:3000/public/images/${record.image}`} // Ajusta la ruta base de la imagen según tu configuración
                  alt={record.title}
                  className="mt-3 w-full h-64 object-cover rounded-lg"
                />
                <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                  <a href={record.href}>
                    <span className="absolute inset-0" />
                    {record.title}
                  </a>
                </h3>
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{record.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
