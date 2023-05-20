import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Button, Col, Container, Row } from "reactstrap"
import { removeAula, verListaDeAulas } from "services/aulas/aulas_services"
import firebase from "firebase/app"
import "firebase/firestore"
import { aulasCollection } from "services/consts"
import AdicionarAulasModal from "components/modals/adicionar_aulas_modal"
import { Trash2 } from "react-bootstrap-icons"
import RemoveModal from "components/modals/remove_modal"
import EditarAulasModal from "components/modals/editar_aula_modal"

function AulasScreen() {
  const { t, i18n } = useTranslation()
  const [listaDeAulas, setListaDeAulas] = useState([])

  var weekday = new Array(7)
  weekday[0] = "Segunda"
  weekday[1] = "Terça"
  weekday[2] = "Quarta"
  weekday[3] = "Quinta"
  weekday[4] = "Sexta"
  weekday[5] = "Sábado"
  weekday[6] = "Domingo"

  async function verListaDeAulas(localizacao) {
    console.log("fetching a lista de aulas")
    try {
      return firebase
        .firestore()
        .collection(aulasCollection)
        .where("localizacao", "==", localizacao)
        .onSnapshot(docsSnap => {
          var listaDeAulasAux = []
          for (const element of docsSnap.docs) {
            listaDeAulasAux.push(element)
          }
          setListaDeAulas(listaDeAulasAux)
        })
    } catch (e) {
      console.error(e)
      return null
    }
  }

  useEffect(() => {
    verListaDeAulas("Great Padel Vila Verde")
  }, [])
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col xs={7} sm={8} md={9} lg={10}>
                <h6 className="page-title">{t("Aulas")}</h6>
              </Col>
              <Col>
                <AdicionarAulasModal buttonLabel="Adicionar Aulas"></AdicionarAulasModal>
              </Col>
            </Row>
          </div>
          <Row style={{ marginBottom: "10px" }}>
            <Col className="list-title" md={2}>
              Dia
            </Col>
            <Col className="list-title" md={2}>
              Início
            </Col>
            <Col className="list-title" md={2}>
              Nr de Alunos
            </Col>
            <Col className="list-title" md={2}>
              Professor
            </Col>
            <Col className="list-title" md={2}>
              Campos
            </Col>
          </Row>
          {listaDeAulas.map((aulaSnap, index) => {
            var aula = aulaSnap.data()
            console.log(aula.weekDay)
            return (
              <Row
                key={index}
                className={index % 2 == 0 ? "myList-even" : "myList-odd"}
              >
                <Col md={2}>
                  <p>{weekday[aula.weekDay]}</p>
                </Col>
                <Col md={2}>
                  <p>{aula.horaInicial}</p>
                </Col>
                <Col md={2}>{aula.alunos.length}</Col>
                <Col md={2}>
                  <p>{aula.professor}</p>
                </Col>
                <Col md={2}>
                  {aula.campos.map((elem, index) => {
                    return <p>{elem}</p>
                  })}
                </Col>
                <Col md={2}>
                  <RemoveModal
                    titulo="Tem a certeza que deseja remover esta aula?"
                    collection={aulasCollection}
                    docID={aulaSnap.id}
                    removeLabel={"Remover"}
                  ></RemoveModal>
                  <EditarAulasModal
                    aula={aula}
                    aulaId={aulaSnap.id}
                  ></EditarAulasModal>
                </Col>
              </Row>
            )
          })}
        </Container>
      </div>
    </React.Fragment>
  )
}

export default AulasScreen
