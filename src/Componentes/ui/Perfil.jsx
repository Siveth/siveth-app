import React, { useEffect, useState } from "react";
import Axios from "axios";

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    Nombre: "",
    ApellidoP: "",
    ApellidoM: "",
    Usuario: "",
    Telefono: "",
    Correo: "",
    Password: "",
    DescripcionPregunta: "",
    Respuesta: "",
    Foto: "",
  });
  const [errors, setErrors] = useState({});
  const [preguntas, setPreguntas] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [readyToCapture, setReadyToCapture] = useState(false); // Estado para controlar cuando el botón de captura aparece
  const [isPhotoUpdated, setIsPhotoUpdated] = useState(false);

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }
        const response = await Axios.get(
          "https://back-end-siveth-g8vc.vercel.app/api/getUserByEmail",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsuario(response.data);
        setFormData(response.data);
        console.log("Datos del usuario:", response.data);
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    const obtenerPreguntas = async () => {
      try {
        const response = await Axios.get(
          "https://back-end-siveth-g8vc.vercel.app/api/preguntas"
        );
        setPreguntas(response.data);
        console.log("Preguntas:", response.data);
      } catch (error) {
        console.error("Error al obtener las preguntas:", error);
      }
    };

    obtenerUsuario();
    obtenerPreguntas();
  }, []);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let error = "";

    if (name === "Nombre" || name === "ApellidoP" || name === "ApellidoM") {
      if (/^[a-zA-Z0-9_.+-]*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      } else {
        error =
          "El campo solo puede contener letras, números y los caracteres especiales: _ . + -";
      }
    } else if (name === "Correo") {
      if (/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      } else {
        error = "Formato de correo electrónico inválido";
      }
    } else if (name === "Telefono") {
      if (/^\d{8,14}$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      } else {
        error = "Formato de número de teléfono inválido";
      }
    } else if (name === "Password") {
      // Expresión regular para validar contraseña
      if (
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value
        )
      ) {
        setFormData({ ...formData, [name]: value });
      } else {
        error =
          "La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra minúscula, una letra mayúscula, un número y un carácter especial.";
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    setErrors({ ...errors, [name]: error });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validar si el correo del usuario está disponible
    if (!usuario || !usuario.Correo) {
      console.error("El correo del usuario no está disponible");
      return;
    }
  
    // Verificar si los campos obligatorios están completos
    const requiredFields = [
      "Nombre", "ApellidoP", "ApellidoM", "Usuario", "Telefono", "Correo", "Password", "DescripcionPregunta", "Respuesta"
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);
  
    if (missingFields.length > 0) {
      alert(`Por favor, completa los campos: ${missingFields.join(", ")}`);
      return;
    }
  
    // Crear un nuevo FormData para enviar los datos del formulario
    const dataToSend = new FormData();
  
    // Agregar los datos del formulario al FormData
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        dataToSend.append(key, formData[key]);
      }
    });
  
    // Si la foto se actualiza, agregarla al FormData
    if (isPhotoUpdated && photo) {
      try {
        const photoBlob = await fetch(photo).then(res => res.blob());
        dataToSend.append("image", photoBlob, "photo.png");
      } catch (error) {
        console.error("Error al procesar la foto:", error);
        return;
      }
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No se encontró el token de autenticación");
        return;
      }
  
      const response = await Axios.put(
        `https://back-end-siveth-g8vc.vercel.app/api/updateUser/${usuario.Correo}`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      setUsuario(response.data);
      setEditMode(false);
      setIsPhotoUpdated(false); // Resetear la actualización de la foto
      alert("Foto de perfil actualizada correctamente"); // Mensaje de éxito
    } catch (error) {
      console.error("Error al actualizar los datos del usuario:", error);
    }
  };
  
  
  
  
      
  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
      setIsPhotoUpdated(true); // Foto subida correctamente
      setShowPhotoModal(false);
    }
  };

  const handleCapture = async () => {
    if (!capturing) {
      setCapturing(true);
      setReadyToCapture(true); // Activamos el botón de capturar ahora
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setVideoStream(stream);
        const video = document.createElement("video");
        video.srcObject = stream;
        video.play();

        // Mostrar el video en el modal
        const videoContainer = document.getElementById("video-container");
        videoContainer.appendChild(video);
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);
        alert("No se pudo acceder a la cámara. Verifica los permisos.");
      }
    } else {
      setCapturing(false);
      setReadyToCapture(false); // Desactivamos el botón de capturar ahora
      setVideoStream(null);
      setPhoto(null);

      // Detener la transmisión de video al desactivar la captura
      if (videoStream) {
        const tracks = videoStream.getTracks();
        tracks.forEach((track) => track.stop()); // Detenemos todos los tracks de la cámara
      }

      // Opcional: Ocultar el video al detener la captura
      const videoContainer = document.getElementById("video-container");
      if (videoContainer) {
        videoContainer.innerHTML = ""; // Limpiar el contenedor de video
      }
    }
  };

  const handleCaptureImage = () => {
    if (capturing) {
      const video = document.querySelector("video");
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      const photoURL = canvas.toDataURL("image/png");
      setPhoto(photoURL);
      setIsPhotoUpdated(true); // Foto capturada correctamente
      setFormData({ ...formData, Foto: photoURL }); // Guardar la foto en el estado del formulario
      setShowPhotoModal(false);

      // Detener la transmisión de video después de capturar la imagen
      setCapturing(false);
      setReadyToCapture(false);
      setVideoStream(null);

      // Detener los "tracks" de video (desactivar la cámara y apagar la luz del sensor)
      if (videoStream) {
        const tracks = videoStream.getTracks();
        tracks.forEach((track) => track.stop()); // Detenemos todos los tracks de la cámara
      }

      // Limpiar el contenedor de video
      const videoContainer = document.getElementById("video-container");
      if (videoContainer) {
        videoContainer.innerHTML = ""; // Limpiar el contenedor de video
      }
    }
  };

  const handleCancelPhotoUpdate = () => {
    setPhoto(null);
    setIsPhotoUpdated(false);
    setShowPhotoModal(false);
    setCapturing(false);
    setReadyToCapture(false);
    setVideoStream(null);
  };
  const stopCamera = () => {
    if (videoStream) {
      const tracks = videoStream.getTracks();
      tracks.forEach((track) => track.stop()); // Detenemos todos los tracks de la cámara
    }

    // Limpiar el contenedor de video
    const videoContainer = document.getElementById("video-container");
    if (videoContainer) {
      videoContainer.innerHTML = ""; // Limpiar el contenedor de video
    }

    // Opcional: Resetear estados relacionados con la captura de imagen
    setCapturing(false);
    setReadyToCapture(false);
  };

  const handleUpdatePhoto = async () => {
    // Aquí puedes agregar la lógica para subir la nueva foto al servidor o almacenarla
    setIsPhotoUpdated(false); // Resetear el estado

    // Detener la cámara y limpiar el estado después de la actualización
    if (videoStream) {
      const tracks = videoStream.getTracks();
      tracks.forEach((track) => track.stop()); // Detenemos todos los tracks de la cámara
    }

    setCapturing(false);
    setReadyToCapture(false);
    setVideoStream(null);

    // Limpiar el contenedor de video
    const videoContainer = document.getElementById("video-container");
    if (videoContainer) {
      videoContainer.innerHTML = ""; // Limpiar el contenedor de video
    }

    alert("Foto de perfil actualizada correctamente");
  };

  return (
    <div>
      <div className="w-full text-white bg-main-color">
        <div className="container mx-auto my-5 p-5">
          <div className="md:flex no-wrap md:-mx-2 ">
            <div className="w-full md:w-3/12 md:mx-2">
              <div className="bg-white p-3 border-t-4 border-blue-400">
                <div className="image overflow-hidden">
                </div>
                <div className="md:w-full text-center mb-8 md:mb-0">
                  <img
                  
               
                  src={photo || `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${formData.Foto}`}
                
                    alt="Profile Picture"
                    className="rounded-full w-32 h-32 mx-auto"
                  />
                  <div className="flex justify-center mt-4">
                    {isPhotoUpdated ? (
                      <>
                        <button
                          onClick={handleSubmit}
                          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                        >
                          Actualizar
                        </button>
                        <button
                          onClick={handleCancelPhotoUpdate}
                          className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setShowPhotoModal(true)}
                        className="bg-indigo-500 text-white px-4 py-2 rounded"
                      >
                        Editar foto
                      </button>
                    )}
                  </div>
                </div>
                {showPhotoModal && (
                  <div>
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50"></div>
                    <div className="fixed inset-0 flex justify-center items-center z-50">
                      <div className="bg-white p-5 rounded shadow-lg w-96 relative">
                        {/* Botón de cerrar en la esquina superior izquierda */}
                        <button
                          onClick={() => {
                            setShowPhotoModal(false);
                            stopCamera(); // Llamar a stopCamera cuando se cierre el modal
                          }}
                          className="absolute top-2 left-2 text-gray-700 text-xl font-bold"
                        >
                          ×
                        </button>

                        <h3 className="text-lg">Selecciona una opción</h3>
                        <div className="mt-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="bg-blue-500 text-white py-2 px-4 rounded"
                          />
                          <button
                            onClick={handleCapture}
                            className="bg-red-500 text-white py-2 px-4 rounded"
                          >
                            {capturing
                              ? "Detener captura"
                              : "Capturar imagen con la cámara"}
                          </button>
                          {readyToCapture && (
                            <button
                              onClick={handleCaptureImage}
                              className="mt-2 bg-green-500 text-white py-2 px-4 rounded"
                            >
                              Capturar ahora
                            </button>
                          )}
                          <div id="video-container" className="mt-4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full md:w-9/12 mx-2 md:h-64">
              <div className="bg-white p-3 shadow-sm rounded-sm">
                <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                  <span className="text-blue-500">
                    <svg
                      className="h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                  <span className="tracking-wide">Informacion Personal</span>
                </div>
                <div className="text-gray-700">
                  <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 text-sm">
                      {usuario ? (
                        <>
                          <div className="grid grid-cols-2">
                            <div className="px-4 py-2 font-semibold">
                              Nombre
                            </div>
                            {editMode ? (
                              <div className="flex flex-col items-center">
                                <input
                                  type="text"
                                  name="Nombre"
                                  value={formData.Nombre}
                                  onChange={handleChange}
                                  className={`w-full rounded border ${errors.Nombre
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    } bg-inherit p-3 shadow shadow-gray-100 mt-2 appearance-none outline-none text-neutral-800`}
                                />
                                {errors.Nombre && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {errors.Nombre}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="px-4 py-2">{usuario.Nombre}</div>
                            )}
                          </div>
                          <div className="grid grid-cols-2">
                            <div className="px-4 py-2 font-semibold">
                              Apellido Paterno
                            </div>
                            {editMode ? (
                              <div className="flex flex-col items-center">
                                <input
                                  type="text"
                                  name="ApellidoP"
                                  value={formData.ApellidoP}
                                  onChange={handleChange}
                                  className={`w-full rounded border ${errors.ApellidoP
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    } bg-inherit p-3 shadow shadow-gray-100 mt-2 appearance-none outline-none text-neutral-800 max-w-xs`}
                                />
                                {errors.ApellidoP && (
                                  <p className="text-red-500 text-xs mt-1 max-w-xs">
                                    {errors.ApellidoP}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="px-4 py-2">
                                {usuario.ApellidoP}
                              </div>
                            )}
                          </div>
                          <div className="grid grid-cols-2">
                            <div className="px-4 py-2 font-semibold">
                              Apellido Materno
                            </div>
                            {editMode ? (
                              <div className="flex flex-col items-center">
                                <input
                                  type="text"
                                  name="ApellidoM"
                                  value={formData.ApellidoM}
                                  onChange={handleChange}
                                  className={`w-full rounded border ${errors.ApellidoM
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    } bg-inherit p-3 shadow shadow-gray-100 mt-2 appearance-none outline-none text-neutral-800 max-w-xs`}
                                />
                                {errors.ApellidoM && (
                                  <p className="text-red-500 text-xs mt-1 max-w-xs">
                                    {errors.ApellidoM}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="px-4 py-2">
                                {usuario.ApellidoM}
                              </div>
                            )}
                          </div>
                          <div className="grid grid-cols-2">
                            <div className="px-4 py-2 font-semibold">
                              Nombre de usuario
                            </div>
                            {editMode ? (
                              <div className="flex flex-col items-center">
                                <input
                                  type="text"
                                  name="Usuario"
                                  value={formData.Usuario}
                                  onChange={handleChange}
                                  className={`w-full rounded border ${errors.Usuario
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    } bg-inherit p-3 shadow shadow-gray-100 mt-2 appearance-none outline-none text-neutral-800 max-w-xs`}
                                />
                                {errors.Usuario && (
                                  <p className="text-red-500 text-xs mt-1 max-w-xs">
                                    {errors.Usuario}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="px-4 py-2">{usuario.Usuario}</div>
                            )}
                          </div>
                          <div className="grid grid-cols-2">
                            <div className="px-4 py-2 font-semibold">
                              Telefono
                            </div>
                            {editMode ? (
                              <div className="flex flex-col items-center">
                                <input
                                  type="text"
                                  name="Telefono"
                                  value={formData.Telefono}
                                  onChange={handleChange}
                                  className={`w-full rounded border ${errors.Telefono
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    } bg-inherit p-3 shadow shadow-gray-100 mt-2 appearance-none outline-none text-neutral-800 max-w-xs`}
                                />
                                {errors.Telefono && (
                                  <p className="text-red-500 text-xs mt-1 max-w-xs">
                                    {errors.Telefono}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="px-4 py-2">
                                {usuario.Telefono}
                              </div>
                            )}
                          </div>
                          <div className="grid grid-cols-2">
                            <div className="px-4 py-2 font-semibold">Email</div>
                            {editMode ? (
                              <div className="flex flex-col items-center">
                                <input
                                  type="text"
                                  name="Correo"
                                  value={formData.Correo}
                                  onChange={handleChange}
                                  className={`w-full rounded border ${errors.Correo
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    } bg-inherit p-3 shadow shadow-gray-100 mt-2 appearance-none outline-none text-neutral-800 max-w-xs`}
                                />
                                {errors.Correo && (
                                  <p className="text-red-500 text-xs mt-1 max-w-xs">
                                    {errors.Correo}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="px-4 py-2">{usuario.Correo}</div>
                            )}
                          </div>
                          <div className="grid grid-cols-2">
                            <div className="px-4 py-2 font-semibold">
                              Contraseña
                            </div>
                            {editMode ? (
                              <div className="flex flex-col items-center">
                                <input
                                  type="password"
                                  name="Password"
                                  value={formData.Password}
                                  onChange={handleChange}
                                  className={`w-full rounded border ${errors.Password
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    } bg-inherit p-3 shadow shadow-gray-100 mt-2 appearance-none outline-none text-neutral-800 max-w-xs`}
                                />
                                {errors.Password && (
                                  <p className="text-red-500 text-xs mt-1 max-w-xs">
                                    {errors.Password}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="px-4 py-2">********</div>
                            )}
                          </div>

                          <div className="grid grid-cols-2">
                            <div className="px-4 py-2 font-semibold">
                              Pregunta de seguridad
                            </div>
                            {editMode ? (
                              <div className="flex flex-col items-center">
                                <select
                                  name="DescripcionPregunta"
                                  value={formData.DescripcionPregunta}
                                  onChange={handleChange}
                                  className={`w-full rounded border ${errors.DescripcionPregunta
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    } bg-inherit p-3 shadow shadow-gray-100 mt-2 appearance-none outline-none text-neutral-800 max-w-xs`}
                                >
                                  <option value="">
                                    Selecciona una pregunta
                                  </option>
                                  {preguntas.map((pregunta) => (
                                    <option
                                      key={pregunta.id}
                                      value={pregunta.Descripcion} // Corregido: debería ser pregunta.Descripcion
                                    >
                                      {pregunta.Descripcion}
                                    </option>
                                  ))}
                                </select>
                                {errors.DescripcionPregunta && (
                                  <p className="text-red-500 text-xs mt-1 max-w-xs">
                                    {errors.DescripcionPregunta}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="px-4 py-2">
                                {usuario.DescripcionPregunta}
                              </div>
                            )}
                          </div>
                          <div className="grid grid-cols-2">
                            <div className="px-4 py-2 font-semibold">
                              Respuesta
                            </div>
                            {editMode ? (
                              <div className="flex flex-col items-center">
                                <input
                                  type="text"
                                  name="Respuesta"
                                  value={formData.Respuesta}
                                  onChange={handleChange}
                                  className={`w-full rounded border ${errors.Respuesta
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    } bg-inherit p-3 shadow shadow-gray-100 mt-2 appearance-none outline-none text-neutral-800 max-w-xs`}
                                />
                                {errors.Respuesta && (
                                  <p className="text-red-500 text-xs mt-1 max-w-xs">
                                    {errors.Respuesta}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="px-4 py-2">
                                {usuario.Respuesta}
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <div>Cargando...</div>
                      )}
                    </div>
                    <div className="mt-4 text-right">
                      {editMode ? (
                        <button
                          type="submit"
                          className="rounded-md bg-green-600 text-white py-2 px-4 hover:bg-green-700 focus:outline-none focus:bg-green-700"
                        >
                          Guardar cambios
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleEditToggle}
                          className="rounded-md bg-gray-600 text-white py-2 px-4 hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                        >
                          Editar
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
