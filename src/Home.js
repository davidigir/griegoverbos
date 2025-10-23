import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Home() {
  const [modo, setModo] = useState("adivinar"); // "adivinar" o "traducciones"

  useEffect(() => {
    document.title = "Griego USC | Práctica de Verbos Griegos";
    const metaDescription = document.querySelector(
      'meta[name="description"]'
    );
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Practica los verbos griegos antiguos: adivina formas verbales y aprende traducciones de verbos como Δίδωμι, λύω y γράφω."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "Practica los verbos griegos antiguos: adivina formas verbales y aprende traducciones de verbos como Δίδωμι, λύω y γράφω.";
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 p-6">
      <div className="max-w-2xl md:max-w-3xl bg-white shadow-xl rounded-2xl p-10 text-center">

        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-600 mb-6">
          Práctica de Verbos Griegos
        </h1>

        <p className="text-gray-700 mb-8 md:text-xl">
          Elige el modo de práctica y el verbo con el que quieres trabajar. Mejora
          tu comprensión de los <strong>verbos griegos antiguos</strong> y sus
          <strong> tiempos verbales</strong>.
        </p>

        {/* Selector de modo */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-lg overflow-hidden shadow-md border border-gray-300">
            <button
              onClick={() => setModo("adivinar")}
              className={`px-6 py-3 text-lg font-semibold transition-all ${
                modo === "adivinar"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              aria-label="Modo Adivinar forma verbal"
            >
              Adivinar forma verbal
            </button>

            <button
              onClick={() => setModo("traducciones")}
              className={`px-6 py-3 text-lg font-semibold transition-all ${
                modo === "traducciones"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              aria-label="Modo Traducciones"
            >
              Traducciones
            </button>
          </div>
        </div>

        {/* Selección de verbo */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Elige un verbo para practicar
        </h2>
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6 justify-center">
          <Link
            to={`/${modo}/luo`}
            className="w-full md:w-40 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg text-2xl font-bold transition transform hover:scale-105 shadow-md pointer-events-none opacity-75"
            aria-label="Verbo λύω"
          >
            λύω
          </Link>

          <Link
            to={`/${modo}/didomi`}
            className="w-full md:w-40 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg text-2xl font-bold transition transform hover:scale-105 shadow-md"
            aria-label="Verbo δίδωμι"
          >
            δίδωμι
          </Link>

          <Link
            to={`/${modo}/grapho`}
            className="w-full md:w-40 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-2xl font-bold transition transform hover:scale-105 shadow-md pointer-events-none opacity-75"
            aria-label="Verbo γράφω"
          >
            γράφω
          </Link>
        </div>

        {/* Información de contacto */}
        <p className="mt-10 text-gray-500 md:text-lg">
          Si detectas algún error, contacta a{" "}
          <a
            href="mailto:vichi.davi@gmail.com"
            className="underline text-indigo-600"
          >
            vichi.davi@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default Home;
