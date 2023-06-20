import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Button, Col, Container, Input, Row } from "reactstrap"
import { removeAula, verListaDeAulas } from "services/aulas/aulas_services"
import firebase from "firebase/app"
import "firebase/firestore"
import { aulasCollection, convertCamps, diasDaSemana } from "services/consts"
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

  const [trienador, setTreinador] = useState(professores[0].nome)

  const [filtroProfessor, setFiltroProfessor] = useState([])
  const [filtroCampo, setfiltroCampo] = useState([])
  const [filtroDiaDaSemana, setfiltroDiaDaSemana] = useState([])

  const [listaFiltrada, setListaFiltrada] = useState([])

  var weekday = new Array(7)
  weekday[0] = " "
  weekday[1] = "Segunda"
  weekday[2] = "Terça"
  weekday[3] = "Quarta"
  weekday[4] = "Quinta"
  weekday[5] = "Sexta"
  weekday[6] = "Sábado"
  weekday[7] = "Domingo"

  async function verListaDeAulas(localizacao) {
   
    try {
      return firebase
        .firestore()
        .collection(aulasCollection)
        .where("localizacao", "==", localizacao)
        .onSnapshot(docsSnap => {
          console.log("atig")
          var listaDeAulasAux = []
          for (const element of docsSnap.docs) {
            listaDeAulasAux.push(element)
          }
         
          setListaDeAulas(listaDeAulasAux)
          setListaFiltrada(listaDeAulasAux)
        })
    } catch (e) {
      console.error(e)
      return null
    }
  }

  function filtraPorProfessor(professor) {
    setListaFiltrada([])
    var listaAux = [].concat([...listaDeAulas])
    console.log(professor)
    var listaAUx2 = []
    setListaFiltrada([])
    console.log("listaFiltrada")
    console.log(listaFiltrada)
    
    for (let index = 0; index < listaAux.length; index++) {
      if(listaAux[index].data().professor == professor){
      console.log(listaAux[index].data().professor)
      listaAUx2.push(listaAux[index])
      }
     
    }
    setListaFiltrada([])
    setListaFiltrada(listaAUx2)
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
            <Col className="list-title" md={2}>
              Professor
            </Col>
            <Col className="list-title" md={1}>
              Estado
            </Col>
            <Col className="list-title" md={2}>
              Campos
            </Col>
          </Row>
          {listaFiltrada.map((aulaSnap, index) => {
            
            return (
             
              <Row  key={aulaSnap.id + "row"}
              className={index % 2 == 0 ? "myList-even" : "myList-odd"}
                  
               
              >
                <Col md={1}>
                  <p>{weekday[aulaSnap.data().weekDay]}</p>
                </Col>
                <Col md={2}>
                  <p>{aulaSnap.data().horaInicial + "-" + aulaSnap.data().horaFinal}</p>
                </Col>
                <Col md={1}>{aulaSnap.data().alunos.length}</Col>
                <Col md={1}>{aulaSnap.data().nivel}</Col>
                <Col md={2}>
                  <p>{aulaSnap.data().professor}</p>
                </Col>
                <Col  md={1}>
                 {aulaSnap.data().isAtiva == true ? <p style={{color : "green"}}>Ativa</p> : <p style={{color : "red"}}>Inativa</p>  }
                </Col>
                <Col md={2}>
                  {aulaSnap.data().campos.map((elem, index) => {
                    return <p>{ convertCamps[elem] }</p>
                  })}
                </Col>
                <Col md={2}>
                  <RemoveModal key={aulaSnap.id + "alunos" + aulaSnap.data().alunos.length} 
                    titulo="Tem a certeza que deseja remover esta aula?"
                    collection={aulasCollection}
                    docID={listaFiltrada[index].id}
                    removeLabel={"Remover"}
                  ></RemoveModal>
                  <EditarAulasModal key={aulaSnap.id + "nivel" + aulaSnap.data().nivel}
                    aula={listaFiltrada[index].data()}
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
