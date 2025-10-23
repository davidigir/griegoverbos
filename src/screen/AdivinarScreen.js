import { Link } from 'react-router-dom';
import { didomi } from '../FormasVerbales';
import React, { useState, useEffect } from 'react';


function AdivinarScreen() {

        const [tiempo, setTiempo] = useState("");
    const opcionesTiempo = ["Presente", "Imperfecto", "Futuro", "Aoristo", "Perfecto", "Pluscuamperfecto"];
    const [modo, setModo] = useState("");
    const opcionesModo = ["Indicativo", "Subjuntivo", "Imperativo", "Optativo", "Infinitivo", "Participio"];
    const [persona, setPersona] = useState("");
    const opcionesPersona = ["1º Persona", "2º Persona", "3º Persona"];
    const [numero, setNumero] = useState("");
    const opcionesNumero = ["Singular", "Plural"];
    const [genero, setGenero] = useState("");
    const opcionesGenero = ["Masculino", "Femenino", "Neutro"];
    const [caso, setCaso] = useState("");
    const opcionesCaso = ["Nominativo", "Genitivo", "Dativo", "Acusativo", "Vocativo"];

    const [seleccionado, setSeleccionado] = useState(true);
    const [comprobado, setComprobado] = useState(false);
    const [acierto, setAcierto] = useState(false);
    

    const[verboGenerado, setVerboGenerado]= useState({ });
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
    setSeleccionado(true);
    setComprobado(false);
    setAcierto(false);
    const tiempoKeys = Object.keys(didomi.activo);
    const tiempo = randomElemento(tiempoKeys);
    const categoriaKeys = Object.keys(didomi.activo[tiempo]);
    const categoria = randomElemento(categoriaKeys);

    const forma = didomi.activo[tiempo][categoria];

    if (categoria === "infinitivo") {
        return { tiempo, categoria, forma };
    }

    if (categoria === "participio") {
        const genero = randomElemento(Object.keys(forma));
        const caso = randomElemento(Object.keys(forma[genero]));
        const numero = randomElemento(["singular", "plural"]);
        return {
            tiempo,
            categoria,
            genero,
            caso,
            numero,
            forma: forma[genero][caso][numero]
        };
    }

    // Para tiempos personales
    let personasDisponibles = ["1", "2", "3"];
    if (categoria === "imperativo") {
        personasDisponibles = ["2", "3"]; // no existe 1ª persona
    }
    const persona = randomElemento(personasDisponibles);
    const numero = randomElemento(["singular", "plural"]);

    let formaAleatoria= {
        tiempo,
        categoria,
        persona,
        numero,
        forma: forma[persona][numero]
    };
    setVerboGenerado(formaAleatoria);
    setAcierto(false);
    setComprobado(false);
    setSeleccionado(true);
    return formaAleatoria;
}

