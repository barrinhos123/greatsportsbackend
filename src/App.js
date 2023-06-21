import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"

import firebase from "firebase/app"
import "firebase/firestore"

import { Switch, BrowserRouter as Router } from "react-router-dom"
import { connect, useDispatch, useSelector } from "react-redux"

// Import Routes all
import { userRoutes, authRoutes } from "./routes/allRoutes"

// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware"

// layouts Format
import VerticalLayout from "./components/VerticalLayout/"
import HorizontalLayout from "./components/HorizontalLayout/"
import NonAuthLayout from "./components/NonAuthLayout"

// Import scss
import "./assets/scss/theme.scss"

// Import Firebase Configuration file
import { initFirebaseBackend } from "./helpers/firebase_helper"

import fakeBackend from "./helpers/AuthType/fakeBackend"
import {
  getLocalizacaoFromEmail,
  getLocalValues,
} from "services/localizacao/localizacao_services"
import {
  selectdescontos,
  setdescontos,
} from "store/descontos/descontos_reducer"
import { setlocalizacao } from "store/localizacao/localizacao_reducer"
import { setclasses } from "store/localizacao/classes_reducer"
import { setclubeid } from "store/localizacao/clube_id_reducer"
import { settreinadores } from "store/treinadores/treinadores_reducer"
import { setferiados } from "store/descontos/feriados"
import { setbloquearReservas } from "store/bloquear_reservas/bloquear_reservas_reducer"

// Activating fake backend
//fakeBackend()

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENTID,
}

//const app = initializeApp(firebaseConfig);
initFirebaseBackend(firebaseConfig)

const App = props => {
  const [email, setemail] = useState("")
  var dispatch = useDispatch()

  function getLayout() {
    let layoutCls = VerticalLayout
    switch (props.layout.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout
        break
      default:
        layoutCls = VerticalLayout
        break
    }
    return layoutCls
  }

  async function getValues() {

    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"))

      setemail(obj.email)
      try {
        await getLocalizacaoFromEmail(obj.email).then(async localizacao => {
          dispatch(setlocalizacao(localizacao))
          firebase
            .firestore()
            .collection("localizacao")
            .where("localizacao", "==", localizacao)
            .limit(1)
            .onSnapshot(values => {
              var bloquear = values.docs.at(0).data().horariosBloqueados
              var descontos = values.docs.at(0).data().descontos
              var classes = values.docs.at(0).data().classes
              var clubeid = values.docs.at(0).id
              var treinadores = values.docs.at(0).data().treinadores
              var localizacao = values.docs.at(0).data().localizacao
              var feriados = values.docs.at(0).data().feriados
              console.log("Valores do local: ", descontos)
              dispatch(setbloquearReservas(bloquear))
              dispatch(setdescontos(descontos))
              dispatch(setclasses(classes))
              dispatch(setclubeid(clubeid))
              dispatch(settreinadores(treinadores))
              dispatch(setlocalizacao(localizacao))
              dispatch(setferiados(feriados))
            })
        })
      } catch (error) {
        console.log("ERRO");
        console.log(error);
      }
      
    }
  }

  useEffect(() => {
    getValues()
  }, [])

  const Layout = getLayout()
  return (
    <React.Fragment>
      <Router>
        <Switch>
          {authRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={NonAuthLayout}
              component={route.component}
              key={idx}
              isAuthProtected={false}
            />
          ))}

          {userRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={Layout}
              component={route.component}
              key={idx}
              isAuthProtected={true}
              exact
            />
          ))}
        </Switch>
      </Router>
    </React.Fragment>
  )
}

App.propTypes = {
  layout: PropTypes.any,
}

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  }
}

export default connect(mapStateToProps, null)(App)
