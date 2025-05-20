import React, { useState } from "react";

export default function Dashboard() {
  const [habitacionActiva, setHabitacionActiva] = useState(null);

  const habitaciones = [
    { id: 1, nombre: "Habitación 1", estado: "ok" },
    { id: 2, nombre: "Habitación 2", estado: "alerta" },
    { id: 3, nombre: "Habitación 3", estado: "ok" },
  ];

  const kpis = [
    { titulo: "Latidos", valor: "72 bpm" },
    { titulo: "Respiración", valor: "17 rpm" },
    { titulo: "CO₂", valor: "850 ppm" },
    { titulo: "Caídas", valor: "No detectadas" },
  ];

  return (
    <div className="flex h-screen">
      {/* Menú lateral */}
      <aside className="w-64 bg-slate-800 text-white p-4 space-y-4">
        <div className="text-2xl font-bold">CoreCare</div>
        <nav className="space-y-2">
          <button className="block w-full text-left hover:bg-slate-700 rounded px-2 py-1">Residencias</button>
          <button className="block w-full text-left hover:bg-slate-700 rounded px-2 py-1">Alertas</button>
          <button className="block w-full text-left hover:bg-slate-700 rounded px-2 py-1">Configuración</button>
        </nav>
      </aside>

      {/* Panel principal */}
      <main className="flex-1 bg-slate-100 p-6">
        {!habitacionActiva ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {habitaciones.map((h) => (
              <div
                key={h.id}
                onClick={() => setHabitacionActiva(h)}
                className={`cursor-pointer rounded-xl p-6 shadow-md transition hover:scale-105 ${
                  h.estado === "ok" ? "bg-green-200" : "bg-red-300"
                }`}
              >
                <h3 className="text-xl font-semibold">{h.nombre}</h3>
                <p>{h.estado === "ok" ? "Sin alertas" : "Alerta activa"}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => setHabitacionActiva(null)}
              className="text-blue-600 underline"
            >
              ← Volver a vista general
            </button>
            <h2 className="text-2xl font-bold">{habitacionActiva.nombre}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {kpis.map((kpi, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-xl shadow text-center border border-slate-200"
                >
                  <h4 className="text-lg font-semibold mb-2">{kpi.titulo}</h4>
                  <div className="text-2xl font-bold">{kpi.valor}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
