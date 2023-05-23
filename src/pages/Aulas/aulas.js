import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Button, Col, Container, Input, Row } from "reactstrap"
import { removeAula, verListaDeAulas } from "services/aulas/aulas_services"
import firebase from "firebase/app"
import "firebase/firestore"
import { aulasCollection, diasDaSemana } from "services/consts"
import AdicionarAulasModal from "components/modals/adicionar_aulas_modal"
import { Trash2 } from "react-bootstrap-icons"
import RemoveModal from "components/modals/remove_modal"
import EditarAulasModal from "components/modals/editar_aula_modal"
import { element } from "prop-types"
import { useSelector } from "react-redux"
import { selecttreinadores } from "store/treinadores/treinadores_reducer"

function AulasScreen() {
  const { t, i18n } = useTranslation()
  const [listaDeAulas, setListaDeAulas] = useState([])
  const professores = useSelector(selecttreinadores)
  const [diaDaSemana, setDiaDaSemana] = useState(0)

  const [trienador, setTreinador] = useState('')

  const [filtroProfessor, setFiltroProfessor] = useState([])
  const [filtroCampo, setfiltroCampo] = useState([])
  const [filtroDiaDaSemana, setfiltroDiaDaSemana] = useState([])

  const [listaFiltrada, setListaFiltrada] = useState([])

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
          console.log("Fetching aulasd");
          var listaDeAulasAux = []
          for (const element of docsSnap.docs) {
            listaDeAulasAux.push(element)
          }
          console.log(listaDeAulasAux);
          setListaDeAulas(listaDeAulasAux)
          setListaFiltrada(listaDeAulasAux)
        })
    } catch (e) {
      console.error(e)
      return null
    }
  }

  function filtraPorProfessor(professor) {

    var listaAux = listaDeAulas.filter((element) => element.data().professor == professor);
    setListaFiltrada(listaAux); 
  }

  function filtraPorCampo() {}

  function filtraPorDiaDaSemana(diaDaSemana) {
    var listaAux = listaDeAulas.filter((element) => element.data().weekDay == diaDaSemana);
    setListaFiltrada(listaAux);
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
          <Row>
            <Col md={3} >
            <Button color="primary" onClick={()=> {
              setListaFiltrada(listaDeAulas)
            }}>Reset filtros</Button>
            </Col>
          </Row>
          <Row style={{paddingTop: "20px"}}>
          <Col md={2}>
                  <h5>Professor</h5>
                </Col>
                <Col md={6}>
                  <Input onChange={(e) => {setTreinador(e.target.value)}} value={trienador} type="select" name="select" id="professorInput">
                    {professores.map((elem,index) => {
                      return <option key={index}>{elem.nome}</option>
                    })}
                  </Input>
                </Col>
            <Col md={2}>
              <Button color="primary" onClick={() => {
                filtraPorProfessor(trienador)
              }}> Filtrar</Button>
            </Col>
          </Row>
          <Row style={{paddingTop: "20px"}}>
          <Col md={2}>
                  <h5>Dia da semana</h5>
                </Col>
                <Col md={6}>
                  <Input onChange={(e) => {setDiaDaSemana(document.getElementById("diaDaSmena").selectedIndex)}} 
                  value={weekday[diaDaSemana]} type="select" name="select" id="diaDaSmena">
                  {weekday.map((element, index) => {
                      return <option key={index}>{element}</option>
                    })}
                  </Input>
                </Col>
            <Col md={2}>
              <Button color="primary" onClick={() => {
                filtraPorDiaDaSemana(diaDaSemana)
              }}> Filtrar</Button>
            </Col>
          </Row>
          <Row style={{ marginTop: "40px", marginBottom: "10px" }}>
            <Col className="list-title" md={1}>
              Dia
            </Col>
            <Col className="list-title" md={2}>
              Horário
            </Col>
            <Col className="list-title" md={1}>
              Nr.A
            </Col>
            <Col className="list-title" md={1}>
              Nível
            </Col>
            <Col className="list-title" md={3}>
              Professor
            </Col>
            <Col className="list-title" md={2}>
              Campos
            </Col>
          </Row>
          {listaFiltrada.map((aulaSnap, index) => {
            var aula = aulaSnap.data()
            console.log(aula.weekDay)
            return (
              <Row
                key={index}
                className={index % 2 == 0 ? "myList-even" : "myList-odd"}
              >
                <Col md={1}>
                  <p>{weekday[aula.weekDay]}</p>
                </Col>
                <Col md={2}>
                  <p>{aula.horaInicial + "-" + aula.horaFinal}</p>
                </Col>
                <Col md={1}>{aula.alunos.length}</Col>
                <Col md={1}>{aula.nivel}</Col>
                <Col md={3}>
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
