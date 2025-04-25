import React, { useState } from "react";
import "./index.css";
import { useEffect } from "react";

function App() {
  const [eventos, setEventos] = useState(() => {
    const eventosGuardados = localStorage.getItem("eventos");
    return eventosGuardados ? JSON.parse(eventosGuardados) : [];
  });
  

  const [puertaAbierta, setPuertaAbierta] = useState(false);
  const [puertaTiempo, setPuertaTiempo] = useState(null);

  const [co2Alto, setCo2Alto] = useState(false);
  const [co2Tiempo, setCo2Tiempo] = useState(null);

  const [ultimoMovimiento, setUltimoMovimiento] = useState(Date.now());



  const manejarEvento = (zona, tipo) => {
    const nuevoEvento = { zona, tipo, hora: new Date().toLocaleTimeString() };
    setUltimoMovimiento(Date.now());
    setEventos([nuevoEvento, ...eventos]);
  };

  const manejarPuerta = () => {
    if (!puertaAbierta) {
      // Abrimos la puerta
      setPuertaAbierta(true);
      setPuertaTiempo(Date.now());
      setEventos(prev => [
        { zona: "Entrada", tipo: "puerta abierta", hora: new Date().toLocaleTimeString() },
        ...prev
      ]);
    } else {
      // Cerramos la puerta
      setPuertaAbierta(false);
      setPuertaTiempo(null);
      setEventos(prev => [
        { zona: "Entrada", tipo: "puerta cerrada", hora: new Date().toLocaleTimeString() },
        ...prev
      ]);
    }
  };

  const manejarCalidadAire = () => {
    if (!co2Alto) {
      setCo2Alto(true);
      setCo2Tiempo(Date.now());
      setEventos(prev => [
        { zona: "Salón", tipo: "mala calidad del aire detectada", hora: new Date().toLocaleTimeString() },
        ...prev
      ]);
    } else {
      setCo2Alto(false);
      setCo2Tiempo(null);
      setEventos(prev => [
        { zona: "Salón", tipo: "aire ventilado", hora: new Date().toLocaleTimeString() },
        ...prev
      ]);
    }
  };
  
  const limpiarEventos = () => {
    if (window.confirm("¿Seguro que quieres borrar todos los eventos?")) {
      setEventos([]);
      localStorage.removeItem("eventos");
    }
  };

  const exportarCSV = () => {
    if (eventos.length === 0) {
      alert("No hay eventos para exportar.");
      return;
    }
  
    const encabezado = ["Zona", "Tipo", "Hora"];
    const filas = eventos.map(e => [e.zona, e.tipo, e.hora]);
  
    const contenido = [encabezado, ...filas]
      .map(fila => fila.map(dato => `"${dato}"`).join(","))
      .join("\n");
  
    const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "eventos_silvertech.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  

// ...

useEffect(() => {
  let intervalo = null;

  if (puertaAbierta && puertaTiempo) {
    intervalo = setInterval(() => {
      const ahora = Date.now();
      const diferencia = (ahora - puertaTiempo) / 1000; // segundos

      if (diferencia > 20) {
        setEventos(prev => [
          { zona: "Entrada", tipo: "alerta: puerta abierta demasiado tiempo", hora: new Date().toLocaleTimeString() },
          ...prev
        ]);
        clearInterval(intervalo);
      }
    }, 5000); // chequea cada 5 segundos
  }

  return () => clearInterval(intervalo);
}, [puertaAbierta, puertaTiempo]);

useEffect(() => {
  let intervalo = null;

  if (co2Alto && co2Tiempo) {
    intervalo = setInterval(() => {
      const ahora = Date.now();
      const diferencia = (ahora - co2Tiempo) / 1000;

      if (diferencia > 15) {
        setEventos(prev => [
          { zona: "Salón", tipo: "alerta: CO₂ elevado por mucho tiempo", hora: new Date().toLocaleTimeString() },
          ...prev
        ]);
        clearInterval(intervalo);
      }
    }, 5000);
  }

  return () => clearInterval(intervalo);
}, [co2Alto, co2Tiempo]);

useEffect(() => {
  const intervalo = setInterval(() => {
    const ahora = Date.now();
    const inactivo = (ahora - ultimoMovimiento) / 1000; // en segundos

    if (inactivo > 30) {
      setEventos(prev => [
        { zona: "General", tipo: "alerta: inactividad prolongada detectada", hora: new Date().toLocaleTimeString() },
        ...prev
      ]);
      setUltimoMovimiento(Date.now()); // reinicia para evitar alertas repetidas
    }
  }, 5000); // chequeo cada 5 segundos

  return () => clearInterval(intervalo);
}, [ultimoMovimiento]);

useEffect(() => {
  localStorage.setItem("eventos", JSON.stringify(eventos));
}, [eventos]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Plano interactivo - SilverTech Living</h1>
      <div className="relative w-[600px] h-[400px] mx-auto bg-cover bg-center rounded-lg shadow-lg" style={{ backgroundImage: "url('/plano.png')" }}>
  <button onClick={() => manejarEvento("Entrada", "movimiento")} className="absolute top-[70%] left-[18%] bg-blue-200 px-2 py-1 rounded-xl shadow text-sm">Entrada</button>
  <button onClick={() => manejarEvento("Salón", "movimiento")} className="absolute top-[20%] left-[45%] bg-blue-200 px-2 py-1 rounded-xl shadow text-sm">Salón</button>
  <button onClick={() => manejarEvento("Cocina", "movimiento")} className="absolute top-[20%] left-[75%] bg-blue-200 px-2 py-1 rounded-xl shadow text-sm">Cocina</button>
  <button onClick={() => manejarEvento("Baño", "movimiento")} className="absolute top-[20%] left-[58%] bg-blue-200 px-2 py-1 rounded-xl shadow text-sm">Baño</button>
  <button onClick={() => manejarEvento("Trastero", "movimiento")} className="absolute top-[65%] left-[48%] bg-blue-200 px-2 py-1 rounded-xl shadow text-sm">Trastero</button>
  <button onClick={() => manejarEvento("Dormitorio", "movimiento")} className="absolute top-[50%] left-[74%] bg-blue-200 px-2 py-1 rounded-xl shadow text-sm">Dormitorio</button>
</div>


      <div className="text-center mt-4">
  <button
    onClick={manejarPuerta}
    className={`px-6 py-2 rounded-lg font-semibold shadow ${
      puertaAbierta ? "bg-red-400 text-white" : "bg-green-400 text-white"
    }`}
  >
    {puertaAbierta ? "Cerrar puerta" : "Abrir puerta"}
  </button>
</div>

      <div className="text-center mt-4">
  <button
    onClick={manejarCalidadAire}
    className={`px-6 py-2 rounded-lg font-semibold shadow ${
      co2Alto ? "bg-orange-400 text-white" : "bg-blue-400 text-white"
    }`}
  >
    {co2Alto ? "Ventilar sala" : "Simular mala ventilación"}
  </button>
</div>


      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Eventos simulados</h2>
        <ul className="bg-white shadow rounded-lg p-4">
          {eventos.length === 0 && <li>No hay eventos aún.</li>}
          {eventos.map((evento, index) => (
            <li key={index} className="mb-2">
              🟢 {evento.tipo} en <strong>{evento.zona}</strong> a las {evento.hora}
            </li>
          ))}
        </ul>
      </div>
      <div className="text-center mt-6">
  <button
    onClick={limpiarEventos}
    className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded-lg shadow"
  >
    Limpiar historial
  </button>
</div>

<div className="text-center mt-4">
  <button
    onClick={exportarCSV}
    className="bg-blue-300 hover:bg-blue-400 text-black font-semibold px-4 py-2 rounded-lg shadow"
  >
    Exportar historial a CSV
  </button>
</div>


    </div>
    
  );
  
}

export default App;