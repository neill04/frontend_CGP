import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import FormAcademia from "./pages/Forms/FormAcademia";
import AcademiasList from "./pages/Academia/AcademiasList";
import FormAcademiaEdit from "./pages/Forms/FormAcademiaEdit";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SignInCGP from "./pages/AuthPages/SignInCGP";
import AcademiaInfo from "./pages/Academia/AcademiaInfo";
import FormEquipo from "./pages/Forms/FormEquipo";
import FormEntrenador from "./pages/Forms/FormEntrenador";
import FormDelegado from "./pages/Forms/FormDelegado";
import EntrenadorProfile from "./pages/UserProfiles/EntrenadorProfile";
import DelegadoProfile from "./pages/UserProfiles/DelegadoProfile";
import EquipoInfo from "./pages/Academia/EquipoInfo";
import FormJugador from "./pages/Forms/FormJugador";
import { AuthProvider } from "./context/AuthContext";
import EquiposList from "./pages/EquiposList";
import EntrenadoresList from "./pages/EntrenadoresList";
import DelegadosList from "./pages/DelegadosList";
import JugadoresList from "./pages/JugadoresList";
import JugadoresListAcademia from "./pages/Academia/JugadoresListAcademia";
import EntrenadoresListAcademia from "./pages/Academia/EntrenadoresListAcademia";
import DelegadosListAcademia from "./pages/Academia/DelegadosListAcademia";

export default function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Dashboard Layout */}
            <Route element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>}
            >
              <Route index path="/" 
                element={
                  <ProtectedRoute roles={["ADMINISTRADOR"]}>
                    <Home />
                  </ProtectedRoute>
                } 
              />

              {/* Others Page */}
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />

              {/* Forms */}
              <Route path="/formAcademia" element={
                <ProtectedRoute roles={["ADMINISTRADOR"]}>
                  <FormAcademia />
                </ProtectedRoute>
              }/>
              <Route path="/formAcademia/edit/:id" element={<FormAcademiaEdit />} />
              
              <Route path="/academias/:id/formEquipo" 
                element={
                  <ProtectedRoute roles={["ADMINISTRADOR", "ACADEMIA"]} requireAcademiaAccess>
                    <FormEquipo />
                  </ProtectedRoute>
                } 
              />

              <Route path="/academias/:id/formEntrenador" 
                element={
                  <ProtectedRoute roles={["ADMINISTRADOR", "ACADEMIA"]} requireAcademiaAccess>
                    <FormEntrenador />
                  </ProtectedRoute>
                } 
              />

              <Route path="/academias/:id/formDelegado" 
                element={
                  <ProtectedRoute roles={["ADMINISTRADOR", "ACADEMIA"]} requireAcademiaAccess>
                    <FormDelegado />
                  </ProtectedRoute>
                } 
              />

              <Route path="/academias/:academiaId/equipos/:equipoId/jugadores" 
                element={
                  <ProtectedRoute roles={["ADMINISTRADOR", "ACADEMIA"]} requireAcademiaAccess>
                    <FormJugador />
                  </ProtectedRoute>
                } 
              />

              <Route path="/academias/:academiaId/entrenadores/:entrenadorId"
                element={
                  <ProtectedRoute roles={["ADMINISTRADOR", "ACADEMIA"]} requireAcademiaAccess>
                    <EntrenadorProfile />
                  </ProtectedRoute>
                } 
              />

              <Route path="/academias/:academiaId/delegados/:delegadoId"
                element={
                  <ProtectedRoute roles={["ADMINISTRADOR", "ACADEMIA"]} requireAcademiaAccess>
                    <DelegadoProfile />
                  </ProtectedRoute>
                } 
              />

              <Route path="/academias/:academiaId/equipos/:equipoId" 
                element={
                  <ProtectedRoute roles={["ADMINISTRADOR", "ACADEMIA"]} requireAcademiaAccess>
                    <EquipoInfo />
                  </ProtectedRoute>
                } 
              />
  
              {/* Tables */}
              <Route path="/basic-tables" element={<BasicTables />} />
              
              <Route path="/academias" 
                element={
                  <ProtectedRoute roles={["ADMINISTRADOR"]}>
                    <AcademiasList />
                  </ProtectedRoute>
                } 
              />

              <Route path="/equipos"
                element={
                  <ProtectedRoute roles={["ADMINISTRADOR"]}>
                    <EquiposList />
                  </ProtectedRoute>
                }
              />

              <Route path="/entrenadores"
                element={
                  <ProtectedRoute roles={["ADMINISTRADOR"]}>
                    <EntrenadoresList />
                  </ProtectedRoute>
                }
              />

              <Route path="/delegados"
                element={
                  <ProtectedRoute roles={["ADMINISTRADOR"]}>
                    <DelegadosList />
                  </ProtectedRoute>
                }
              />

              <Route path="/jugadores"
                element={
                  <ProtectedRoute roles={["ADMINISTRADOR"]}>
                    <JugadoresList />
                  </ProtectedRoute>
                }
              />

              <Route path="/academias/:academiaId/entrenadores" 
                element={
                  <ProtectedRoute roles={["ADMINISTRADOR", "ACADEMIA"]} requireAcademiaAccess>
                    <EntrenadoresListAcademia />
                  </ProtectedRoute>
                } 
              />

              <Route path="/academias/:academiaId/delegados" 
                element={
                  <ProtectedRoute roles={["ADMINISTRADOR", "ACADEMIA"]} requireAcademiaAccess>
                    <DelegadosListAcademia />
                  </ProtectedRoute>
                } 
              />

              <Route path="/academias/:academiaId/jugadores" 
                element={
                  <ProtectedRoute roles={["ADMINISTRADOR", "ACADEMIA"]} requireAcademiaAccess>
                    <JugadoresListAcademia />
                  </ProtectedRoute>
                } 
              />

              <Route path="/academias/:id" 
                element={
                  <ProtectedRoute roles={["ADMINISTRADOR", "ACADEMIA"]} requireAcademiaAccess>
                    <AcademiaInfo />
                  </ProtectedRoute>
                } 
              />

              {/* Ui Elements */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />

              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>

            {/* Auth Layout */}
            <Route path="/signin" element={<SignInCGP />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}
