import { Link } from "react-router-dom";
import {
  didomi,
} from "../FormasVerbales";
import React, { useState, useEffect } from "react";

function AdivinarScreen() {
  const [tiempo, setTiempo] = useState("");
  const opcionesTiempo = [
    "Presente",
    "Imperfecto",
    "Futuro",
    "Aoristo",
    "Perfecto",
    "Pluscuamperfecto",
  ];
  const [modo, setModo] = useState("");
  const opcionesModo = [
    "Indicativo",
    "Subjuntivo",
    "Imperativo",
    "Optativo",
    "Infinitivo",
    "Participio",
  ];
  const [persona, setPersona] = useState("");
  const opcionesPersona = ["1º Persona", "2º Persona", "3º Persona"];
  const [numero, setNumero] = useState("");
  const opcionesNumero = ["Singular", "Plural"];
  const [genero, setGenero] = useState("");
  const opcionesGenero = ["Masculino", "Femenino", "Neutro"];
  const [caso, setCaso] = useState("");
  const opcionesCaso = [
    "Nominativo",
    "Genitivo",
    "Dativo",
    "Acusativo",
    "Vocativo",
  ];
  const opcionesVoz = ["Activa", "Media", "Pasiva"];
  const [voz, setVoz] = useState("");

  const [seleccionado, setSeleccionado] = useState(true);
  const [comprobado, setComprobado] = useState(false);
  const [acierto, setAcierto] = useState(false);

  const [isVozActiva, setIsVozActiva] = useState(false);
  const [isVozPasiva, setIsVozPasiva] = useState(false);
  const [isVozMedia, setIsVozMedia] = useState(false);
  const [didomiSeleccionado, setDidomiSeleccionado] = useState(didomi);

  const [verboGenerado, setVerboGenerado] = useState({});
  const [formaCorrecta, setFormaCorrecta] = useState("");

  function randomElemento(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function generarVerboAleatorio(didomi) {
    setTiempo("");
    setModo("");
    setPersona("");
    setNumero("");
    setGenero("");
    setCaso("");
    setVoz("");

    setSeleccionado(true);
    setComprobado(false);
    setAcierto(false);

    let formasSeleccionadas = [];
    if (isVozActiva)
      formasSeleccionadas.push({ voz: "activa", data: didomi.activo });
    if (isVozPasiva)
      formasSeleccionadas.push({ voz: "pasiva", data: didomi.pasivo });
    if (isVozMedia)
      formasSeleccionadas.push({ voz: "media", data: didomi.media });

    if (formasSeleccionadas.length === 0) {
      formasSeleccionadas.push({ voz: "activa", data: didomi.activo });
    }

    const randomIndex = Math.floor(Math.random() * formasSeleccionadas.length);
    const { voz, data: vozSeleccionada } = formasSeleccionadas[randomIndex];

    const tiempoKeys = Object.keys(vozSeleccionada);
    const tiempo = randomElemento(tiempoKeys);
    const categoriaKeys = Object.keys(vozSeleccionada[tiempo]);
    const categoria = randomElemento(categoriaKeys);
    const forma = vozSeleccionada[tiempo][categoria];

    if (categoria === "infinitivo") {
      return { voz, tiempo, categoria, forma };
    }

    if (categoria === "participio") {
      const genero = randomElemento(Object.keys(forma));
      const caso = randomElemento(Object.keys(forma[genero]));
      const numero = randomElemento(["singular", "plural"]);
      return {
        voz,
        tiempo,
        categoria,
        genero,
        caso,
        numero,
        forma: forma[genero][caso][numero],
      };
    }

    let personasDisponibles = ["1", "2", "3"];
    if (categoria === "imperativo") {
      personasDisponibles = ["2", "3"];
    }
    const persona = randomElemento(personasDisponibles);
    const numero = randomElemento(["singular", "plural"]);

    const formaAleatoria = {
      voz,
      tiempo,
      categoria,
      persona,
      numero,
      forma: forma[persona][numero],
    };
    console.log("Verbo generado:", formaAleatoria);
    setVerboGenerado(formaAleatoria);
    setAcierto(false);
    setComprobado(false);
    setSeleccionado(true);
    return formaAleatoria;
  }

  // Función para comprobar la selección del usuario

  function comprobarSeleccion() {
    setComprobado(false);
    setAcierto(false);

    if (!verboGenerado) return;

    if (!tiempo || !modo || !voz) {
      console.log("Faltan selecciones");
      setSeleccionado(false);
      return;
    }

    if (modo === "Infinitivo" && (persona || numero || genero || caso)) {
      console.log("Sobran selecciones para el infinitivo");
      setSeleccionado(false);
      return;
    }

    if (modo === "Participio" && (!genero || !caso || !numero || persona)) {
      console.log("Faltan selecciones correctas para el participio");
      setSeleccionado(false);
      return;
    }

    if (modo !== "Participio" && modo !== "Infinitivo") {
      if (!persona || !numero) {
        console.log("Faltan selecciones de persona o número");
        setSeleccionado(false);
        return;
      }
      if (genero || caso) {
        console.log("Sobran selecciones de género o caso");
        setSeleccionado(false);
        return;
      }
    }

    setSeleccionado(true);
    try {
      let formaCorrecta;

      const tiempoKey = tiempo.toLowerCase(); // "Presente" → "presente"
      const modoKey = modo.toLowerCase(); // "Indicativo" → "indicativo"
      const numeroKey = numero.toLowerCase(); // "Singular"/"Plural" → "singular"/"plural"

      if (voz === "Activa") setDidomiSeleccionado(didomi.activo);
      else if (voz === "Pasiva") setDidomiSeleccionado(didomi.pasivo);
      else if (voz === "Media") setDidomiSeleccionado(didomi.media);

      // Modos especiales
      if (modoKey === "infinitivo") {
        formaCorrecta = didomiSeleccionado[tiempoKey][modoKey];
      } else if (modoKey === "participio") {
        const generoKey = genero.toLowerCase(); // "Masculino" → "masculino"
        const casoKey = caso.toLowerCase(); // "Nominativo" → "nominativo"
        formaCorrecta =
          didomiSeleccionado[tiempoKey][modoKey][generoKey][casoKey][numeroKey];
      } else {
        // Modos personales (indicativo, subjuntivo, optativo, imperativo)
        const personaIndex = persona.charAt(0); // "1º Persona" → "1"
        formaCorrecta =
          didomiSeleccionado[tiempoKey][modoKey][personaIndex][numeroKey];
      }

      console.log("Forma correspondiente al usuario:", formaCorrecta);
      setFormaCorrecta(formaCorrecta);
      if (verboGenerado.forma === formaCorrecta) {
        console.log("¡Correcto!");
        setAcierto(true);
      } else {
        console.log("Incorrecto.");
        setAcierto(false);
      }
      setComprobado(true);
    } catch (error) {
      console.error(
        "Error al comprobar la selección, verifica las opciones seleccionadas:"
      );
      setSeleccionado(false);
    }
  }

  useEffect(() => {
    const nuevoVerbo = generarVerboAleatorio(didomi);
    setVerboGenerado(nuevoVerbo); // 🛑 Problema aquí
  }, []);

  useEffect(() => {
  if (comprobado) {
    comprobarSeleccion();
  }
}, [seleccionado, didomiSeleccionado]);
  return (
    <div className="max-w-2xl md:max-w-3xl mx-auto p-6 from-indigo-100 via-white to-indigo-50 shadow-lg rounded-lg mt-12">
      <Link
        to="/"
        className="flex items-center text-indigo-600 hover:text-indigo-800 font-semibold mb-4"
      >
        ← Volver al menú
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600 md:text-4xl">
        ¿A qué corresponde la forma?
      </h1>
      <div className="text-4xl font-extrabold text-center mb-8 text-gray-900">
        {verboGenerado.forma}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-normal pb-5 px-20 md:px-0">
        <label className="flex flex-col md:text-lg">
          Voz
          <select
            name="voz"
            value={voz}
            onChange={(e) => setVoz(e.target.value)} // Actualiza el estado al cambiar
            className="border rounded px-3 py-2 text-gray-700 "
          >
            <option value="">Selecciona voz</option>
            {opcionesVoz.map((opcion, index) => (
              <option key={index} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col md:text-lg">
          Tiempo
          <select
            name="tiempo"
            value={tiempo}
            onChange={(e) => setTiempo(e.target.value)} // Actualiza el estado al cambiar
            className="border rounded px-3 py-2 text-gray-700"
          >
            <option value="">Selecciona tiempo</option>
            {opcionesTiempo.map((opcion, index) => (
              <option key={index} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col md:text-lg">
          Modo
          <select
            name="modo"
            value={modo}
            onChange={(e) => setModo(e.target.value)} // Actualiza el estado al cambiar
            className="border rounded px-3 py-2 text-gray-700"
          >
            <option value="">Selecciona modo</option>
            {opcionesModo.map((opcion, index) => (
              <option key={index} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col md:text-lg">
          Persona
          <select
            name="persona"
            value={persona}
            onChange={(e) => setPersona(e.target.value)} // Actualiza el estado al cambiar
            className="border rounded px-3 py-2 text-gray-700"
          >
            <option value="">Selecciona persona</option>
            {opcionesPersona.map((opcion, index) => (
              <option key={index} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col md:text-lg">
          Número
          <select
            name="numero"
            value={numero}
            onChange={(e) => setNumero(e.target.value)} // Actualiza el estado al cambiar
            className="border rounded px-3 py-2 text-gray-700"
          >
            <option value="">Selecciona numero</option>
            {opcionesNumero.map((opcion, index) => (
              <option key={index} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col md:text-lg">
          Género
          <select
            name="genero"
            value={genero}
            onChange={(e) => setGenero(e.target.value)} // Actualiza el estado al cambiar
            className="border rounded px-3 py-2 text-gray-700"
          >
            <option value="">Selecciona genero</option>
            {opcionesGenero.map((opcion, index) => (
              <option key={index} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col md:text-lg">
          Caso
          <select
            name="caso"
            value={caso}
            onChange={(e) => setCaso(e.target.value)} // Actualiza el estado al cambiar
            className="border rounded px-3 py-2 text-gray-700"
          >
            <option value="">Selecciona caso</option>
            {opcionesCaso.map((opcion, index) => (
              <option key={index} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Botón de enviar */}
      <button
        onClick={comprobarSeleccion}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded font-bold transition md:text-3xl"
      >
        Comprobar
      </button>
      <button
        onClick={() => setVerboGenerado(generarVerboAleatorio(didomi))}
        className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded font-semibold md:text-3xl"
      >
        Nueva pregunta
      </button>

      <section
        aria-label="Selecciona la voz verbal"
        className="flex flex-wrap sm:flex-row mt-5 gap-2 w-full"
      >
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

      {!seleccionado && (
        <div className="mt-6 p-4 rounded bg-red-100 text-red-800 text-xl font-bold md:text-3xl">
          <p>Por favor, selecciona correctamente las opciones.</p>
        </div>
      )}
      {comprobado && acierto && (
        <div className="mt-6 p-4 rounded bg-green-100 text-green-800 text-lg md:text-2xl">
          <p className="font-bold text-2xl mb-2">¡Eureka!</p>
          <p className="mb-2">
            Has identificado correctamente la forma:{" "}
            <span className="font-semibold">{verboGenerado.forma}</span>
          </p>

          {(() => {
            const info = [];
            if (verboGenerado.voz) info.push(`Voz: ${verboGenerado.voz}`);
            if (verboGenerado.tiempo)
              info.push(`Tiempo: ${verboGenerado.tiempo}`);
            if (verboGenerado.categoria)
              info.push(`Modo: ${verboGenerado.categoria}`);

            if (verboGenerado.categoria === "infinitivo") {
              return <p>{info.join(" · ")}</p>;
            }

            if (verboGenerado.categoria === "participio") {
              if (verboGenerado.genero)
                info.push(`Género: ${verboGenerado.genero}`);
              if (verboGenerado.caso) info.push(`Caso: ${verboGenerado.caso}`);
              if (verboGenerado.numero)
                info.push(`Número: ${verboGenerado.numero}`);
              return <p>{info.join(" · ")}</p>;
            }

            if (verboGenerado.persona)
              info.push(`Persona: ${verboGenerado.persona}ª`);
            if (verboGenerado.numero)
              info.push(`Número: ${verboGenerado.numero}`);
            return <p>{info.join(" · ")}</p>;
          })()}
        </div>
      )}

      {comprobado && !acierto && (
        <div className="mt-6 p-4 rounded bg-red-100 text-red-800 text-lg md:text-2xl">
          <p className="font-bold text-2xl mb-2">Incorrecto.</p>
          <p className="mb-2">
            Tu selección corresponde a la forma:{" "}
            <span className="font-semibold">{formaCorrecta}</span>
          </p>
          <p className="font-bold mt-4">La forma correcta era:</p>

          {(() => {
            const info = [];
            if (verboGenerado.voz) info.push(`Voz: ${verboGenerado.voz}`);
            if (verboGenerado.tiempo)
              info.push(`Tiempo: ${verboGenerado.tiempo}`);
            if (verboGenerado.categoria)
              info.push(`Modo: ${verboGenerado.categoria}`);

            if (verboGenerado.categoria === "infinitivo") {
              // Solo tiempo y modo
              return <p>{info.join(" · ")}</p>;
            }

            if (verboGenerado.categoria === "participio") {
              // Participio: tiene género, caso y número
              if (verboGenerado.genero)
                info.push(`Género: ${verboGenerado.genero}`);
              if (verboGenerado.caso) info.push(`Caso: ${verboGenerado.caso}`);
              if (verboGenerado.numero)
                info.push(`Número: ${verboGenerado.numero}`);
              return <p>{info.join(" · ")}</p>;
            }

            // Modos personales: indicativo, subjuntivo, optativo, imperativo
            if (verboGenerado.persona)
              info.push(`Persona: ${verboGenerado.persona}ª`);
            if (verboGenerado.numero)
              info.push(`Número: ${verboGenerado.numero}`);
            return <p>{info.join(" · ")}</p>;
          })()}
        </div>
      )}
    </div>
  );
}

export default AdivinarScreen;
