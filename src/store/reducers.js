import { combineReducers } from "redux"

// Front
import Layout from "./layout/reducer"

// Authentication
import Login from "./auth/login/reducer"
import Account from "./auth/register/reducer"
import ForgetPassword from "./auth/forgetpwd/reducer"
import Profile from "./auth/profile/reducer"

//Calendar
import calendar from "./calendar/reducer"
import descontos_reducer from "./descontos/descontos_reducer"
import classes_reducer from "./localizacao/classes_reducer"
import clube_id_reducer from "./localizacao/clube_id_reducer"
import localizacao_reducer from "./localizacao/localizacao_reducer"
import treinadores_reducer from "./treinadores/treinadores_reducer"

const rootReducer = combineReducers({
  treinadores: treinadores_reducer,
  descontos: descontos_reducer,
  classes: classes_reducer,
  clubeid: clube_id_reducer,
  localizacao: localizacao_reducer,
  // public
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
  calendar,
})

export default rootReducer
