import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./assets/componentes/header.jsx";
import Footer from "./assets/componentes/footer.jsx";
import Home from "./assets/componentes/home.jsx";
import Login from "./assets/Modulos/Login.jsx";
import Registro from "./assets/Modulos/Registro1.jsx";
import NotFound from "./Error/Error_404.jsx";
import Sidebar from "./assets/componentes/Admin/Dashbor.jsx";
import AdHeader from "./assets/componentes/Admin/admHeader.jsx";
import Code from "./assets/componentes/ui/Boletos.jsx";
import Error400 from "./Error/Error_400.jsx";
import Error500 from "./Error/Error_500.jsx";
import Reportes from './assets/Modulos/ReporteCompras.jsx';
import Ayuda from "./assets/Modulos/Ayuda";
import EnviaEmail from "./assets/componentes/EnviaEmail";
import CodePass from "./assets/componentes/CodePass";
import CambioPass from "./assets/componentes/CambioPass";
import HeaderUsReg from "./assets/componentes/HeaderUsReg";
import EnviaPregunta from "./assets/componentes/EnviaPregunta";
import 'tailwindcss/tailwind.css';




// import Titulo from "./assets/componentes/Titulo.jsx";
function App() {
  // const [count, setCount] = useState(0)

  const PublicRoutes = () => (
    <>
      {/* Area publica */}
      <Header />

      {/* {showCookiesBanner && <CookiesBanner onAccept={handleAcceptCookies} />} Muestra el banner de cookies */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Registro" element={<Registro />} />
        <Route path="/Boletos" element={<Code />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/ayuda" element={<Ayuda />} />
        <Route path="/SendEmail" element={<EnviaEmail />} />
        <Route path="/SendEmailPregunta" element={<EnviaPregunta />} />
        <Route path="/code" element={<CodePass />} />
        <Route path="/changePass" element={<CambioPass />} />
        <Route path="/LoginReg" element={<HeaderUsReg />} />
          
        
        {/* <Route path="/terms-cond" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/quienes-somos" element={<AcercaDe />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/new-address" element={<NewAddress />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/checkup" element={<Carrito />} />
          <Route path="/purchase-history" element={<PurchaseHistory />} /> */}

        {/* Ruta para el error 400 */}
        <Route path="/Error400" element={<Error400 />} />
        {/* Ruta para el error 500 */}
        <Route path="/Error500" element={<Error500 />} />
        {/* Ruta por defecto para manejar cualquier otra ruta no definida */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );

  const AdminRoutes = () => (
    <>
      <AdHeader />
      <Sidebar />
      <Routes>
        {/* <Route path="/Dash" element={<Sidebar />} /> */}
        {/* <Route path="/" element={<HomeAdmin title={title} />} />
        <Route path="/inventory" element={<Inventario title={title} />} />
        <Route path="/inventory/add-product" element={<AddProduct title={title} />} /> */}
      </Routes>
    </>
  );

  return (
    <Router>
      <Routes>
        <Route path="/admin/" element={<AdminRoutes />} />
        <Route path="/admin/reportes" element={<Reportes />} />
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
