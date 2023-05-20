import AdicinoarTreinadorMolda from "components/modals/adicionar_trienador_modal"
import { Treinador } from "models/treinador"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { MetaTags } from "react-meta-tags"
import { Button, Col, Container, Row } from "reactstrap"
import { criarTreinador } from "services/treinadores/treinadores_Services"
import firebase from "firebase/app"
import "firebase/firestore"
import { treinadoresCollection } from "services/consts"
import { element } from "prop-types"

function TreinadoresMainScreen() {
  const { t, i18n } = useTranslation()
  const [treinadores, setTreindadores] = useState([])

  async function getTreinadores(localizacao) {
    var listaAux = []
    try {
      firebase
        .firestore()
        .collection(treinadoresCollection)
        .where("localizacao", "==", localizacao)
        .onSnapshot(value => {
          listaAux = []
          setTreindadores([])
          value.docs.forEach(element => {
            console.log("element")
            console.log(element)
            listaAux.push(element.data())
          })
          setTreindadores(listaAux)
        })
    } catch (error) {
      console.error(error)
      return null
    }
  }

  useEffect(() => {
    getTreinadores("Great Padel Vila Verde")
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={10}>
                <h6 className="page-title">{t("Treinadores")}</h6>
              </Col>
              <Col md={2}>
                <AdicinoarTreinadorMolda></AdicinoarTreinadorMolda>
              </Col>
            </Row>
          </div>
          <Row>
            <Col md={5}>
              <h4>Nome</h4>
            </Col>
            <Col md={5}>
              <h4>Email</h4>
            </Col>
          </Row>
          {treinadores.map((elemnt, index) => {
            console.log(element)
            const treinadorData = elemnt
            return (
              <Row
                key={index}
                className={index % 2 == 0 ? "myList-even" : "myList-odd"}
              >
                <Col md={5}>{treinadorData.nome}</Col>
                <Col md={5}>{treinadorData.email}</Col>
              </Row>
            )
          })}
        </Container>
      </div>
    </React.Fragment>
  )
}

export default TreinadoresMainScreen
