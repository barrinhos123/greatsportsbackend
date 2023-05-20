import { element } from "prop-types"
import React, { useEffect, useState } from "react"
import DateTimePicker from "react-datetime-picker/dist/DateTimePicker"
import { useTranslation } from "react-i18next"
import { Button, Col, Container, Input, Label, Row } from "reactstrap"
import { pesquisarJogadoresByEmail } from "services/useres/jogadores_services"
import firebase from "firebase/app"
import "firebase/firestore"
import { merge } from "lodash"
import { useId } from "react"

function ProcurarUtilzadoresScreen() {
  const { t, i18n } = useTranslation()
  const [userId, setUserId] = useState(null)
  const [user, setUser] = useState(null)
  const [isUser, setIsUser] = useState(false)
  const [email, setEmail] = useState(null)
  const [numeroCC, setNumeroCC] = useState(null)
  const [nome, setNome] = useState(null)
  const [dataDeNa, setDataDeNa] = useState(null)
  const [seguro, setSeguro] = useState(null)
  const [bancoDeHoras, setBancoDeHoras] = useState(null)
  const [contrato, setContrato] = useState(null)
  const [historicoDeContratos, setHistoricoDecontratos] = useState([])
  const [historicoDePagaments, sethistoricoDePagaments] = useState([])

  const [classesEspeciais, setclassesEspeciais] = useState({})
  const [isValidDate, setIsValidDate] = useState(false)
  const [value, onChange] = useState(null)
  


  /* function listaDeContratos(contratos) {
    var listaAux = []
    for (var element of Object.keys(contratos)) {
      listaAux.push(contratos[element])
    }
    setHistoricoDecontratos(listaAux)
  } */

/*   function listaDePagamentos(pagamentos) {
    var listaAux = []
    console.log(pagamentos)
    for (var element of Object.keys(pagamentos)) {
      listaAux.push(pagamentos[element])
    }
    sethistoricoDePagaments(listaAux)
  } */

  /* async function createContrato(contratoP) {
    try {
      const id = firebase.firestore().collection(contratosCollection).doc().id
      var contrato = new Contrato()
      contrato = contratoP
      const contratoJson = contrato.toFirebaseJson()
      console.log(contratoJson)
  
      await firebase
        .firestore()
        .collection(contratosCollection)
        .doc(id)
        .set(contrato.toFirebaseJson())
  
      return id
    } catch (e) {
      console.error(e)
      console.log("Falha a criar contrato")
      return null
    }
  } */

  async function gravarAlteracoes(userId , seguro, classesEspeciais) {
    try {

      var myTimestamp = firebase.firestore.Timestamp.fromDate(seguro);

      firebase.firestore().collection("users").doc(userId).set({
        seguro: myTimestamp,
       
      }, {merge: true})
     
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
   
  }

  function showUser(value) {
    console.log(value.data())
    setUserId(value.id);
    setUser(value.data())
    const userAux = value.data()
    setclassesEspeciais(userAux.classesEspeciais)
    console.log(userAux.classesEspeciais)
    setEmail(userAux.email)
    setNome(userAux.primeiroNome + " " + userAux.ultimoNome)
    setNumeroCC(userAux.numeroDoCC)
    
    setDataDeNa(userAux.dataDeNascimento.toDate().toDateString())
    if(userAux.seguro != null && typeof userAux.seguro != "undefined"){
    setSeguro(userAux.seguro.toDate())
  } else {
    setSeguro(null)
  }
    setContrato(userAux.contrato)
    setBancoDeHoras(userAux.bancoDeHoras)
    /* listaDeContratos(userAux.historicoDeContratos) */
    /* listaDePagamentos(userAux.historicoDePagamentos) */
   
    setIsUser(true)
  }

  useEffect(() => {}, [isUser])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">{t("Procurar Jogadores")}</h6>
              </Col>
            </Row>
          </div>
          <Row style={{ alignItems: "center", paddingBottom: "20px" }}>
            <Col md={1}>
              <Label>Email</Label>
            </Col>
            <Col md={8}>
              <Input id="email" type="email" placeholder="Email"></Input>
            </Col>
            <Col md={3}>
              <Button
                onClick={() => {
                  var email = document.getElementById("email").value
                  pesquisarJogadoresByEmail(email).then(value => {
                    if (value != null) {
                      showUser(value)
                    } else {
                      alert("Não foi encontrado nenhum jogador com esse email")
                    }
                  })
                }}
                color="primary"
              >t 
                {" "}
                Pesquisar{" "}
              </Button>
            </Col>
          </Row>
          <Row style={{ alignItems: "center" }}>
            <Col md={1}>
              <Label>Nome</Label>
            </Col>
            <Col md={8}>
              <Input id="text" type="email" placeholder="Nome"></Input>
            </Col>
            <Col md={3}>
              <Button onClick={() => {}} color="primary">
                {" "}
                Pesquisar{" "}
              </Button>
            </Col>
          </Row>
          <Row
            hidden={isUser}
            style={{ paddingTop: "40px", paddingBottom: "40px" }}
          >
            <h4>Nenhum jogador para mostrar</h4>
          </Row>
          <div hidden={!isUser}>
            <Row style={{ paddingTop: "40px", paddingBottom: "20px" }}>
             <Col md={9}> <h4>{nome}</h4>    </Col>
             <Col md={3}><Button onClick={() => {
              gravarAlteracoes(userId,value ).then((value) => {
                if(value) {
                  alert("Alterações gravadas com sucesso")
                } else {
                  alert("Falhar a gravar altreçaões")
                }
              })
             }} color="primary">Gravar Alterações</Button></Col>
            </Row>
            <Row>
              <Col md={4}>
                <Label for="emailValue">Email</Label>
                <p>{email}</p>
              </Col>
              <Col md={4}>
                <Label for="emailValue">Data de Nascimento</Label>
                <p>{dataDeNa}</p>
              </Col>
              <Col md={4}>
               <Row> <Col md={3}><Label for="emailValue">Seguro</Label></Col><Col md={9}>
              
                 </Col></Row>
                {seguro == null ? (
                  <p>  <DateTimePicker
                  disableClock={true}
                  
                  onChange={value => {
                    console.log(value)
                    onChange(value)
                    
                  }}
                  value={value}
                /></p>
                ) : (
                  <p>{"Válido até: " + seguro}</p>
                )}
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Label for="emailValue">Banco de horas</Label>
                <Input value={bancoDeHoras} disabled></Input>
              </Col>
              <Col md={4}>
                <Label for="emailValue">Contrato</Label>
                <p>{contrato}</p>
              </Col>
              <Col md={4}>
                <Label for="classeJogador">Classes</Label>
                <Input
                    onChange={() => {
                     
                    }}
                    type="select"
                    name="select"
                    id="weekdaySelect"
                  >
                    <option>Todos</option>
                    <option>Estudantes</option>
                    <option>Parceiros</option>
                  </Input>
              </Col>
            </Row>
            <Row>
            <Col md={4}>
                <Label for="classes">Classes Especiais</Label>
                <Input
                    onChange={() => {
                     
                    }}
                    type="select"
                    name="select"
                    id="weekdaySelect"
                  >
                    <option></option>
                    <option>Crédito Agrícola</option>
                   
                  </Input>
              </Col>
              <Col md={4}>
                <Label for="emailValue">Número CC</Label>
                <p>{numeroCC}</p>
              </Col>
            </Row>
            {/*  <Row style={{ paddingTop: "40px" }}>
              <h4>Histórico de Contratos</h4>
              {historicoDeContratos.map((elment, idenx) => {})}
            </Row>

            <h4 style={{ paddingTop: "40px" }}>Histórico de Pagamentos</h4>
            <Row>

            </Row>
            {historicoDePagaments.map((element, index) => {
              return (
                <Row
                  key={index}
                  className={index % 2 == 0 ? "myList-even" : "myList-odd"}
                ></Row>
              )
            })} */}
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default ProcurarUtilzadoresScreen
