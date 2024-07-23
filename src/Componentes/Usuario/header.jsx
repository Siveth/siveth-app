import React, { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  Menu,
  Disclosure,
  Popover,
  Transition,
} from "@headlessui/react";
import {
  Bars3Icon,
  ChartPieIcon,
  FingerPrintIcon,
  TruckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const isAuthenticated = localStorage.getItem("token");
  const roleId = localStorage.getItem("roleId");

  useEffect(() => {
    if (isAuthenticated && roleId === "3") {
      setShowUserMenu(true);
      axios
        .get("https://back-end-siveth-g8vc.vercel.app/api/getUserByEmail", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setUserData(response.data);
          console.log("Datos del usuario:", response.data);
        })
        .catch((error) => {
          console.error("Error al obtener los datos del usuario:", error);
        });
    } else {
      setShowUserMenu(false);
    }
  }, [isAuthenticated, roleId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roleId");
    navigate("/Login");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const userNavigation = [
    {
      name: "Tu perfil",
      to: "/PerfilU",
      action: closeMobileMenu,
      userData: userData,
    },
    {
      name: "Integrar con Alexa",
      to: "/SixDigitCode",
      action: closeMobileMenu,
      userData: userData,
    },
    { name: "Configuracion", href: "#", action: closeMobileMenu },
    { name: "Cerrar sesión", action: handleLogout },
  ];

  const products = [
    {
      name: "Mudanzas",
      description: "Get a better understanding of your traffic",
      icon: ChartPieIcon,
      to: "/Mudanzas",
    },
    {
      name: "Paqueteria",
      description: "Speak directly to your customers",
      icon: TruckIcon,
      to: "/Paqueteria",
    },
    {
      name: "Viajes Particulares",
      description: "Your customers’ data will be safe and secure",
      icon: FingerPrintIcon,
      to: "/ViajesParticulares",
    },
  ];

  const Servicios = [
    {
      name: "Mudanzas",
      description: "Get a better understanding of your traffic",
      icon: ChartPieIcon,
      to: "/InformacionM",
    },
    {
      name: "Paqueteria",
      description: "Speak directly to your customers",
      icon: TruckIcon,
      to: "/InformacionP",
    },
    {
      name: "Viajes Particulares",
      description: "Your customers’ data will be safe and secure",
      icon: FingerPrintIcon,
      to: "/InformacionVP",
    },
  ];

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <header className="bg-blue-700">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-1 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img className="h-25 w-auto " src="/src/img/logo.png" alt="" />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <Link to="/" className="text-base font-semibold leading-6 text-white">
            Home
          </Link>
          {/* <Link
            to="/Demanda"
            className="text-base font-semibold leading-6 text-white"
          >
            Demanda
          </Link> */}
          <Link
            to="/Boletos"
            className="text-base font-semibold leading-6 text-white"
          >
            Boletos
          </Link>
          {/* Servicios */}
          <Popover className="relative">
            <Popover.Button className="flex items-center gap-x-1 text-base font-semibold leading-6 text-white">
              Servicios
              <ChevronDownIcon
                className="h-5 w-5 flex-none text-white"
                aria-hidden="true"
              />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute -left-14 top-full z-10 mt-3 w-max max-w-sm overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                <div className="p-4 pl-1">
                  {Servicios.map((item) => (
                    <div
                      key={item.name}
                      className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                    >
                      <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                        <item.icon
                          className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex-auto">
                        <Link
                          to={item.to}
                          className="block font-semibold text-gray-900"
                        >
                          {item.name}
                          <span className="absolute inset-0" />
                        </Link>
                        <p className="mt-1 text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>

          {/* Cotizaciones */}
          <Popover className="relative">
            <Popover.Button className="flex items-center gap-x-1 text-base font-semibold leading-6 text-white">
              Cotizaciones
              <ChevronDownIcon
                className="h-5 w-5 flex-none text-white"
                aria-hidden="true"
              />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute -left-14 top-full z-10 mt-3 w-max max-w-sm overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                <div className="p-4">
                  {products.map((item) => (
                    <div
                      key={item.name}
                      className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                    >
                      <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                        <item.icon
                          className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex-auto">
                        <Link
                          to={item.to}
                          className="block font-semibold text-gray-900"
                        >
                          {item.name}
                          <span className="absolute inset-0" />
                        </Link>
                        <p className="mt-1 text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>

          {/* Menú de usuario */}
          {showUserMenu && (
            <Menu as="div" className="relative ml-3">
              <div className="hidden lg:flex">
                <Link
                  to="/MudanzaM"
                  className="text-base font-semibold leading-6 text-white "
                >
                  Buzon<span aria-hidden="true"></span>
                </Link>
                {/* Add spacing between welcome text and user menu */}
                <span className="text-base font-semibold leading-6 text-white mx-2">
                  Bienvenido, {userData?.Nombre || "Usuario"}
                </span>
                <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src="/src/assets/alan.jpeg"
                    // src={userData?.imageUrl || "/default-avatar.png"}
                    alt=""
                  />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {userNavigation.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <Link
                          to={item.to || "#"}
                          onClick={item.action}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          {item.name}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        </Popover.Group>
        {!isAuthenticated && (
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link
              to="/Login"
              className="text-base font-semibold leading-6 text-white"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        )}
      </nav>

      <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <Dialog.Panel focus="true" className="fixed inset-0 z-10 overflow-y-auto bg-white px-6 py-6 lg:hidden">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img className="h-25 w-auto" src="/src/img/logo.png" alt="" />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Link
                  to="/"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>
                <Link
                  to="/Demanda"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  Demanda
                </Link>
                <Link
                  to="/Boletos"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  Boletos
                </Link>
                <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                        Servicios
                        <ChevronDownIcon
                          className={classNames(
                            open ? "rotate-180" : "",
                            "h-5 w-5 flex-none"
                          )}
                          aria-hidden="true"
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2 space-y-2">
                        {Servicios.map((item) => (
                          <Disclosure.Button
                            key={item.name}
                            as="a"
                            href={item.to}
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          >
                            {item.name}
                          </Disclosure.Button>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                        Cotizaciones
                        <ChevronDownIcon
                          className={classNames(
                            open ? "rotate-180" : "",
                            "h-5 w-5 flex-none"
                          )}
                          aria-hidden="true"
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2 space-y-2">
                        {products.map((item) => (
                          <Disclosure.Button
                            key={item.name}
                            as="a"
                            href={item.to}
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          >
                            {item.name}
                          </Disclosure.Button>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                {showUserMenu && (
                  <div className="py-6">
                    <Link
                      to="/MudanzaM"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={closeMobileMenu}
                    >
                      Buzon
                    </Link>
                    <Link
                      to="/PerfilU"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={closeMobileMenu}
                    >
                      Tu perfil
                    </Link>
                    <Link
                      to="/SixDigitCode"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={closeMobileMenu}
                    >
                      Integrar con Alexa
                    </Link>
                    <Link
                      to="#"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={closeMobileMenu}
                    >
                      Configuración
                    </Link>
                    <Link
                      to="/Login"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </Link>
                  </div>
                )}
              </div>
              {!isAuthenticated && (
                <div className="py-6">
                  <Link
                    to="/Registro"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={closeMobileMenu}
                  >
                    Registro
                  </Link>
                  <Link
                    to="/Login"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
