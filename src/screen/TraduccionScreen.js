import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { vozActiva } from "../traducciones";
import { vozPasiva } from "../traducciones";
import { vozMedia } from "../traducciones";

function TraduccionScreen() {
  const [verboGenerado, setVerboGenerado] = useState({
    forma: "",
    traduccion: "",
  });
  const [opcionesMezcladas, setOpcionesMezcladas] = useState([]);
  const [acierto, setAcierto] = useState(false);
  const [seleccionado, setSeleccionado] = useState(false);

  const [isVozActiva, setIsVozActiva] = useState(false);
  const [isVozPasiva, setIsVozPasiva] = useState(false);
  const [isVozMedia, setIsVozMedia] = useState(false);

  useEffect(() => {
    generarVerboAleatorio();
  }, []);

  function generarVerboAleatorio() {
  setSeleccionado(false);
  setAcierto(false);

  let formasSeleccionadas = [];
  if (isVozActiva) formasSeleccionadas.push(...Object.entries(vozActiva));
  if (isVozPasiva) formasSeleccionadas.push(...Object.entries(vozPasiva));
  if (isVozMedia) formasSeleccionadas.push(...Object.entries(vozMedia));

  if (formasSeleccionadas.length === 0) {
    formasSeleccionadas = Object.entries(vozActiva);
  }

  const randomIndex = Math.floor(Math.random() * formasSeleccionadas.length);
  const [forma, traduccion] = formasSeleccionadas[randomIndex];

  const indicesUsados = new Set([randomIndex]);
  while (indicesUsados.size < 3) {
    indicesUsados.add(Math.floor(Math.random() * formasSeleccionadas.length));
  }

  const mezcladas = Array.from(indicesUsados)
    .map((i) => formasSeleccionadas[i])
    .sort(() => Math.random() - 0.5);

  setVerboGenerado({ forma, traduccion });
  setOpcionesMezcladas(mezcladas);

}

  function comprobarSeleccion(opcionSeleccionada) {
    setSeleccionado(true);
    setAcierto(opcionSeleccionada === verboGenerado.traduccion);
  }

  return (
    <div className="max-w-2xl md:max-w-3xl mx-auto p-6 shadow-lg rounded-lg mt-12">
  {/* Navegación */}
  <Link
    to="/"
    className="flex items-center text-indigo-600 hover:text-indigo-800 font-semibold mb-4"
    aria-label="Volver al menú principal de Griego USC"
  >
    ← Volver al menú
  </Link>

  {/* H1 principal */}
  <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600 md:text-4xl">
    ¿Cuál es la traducción correcta del verbo griego
  </h1>

  {/* H2: Verbo a traducir */}
  <section className="text-4xl font-extrabold text-center mb-8 text-gray-900">
    {verboGenerado.forma}
  </section>

  {/* Opciones de traducción */}
  {opcionesMezcladas.length > 0 && (
    <section aria-label="Opciones de traducción del verbo" className="flex flex-col md:flex-row justify-center items-stretch gap-6 min-h-[150px]">
      {opcionesMezcladas.map(([forma, traduccion], index) => (
        <div
          key={index}
          onClick={() => comprobarSeleccion(traduccion)}
          role="button"
          tabIndex={0}
          aria-label={`Opción de traducción: ${traduccion}`}
          className={`flex-1 text-center py-3 rounded-lg text-2xl font-bold transition transform hover:scale-105 shadow-md flex flex-col justify-center cursor-pointer ${
            seleccionado ? "pointer-events-none opacity-95" : "hover:opacity-90"
          }
          ${
            index === 0
              ? "bg-red-500 hover:bg-red-600"
              : index === 1
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          <p className="text-white px-3">{traduccion}</p>
          <p
            className={`text-orange-200 text-sm ${
              seleccionado ? "visible" : "invisible"
            }`}
          >
            {forma}
          </p>
        </div>
      ))}
    </section>
  )}

  {/* Voz activa/pasiva/media */}
  <section aria-label="Selecciona la voz verbal" className="flex flex-wrap sm:flex-row mt-5 gap-2 w-full">
    <div
      className={`flex flex-row rounded-full cursor-pointer w-fit px-3 py-1 items-center gap-1 justify-center
        transition-all duration-300 ease-in-out transform
        hover:scale-105 text-sm sm:text-base
        ${isVozActiva ? "bg-orange-400" : "bg-orange-200 hover:bg-orange-300"}`}
      onClick={() => setIsVozActiva(!isVozActiva)}
      aria-pressed={isVozActiva}
    >
      <p>Voz Activa</p>
    </div>

    <div
      className={`flex flex-row rounded-full cursor-pointer w-fit px-3 py-1 items-center gap-1 justify-center
        transition-all duration-300 ease-in-out transform
        hover:scale-105 text-sm sm:text-base
        ${isVozPasiva ? "bg-orange-400" : "bg-orange-200 hover:bg-orange-300"}`}
      onClick={() => setIsVozPasiva(!isVozPasiva)}
      aria-pressed={isVozPasiva}
    >
      <p>Voz Pasiva</p>
    </div>

    <div
      className={`flex flex-row rounded-full cursor-pointer w-fit px-3 py-1 items-center gap-1 justify-center
        transition-all duration-300 ease-in-out transform
        hover:scale-105 text-sm sm:text-base
        ${isVozMedia ? "bg-orange-400" : "bg-orange-200 hover:bg-orange-300"}`}
      onClick={() => setIsVozMedia(!isVozMedia)}
      aria-pressed={isVozMedia}
    >
      <p>Voz Media</p>
    </div>
  </section>

  {/* Botón nueva pregunta */}
  <button
    onClick={() => generarVerboAleatorio()}
    className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 -lg font-semibold md:text-3xl rounded-lg"
    aria-label="Generar nueva pregunta de traducción"
  >
    Nueva pregunta
  </button>

  {/* Resultado */}
  {seleccionado && !acierto && (
    <section
      className="mt-3 p-2 rounded-lg bg-red-100 text-red-800 text-lg md:text-2xl w-full"
      aria-live="polite"
    >
      <h2 className="font-bold text-2xl mb-2">Incorrecto</h2>
      <p className="mt-4">
        La traducción correcta era:{" "}
        <span className="font-semibold">{verboGenerado.traduccion}</span>
      </p>
    </section>
  )}

  {seleccionado && acierto && (
    <section
      className="mt-6 p-4 rounded-lg bg-green-100 text-green-800 text-lg md:text-2xl"
      aria-live="polite"
    >
      <h2 className="font-bold text-2xl mb-2">¡Eureka!</h2>
      <p className="mt-4">
        La traducción correcta es:{" "}
        <span className="font-semibold">{verboGenerado.traduccion}</span>
      </p>
    </section>
  )}
</div>

  );
}

export default TraduccionScreen;
