import React from "react"
import { Redirect } from "react-router-dom"

// Profile
import UserProfile from "../pages/Authentication/user-profile"

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"
// Dashboard
import Dashboard from "../pages/Dashboard/index"
import ReservasScreen from "pages/Reservas/reservas"
import Descontos from "pages/descontos/descontos_main"
import AulasScreen from "pages/Aulas/aulas"
import ProcurarUtilzadoresScreen from "pages/utilizadores/users"
import ContratosScree from "pages/contratos/contratos"
import CriarReservas from "pages/Reservas/criar_reservas"
import VerReservasScreen from "pages/Reservas/verReservas"
import TreinadoresMainScreen from "pages/treinadores/treinadores_main_screen"
import CriarReservasSemRegistoScreen from "pages/Reservas/criar_reservas_sem_registo"
import AdicioanarBancoDeHoras from "pages/utilizadores/adicionar_banco_de_horas"
import ContratosPeriodicos from "pages/contratos/contratos_periodicos"
import DadosDoRequestID from "pages/utilizadores/dados_request_id"
import JogadoresToExcel from "pages/utilizadores/jogadores_to_excel"
import Feriados from "pages/descontos/feriados"
import MoloniPage from "pages/utilizadores/moloni"
import DesativarHoras from "pages/Reservas/desativar_horas"

const userRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/reservas", component: ReservasScreen },
  { path: "/reservas/:id", component: VerReservasScreen },
  { path: "/descontos", component: Descontos },
  { path: "/aulas", component: AulasScreen },
  { path: "/procurarUtilizadores", component: ProcurarUtilzadoresScreen },
  { path: "/dadosDoRequestID", component: DadosDoRequestID },
  { path: "/contratos", component: ContratosScree },
  { path: "/contratosPeriodicos", component: ContratosPeriodicos },
  { path: "/adicionarReservas", component: CriarReservas },
  { path: "/jsonToExcelJogadores", component: JogadoresToExcel },
  { path: "/feriados", component: Feriados },
  { path: "/moloni", component: MoloniPage  },
  { path: "/desativarCampos", component: DesativarHoras  },
  {
    path: "/adicionarReservasSemRegisto",
    component: CriarReservasSemRegistoScreen,
  },
  { path: "/adicionarBancoDeHoras", component: AdicioanarBancoDeHoras },
 
  { path: "/treinadores", component: TreinadoresMainScreen },

  // // //profile
  { path: "/profile", component: UserProfile },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
]

const authRoutes = [
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/register", component: Register },
]

export { userRoutes, authRoutes }
