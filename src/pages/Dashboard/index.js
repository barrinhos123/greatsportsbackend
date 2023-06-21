import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { MetaTags } from "react-meta-tags"
import { Button, Col, Container, Row } from "reactstrap"

import firebase from "firebase/app"
import "firebase/firestore"
import { setlocalizacao } from "store/localizacao/localizacao_reducer"
import { setbloquearReservas } from "store/bloquear_reservas/bloquear_reservas_reducer"
import { setdescontos } from "store/descontos/descontos_reducer"
import { setclasses } from "store/localizacao/classes_reducer"
import { setclubeid } from "store/localizacao/clube_id_reducer"
import { settreinadores } from "store/treinadores/treinadores_reducer"
import { setferiados } from "store/descontos/feriados"
import { getLocalizacaoFromEmail } from "services/localizacao/localizacao_services"
import { useDispatch } from "react-redux"

function Dashboard() {
  const { t, i18n } = useTranslation()

  const dispatch = useDispatch()
  //DA para otimizar isto para so dar fetch a primeira vez que abre a dashboard
  async function getValues() {
    console.log("ESTOU NA DASHBOARD" )


    if (localStorage.getItem("authUser")) {
    
      const obj = JSON.parse(localStorage.getItem("authUser"))
      try {
        console.log("Estou no try")
        await getLocalizacaoFromEmail(obj.email).then(async localizacao => {
          console.log("LOCALIZACAO")
          console.log(localizacao)
          try {
            await firebase
            .firestore()
            .collection("localizacao")
            .where("localizacao", "==", localizacao)
            .limit(1).get().then((values) => {
              console.log("ESTOU NA A IR BUSCAR VALUES NA DASHBOAR" )
              var bloquear = values.docs.at(0).data().horariosBloqueados
              var descontos = values.docs.at(0).data().descontos
              var classes = values.docs.at(0).data().classes
              var clubeid = values.docs.at(0).id
              var treinadores = values.docs.at(0).data().treinadores
              var localizacao = values.docs.at(0).data().localizacao
              var feriados = values.docs.at(0).data().feriados
              
              dispatch(setbloquearReservas(bloquear))
              dispatch(setdescontos(descontos))
              dispatch(setclasses(classes))
              dispatch(setclubeid(clubeid))
              dispatch(settreinadores(treinadores))
              dispatch(setlocalizacao(localizacao))
              dispatch(setferiados(feriados))
            })
          } catch (error) {
            console.log(error)
            
          }
          
        })
      } catch (error) {
        console.log("ERRO");
        console.log(error);
      }
      
    }
  }
  useEffect(()=> {
    getValues()
  },[])
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Great Padel</title>
        </MetaTags>
        <Container fluid>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">{t("Dashboard")}</h6>
                 
                {/* <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">
                    {t("Adicionar nova Reserva")}
                  </li>
                </ol> */}
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Dashboard
