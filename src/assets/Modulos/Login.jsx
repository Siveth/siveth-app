import React, { useState, useEffect, useRef } from "react";
import Input from "../componentes/ui/input.jsx";
import { BiHide, BiShow } from "react-icons/bi";
import Label from "../componentes/ui/label.jsx";
import Axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import "tailwindcss/tailwind.css";


export default function Login({ title }) {
  const [showModal, setShowModal] = useState(false);
  const [ShowPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [error, setError] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [userlogueaded, setUserLogueaded] = useState(false);
  const loginButtonRef = useRef(null);

  useEffect(() => {
    let timer;
    if (attemptCount >= 3 && attemptCount < 6) {
      setDisableButton(true);
      setTimeLeft(30);
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (attemptCount >= 6) {
      setDisableButton(true);
      setTimeLeft(60);
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [attemptCount]);

  useEffect(() => {
    if (timeLeft === 0) {
      setDisableButton(false);
      setAttemptCount(0);
    }
  }, [timeLeft]);

  const handleSubmit = async () => {
    const isValidPassword = password.length >= 8;
    setPasswordValid(isValidPassword);

    if (!recaptchaValue) {
      setError("Por favor, verifica que no eres un robot");
      return;
    }

    if (!isValidPassword || password.trim() === "") {
      return;
    }

    try {
      const response = await Axios.post(
        "https://back-end-siveth-g8vc.vercel.app/api/logueo",
        {
          correo: email,
          contrasenia: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = response.data;

      if (response.status === 200 && responseData.status === "success") {
        window.location.href = "/admin/";
        setUserLogueaded(true); // Cambiar el estado de logueado
        setError(""); // Limpiar el mensaje de error
      } else {
        setError("Error en el inicio de sesión: " + responseData.message);
        setAttemptCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      setError("Error en el inicio de sesión. Contraseña incorrecta.");
      setAttemptCount((prevCount) => prevCount + 1);
      if (attemptCount >= 2) {
        setDisableButton(true);
        setTimeLeft(30);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <a href="#">{title}</a>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight pb-2.5 text-gray-900">
          Iniciar sesión
        </h2>
        <form
          className="space-y-6 relative" // Agrega relative aquí
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
          onKeyDown={handleKeyDown}
        >
          <div>
            <Label htmlFor="email">Correo Electrónico</Label>
            <div className="mt-2">
              <Input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                required
                placeholder="correo, usuario, telefono"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  borderColor:
                    emailValid && email.trim() !== ""
                      ? "green"
                      : emailValid
                      ? ""
                      : "red",
                }}
              />
            </div>
            {!emailValid && (
              <span className="text-red-600 text-sm">
                Correo electrónico inválido1
              </span>
            )}
          </div>
  
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <div className="text-sm">
                {/* Modal para restablecimiento de contraseña */}
                <div>
                  <span
                    className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer"
                    onClick={openModal}
                  >
                    ¿Olvidó su contraseña?
                  </span>
                  {showModal && (
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"> {/* Ajusta la z-index para que aparezca por encima */}
                      <div className="bg-white p-8 rounded shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Metodo de restablecimiento</h2>
                        <p className="text-sm mb-4">
                          Selecciona el metodo
                        </p>
                        <div className="flex justify-end">
                          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded mr-2" onClick={closeModal}>
                            Cancelar
                          </button>
                          <Link to="/SendEmail" className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded mr-2">
                            Enviar email
                          </Link>
                          <Link to="/SendEmailPregunta" className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded mr-2">
                            Pregunta secreta
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
  
          <div className="mt-2 relative">
            <Input
              id="password"
              name="password"
              type={ShowPwd ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="****"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                borderColor:
                  passwordValid && password.trim() !== ""
                    ? "green"
                    : passwordValid
                    ? ""
                    : "red",
              }}
              className={`w-full rounded border border-gray-300 bg-inherit p-3 shadow shadow-gray-100 mt-2 appearance-none outline-none text-neutral-800 ${
                ShowPwd ? "" : "hide-password-icon"
              }`}
            />
  
            <div
              className="absolute inset-y-0 top-1.5 right-0 flex items-center pr-3 "
              onClick={() => setShowPwd(!ShowPwd)}
            >
              {ShowPwd ? (
                <BiHide className="text-indigo-600 text-xl" />
              ) : (
                <BiShow className="text-indigo-500 text-xl" />
              )}
            </div>
          </div>
          {!passwordValid && (
            <span className="text-red-600 text-sm">
              La contraseña debe tener al menos 8 caracteres
            </span>
          )}
  
          <div className="flex justify-center mt-4">
            <ReCAPTCHA
              sitekey="6LcqzmwpAAAAAHS95sakGoUwrQ73VRwYLVullfts"
              onChange={(value) => setRecaptchaValue(value)}
            />
          </div>
  
          {error && (
            <div className="text-red-600 text-sm text-center mb-4">
              {error}
            </div>
          )}
  
          {attemptCount >= 3 && (
            <div className="text-center text-gray-500 text-sm mt-2">
              {attemptCount < 6
                ? `Botón bloqueado. Volverá a habilitarse en ${timeLeft} segundos.`
                : `Botón bloqueado. Volverá a habilitarse en ${timeLeft} segundos.`}
            </div>
          )}
  
          <div>
            <button
              ref={loginButtonRef}
              type="submit"
              className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                attemptCount >= 6
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500"
              }`}
              disabled={disableButton}
            >
              Iniciar sesión
            </button>
          </div>
        </form>
  
        <p className="mt-10 text-center text-sm text-gray-500">
          ¿Aún no tienes una cuenta?{" "}
          <Link
            to={"/Registro"}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Regístrate Aquí
          </Link>
        </p>
      </div>
    </div>
  </>
    );
}