function comprobarSeleccion() {
    setComprobado(false);
    setAcierto(false);

    if (!verboGenerado) return;

if (!tiempo || !modo) {
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
try
{
    let formaCorrecta;


    const tiempoKey = tiempo.toLowerCase(); // "Presente" → "presente"
    const modoKey = modo.toLowerCase();     // "Indicativo" → "indicativo"
    const numeroKey = numero.toLowerCase(); // "Singular"/"Plural" → "singular"/"plural"



    // Modos especiales
    if (modoKey === "infinitivo") {
        formaCorrecta = didomi.activo[tiempoKey][modoKey];
    } else if (modoKey === "participio") {
        const generoKey = genero.toLowerCase(); // "Masculino" → "masculino"
        const casoKey = caso.toLowerCase();     // "Nominativo" → "nominativo"
        formaCorrecta = didomi.activo[tiempoKey][modoKey][generoKey][casoKey][numeroKey];
    } else {
        // Modos personales (indicativo, subjuntivo, optativo, imperativo)
        const personaIndex = persona.charAt(0); // "1º Persona" → "1"
        formaCorrecta = didomi.activo[tiempoKey][modoKey][personaIndex][numeroKey];
    }

    console.log("Forma correspondiente al usuario:", formaCorrecta);
    setFormaCorrecta(formaCorrecta);
    if (verboGenerado.forma === formaCorrecta) {
        console.log("¡Correcto!");
        setAcierto(true);
    }else {
        console.log("Incorrecto.");
        setAcierto(false);
    }
    setComprobado(true);    
}

catch (error) {
    console.error("Error al comprobar la selección, verifica las opciones seleccionadas:");
    setSeleccionado(false);
}
}

    useEffect(() => {
        const nuevoVerbo = generarVerboAleatorio(didomi);
    setVerboGenerado(nuevoVerbo); // 🛑 Problema aquí

    }, []);




    return (


        <div className="max-w-2xl md:max-w-3xl mx-auto p-6 from-indigo-100 via-white to-indigo-50 shadow-lg rounded-lg mt-12">

    <Link to="/" className="flex items-center text-indigo-600 hover:text-indigo-800 font-semibold mb-4">← Volver al menú</Link>


            <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600 md:text-4xl">¿A qué corresponde la forma?</h1>
            <div className="text-4xl font-extrabold text-center mb-8 text-gray-900">{verboGenerado.forma}</div>
            <div className="flex flex-col space-y-4 mb-6 md:flex-row md:space-y-0 md:space-x-4">

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


            </div>

            <div className="flex flex-col space-y-4 mb-6 md:flex-row md:space-y-0 md:space-x-4">
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
            {!seleccionado && (
            <div className="mt-6 p-4 rounded bg-red-100 text-red-800 text-xl font-bold md:text-3xl">
              <p>Por favor, selecciona correctamente las opciones.</p>
            </div>
          )}
            {comprobado && acierto && (
  <div className="mt-6 p-4 rounded bg-green-100 text-green-800 text-lg md:text-2xl">
        <p className="font-bold text-2xl mb-2">¡Eureka!</p>
    <p className="mb-2">Has identificado correctamente la forma: <span className="font-semibold">{verboGenerado.forma}</span></p>

    {(() => {
      const info = [];
      if (verboGenerado.tiempo) info.push(`Tiempo: ${verboGenerado.tiempo}`);
      if (verboGenerado.categoria) info.push(`Modo: ${verboGenerado.categoria}`);

      if (verboGenerado.categoria === "infinitivo") {
        return <p>{info.join(" · ")}</p>;
      }

      if (verboGenerado.categoria === "participio") {
        if (verboGenerado.genero) info.push(`Género: ${verboGenerado.genero}`);
        if (verboGenerado.caso) info.push(`Caso: ${verboGenerado.caso}`);
        if (verboGenerado.numero) info.push(`Número: ${verboGenerado.numero}`);
        return <p>{info.join(" · ")}</p>;
      }

      if (verboGenerado.persona) info.push(`Persona: ${verboGenerado.persona}ª`);
      if (verboGenerado.numero) info.push(`Número: ${verboGenerado.numero}`);
      return <p>{info.join(" · ")}</p>;
    })()}
  </div>
)}

{comprobado && !acierto && (
  <div className="mt-6 p-4 rounded bg-red-100 text-red-800 text-lg md:text-2xl">
    <p className="font-bold text-2xl mb-2">Incorrecto.</p>
    <p className="mb-2">Tu selección corresponde a la forma: <span className="font-semibold">{formaCorrecta}</span></p>
    <p className="font-bold mt-4">La forma correcta era:</p>

    {(() => {
      const info = [];
      if (verboGenerado.tiempo) info.push(`Tiempo: ${verboGenerado.tiempo}`);
      if (verboGenerado.categoria) info.push(`Modo: ${verboGenerado.categoria}`);

      if (verboGenerado.categoria === "infinitivo") {
        // Solo tiempo y modo
        return <p>{info.join(" · ")}</p>;
      }

      if (verboGenerado.categoria === "participio") {
        // Participio: tiene género, caso y número
        if (verboGenerado.genero) info.push(`Género: ${verboGenerado.genero}`);
        if (verboGenerado.caso) info.push(`Caso: ${verboGenerado.caso}`);
        if (verboGenerado.numero) info.push(`Número: ${verboGenerado.numero}`);
        return <p>{info.join(" · ")}</p>;
      }

      // Modos personales: indicativo, subjuntivo, optativo, imperativo
      if (verboGenerado.persona) info.push(`Persona: ${verboGenerado.persona}ª`);
      if (verboGenerado.numero) info.push(`Número: ${verboGenerado.numero}`);
      return <p>{info.join(" · ")}</p>;
    })()}
  </div>
)}

        </div>
    )


}

export default AdivinarScreen;