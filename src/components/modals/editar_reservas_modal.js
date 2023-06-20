import { ProcuraReserva } from "models/reserva";
import React, { useEffect, useState } from "react"
import { Check } from "react-bootstrap-icons";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap"
import { convertCamps } from "services/consts";
import { checkIfUserExists, editarDadosReserva, retornaCamposIndisponíveisNaHora } from "services/reservas/reservas_services"

function EditarReservasModal(props) {
  const [isOpen, setIsOpen] = useState(false)

  const [campo,setCampo] = useState(props.reserva.campo);
  const [camposDisponiv, setCamposDisponiv] = useState([])
  const numeroDeCampos = 6
  const [campoEscolhido, setCampoEscolhido] = useState(props.reserva.campo)

  function removeCamposRepetidos(campoosInsdis) {
    console.log("A localizacao dos campos é :")
    console.log(props.reserva.localizacao);
    var listaDeCampos = []
    var novaLista = []
    for (var i = 1; i <= numeroDeCampos; i++) {
      var stringAux = "Campo " + i
      if (campoosInsdis.includes(stringAux) == false) {
        listaDeCampos.push(stringAux)
      }
    }
    setCamposDisponiv(listaDeCampos)
  }
  
  const [email1, setEmail1] = useState(props.reserva.jogador1estado.email)
  const [email2, setEmail2] = useState(props.reserva.jogador2estado.email)
  const [email3, setEmail3] = useState(props.reserva.jogador3estado.email)
  const [email4, setEmail4] = useState(props.reserva.jogador4estado.email)

  const [nome1, setNome1] = useState(props.reserva.jogador1estado.nome)
  const [nome2, setNome2] = useState(props.reserva.jogador2estado.nome)
  const [nome3, setNome3] = useState(props.reserva.jogador3estado.nome)
  const [nome4, setNome4] = useState(props.reserva.jogador4estado.nome)

  const [cc1, setCC1] = useState(props.reserva.jogador1estado.cc)
  const [cc2, setCC2] = useState(props.reserva.jogador2estado.cc)
  const [cc3, setCC3] = useState(props.reserva.jogador3estado.cc)
  const [cc4, setCC4] = useState(props.reserva.jogador4estado.cc)

  const [colorBTN1 , setColorBTN1] = useState("secondary")
  const [colorBTN2 , setColorBTN2] = useState("secondary")
  const [colorBTN3 , setColorBTN3] = useState("secondary")
  const [colorBTN4 , setColorBTN4] = useState("secondary")

  async function emailCheck(email, ccId) {
    var primeiroNome 
    var ultimoNome
    var isEmail1 = await checkIfUserExists(email)

    if(Object.keys(isEmail1).length == 0){
      alert('O email não está registado')
      return false
    }
    if(typeof isEmail1.primeiroNome != "undefined") {
      primeiroNome = isEmail1.primeiroNome + " "
    }
    if(typeof isEmail1.ultimoNome != "undefined") {
      ultimoNome = isEmail1.ultimoNome
    }
    if(typeof isEmail1.numeroDoCC != "undefined") {
      setCC1(isEmail1.numeroDoCC)
    } else {
      document.getElementById(ccId).value = null
    }
    setNome1(primeiroNome + ultimoNome)

    if(typeof isEmail1.primeiroNome != "undefined" && typeof isEmail1.ultimoNome != "undefined" && typeof isEmail1.numeroDoCC != "undefined" ) {
      return true
    } 
    else {
      return false;
    }
  }

  async function emailCheck2(email, ccId) {
    var primeiroNome 
    var ultimoNome
    var isEmail1 = await checkIfUserExists(email)

    if(Object.keys(isEmail1).length == 0){
      alert('O email não está registado')
      return false
    }
    if(typeof isEmail1.primeiroNome != "undefined") {
      primeiroNome = isEmail1.primeiroNome + " "
    }
    if(typeof isEmail1.ultimoNome != "undefined") {
      ultimoNome = isEmail1.ultimoNome
    }
    if(typeof isEmail1.numeroDoCC != "undefined") {
      setCC2(isEmail1.numeroDoCC)
    } else {
      document.getElementById(ccId).value = null
    }
    setNome2(primeiroNome + ultimoNome)

    if(typeof isEmail1.primeiroNome != "undefined" && typeof isEmail1.ultimoNome != "undefined" && typeof isEmail1.numeroDoCC != "undefined" ) {
      return true
    } 
    else {
      return false;
    }
  }

  async function emailCheck3(email, ccId) {
    var primeiroNome 
    var ultimoNome
    var isEmail1 = await checkIfUserExists(email)

    if(Object.keys(isEmail1).length == 0){
      alert('O email não está registado')
      return false
    }
    if(typeof isEmail1.primeiroNome != "undefined") {
      primeiroNome = isEmail1.primeiroNome + " "
    }
    if(typeof isEmail1.ultimoNome != "undefined") {
      ultimoNome = isEmail1.ultimoNome
    }
    if(typeof isEmail1.numeroDoCC != "undefined") {
      setCC3(isEmail1.numeroDoCC)
    } else {
      document.getElementById(ccId).value = null
    }
    setNome3(primeiroNome + ultimoNome)

    if(typeof isEmail1.primeiroNome != "undefined" && typeof isEmail1.ultimoNome != "undefined" && typeof isEmail1.numeroDoCC != "undefined" ) {
      return true
    } 
    else {
      return false;
    }
  }

  async function emailCheck4(email, ccId) {
    var primeiroNome 
    var ultimoNome
    var isEmail1 = await checkIfUserExists(email)

    if(Object.keys(isEmail1).length == 0){
      alert('O email não está registado')
      return false
    }
    if(typeof isEmail1.primeiroNome != "undefined") {
      primeiroNome = isEmail1.primeiroNome + " "
    }
    if(typeof isEmail1.ultimoNome != "undefined") {
      ultimoNome = isEmail1.ultimoNome
    }
    if(typeof isEmail1.numeroDoCC != "undefined") {
      setCC4(isEmail1.numeroDoCC)
    } else {
      document.getElementById(ccId).value = null
    }
    setNome4(primeiroNome + ultimoNome)

    if(typeof isEmail1.primeiroNome != "undefined" && typeof isEmail1.ultimoNome != "undefined" && typeof isEmail1.numeroDoCC != "undefined" ) {
      return true
    } 
    else {
      return false;
    }
  }

  useEffect(() => {
   
  },)
  return (
    <React.Fragment>
      <Button
        onClick={() => {
          setIsOpen(!isOpen)
        }}
        color="primary"
      >
        Editar Reserva
      </Button>
      <Modal
        isOpen={isOpen}
        toggle={() => {
          setIsOpen(!isOpen)
        }}
      >
        <ModalHeader
          toggle={() => {
            setIsOpen(!isOpen)
          }}
        >
          Editar Reserva
        </ModalHeader>
        <ModalBody>
         
          <Form style={{ paddingBottom: "20px" }}>
          <h5>Jogador 1</h5>
          <FormGroup>
              <Row>
                <Col md={3}>
                  <p>Email</p>
                </Col>
                <Col md={7}>
                  <Input
                    value={email1}
                    onChange={e => {
                      setEmail1(e.target.value)
                    }}
                    type="email"
                    name="email1Input"
                    id="email1Input"
                  />
                </Col>
                <Col md={2}>
                          <Button id="ckeckButton1" color={colorBTN1} onClick={async() => {
                            var check = await emailCheck(document.getElementById("email1Input").value,"cc1Input" )
                            if(check) {
                              setColorBTN1("primary")
                            } else {
                              setColorBTN1("secondary")
                            }
                          }} >
                            <Check></Check>
                          </Button>
                          </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col md={3}>
                  <p>Nome</p>
                </Col>
                <Col md={9}>
                  <Input
                    value={nome1}
                    onChange={e => {
                      setNome1(e.target.value)
                    }}
                    type="text"
                    name="nome1Input"
                    id="nome1Input"
                  />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col md={3}>
                  <p>CC</p>
                </Col>
                <Col md={9}>
                  <Input
                    value={cc1}
                    onChange={e => {
                      setCC1(e.target.value)
                    }}
                    type="number"
                    name="cc1Input"
                    id="cc1Input"
                  />
                </Col>
                
              </Row>
              
            </FormGroup>
            <h5>Jogador 2</h5>
            <FormGroup>
              <Row>
                <Col md={3}>
                  <p>Email</p>
                </Col>
                <Col md={7}>
                  <Input
                    value={email2}
                    onChange={e => {
                      setEmail2(e.target.value)
                    }}
                    type="email"
                    name="email2Input"
                    id="email2Input"
                  />
                </Col>
                <Col md={2}>
                    <Button id="ckeckButton2" color={colorBTN2} onClick={async() => {
                    var check = await emailCheck2(document.getElementById("email2Input").value,"cc2Input" )
                    if(check) {
                        setColorBTN2("primary")
                    } else {
                        setColorBTN2("secondary")
                    }
                    }} >
                <Check></Check>
                </Button>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col md={3}>
                  <p>Nome</p>
                </Col>
                <Col md={9}>
                  <Input
                    value={nome2}
                    onChange={e => {
                      setNome2(e.target.value)
                    }}
                    type="text"
                    name="nome2Input"
                    id="nome2Input"
                  />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col md={3}>
                  <p>CC</p>
                </Col>
                <Col md={9}>
                  <Input
                    value={cc2}
                    onChange={e => {
                      setCC2(e.target.value)
                    }}
                    type="number"
                    name="cc2nput"
                    id="cc2Input"
                  />
                </Col>
              </Row>
            </FormGroup>
            <h5>Jogador 3</h5>
            <FormGroup>
              <Row>
                <Col md={3}>
                  <p>Email</p>
                </Col>
                <Col md={7}>
                  <Input
                    value={email3}
                    onChange={e => {
                      setEmail3(e.target.value)
                    }}
                    type="email"
                    name="email3Input"
                    id="email3Input"
                  />
                </Col>
                <Col md={2}>
                    <Button id="ckeckButton3" color={colorBTN3} onClick={async() => {
                    var check = await emailCheck3(document.getElementById("email3Input").value,"cc3Input" )
                    if(check) {
                        setColorBTN3("primary")
                    } else {
                        setColorBTN3("secondary")
                    }
                    }} >
                <Check></Check>
                </Button>
                </Col>
              </Row>
              
            </FormGroup>
            <FormGroup>
              <Row>
                <Col md={3}>
                  <p>Nome</p>
                </Col>
                <Col md={9}>
                  <Input
                    value={nome3}
                    onChange={e => {
                      setNome3(e.target.value)
                    }}
                    type="text"
                    name="nome3Input"
                    id="nome3Input"
                  />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col md={3}>
                  <p>CC</p>
                </Col>
                <Col md={9}>
                  <Input
                    value={cc3}
                    onChange={e => {
                      setCC3(e.target.value)
                    }}
                    type="number"
                    name="cc3Input"
                    id="cc3Input"
                  />
                </Col>
              </Row>
            </FormGroup>
            <h5>Jogador 4</h5>
            <FormGroup>
              <Row>
                <Col md={3}>
                  <p>Email</p>
                </Col>
                <Col md={7}>
                  <Input
                    value={email4}
                    onChange={e => {
                      setEmail4(e.target.value)
                    }}
                    type="email"
                    name="email4Input"
                    id="email4Input"
                  />
                </Col>
                <Col md={2}>
                    <Button id="ckeckButton4" color={colorBTN4} onClick={async() => {
                    var check = await emailCheck4(document.getElementById("email4Input").value,"cc4Input" )
                    if(check) {
                        setColorBTN4("primary")
                    } else {
                        setColorBTN4("secondary")
                    }
                    }} >
                <Check></Check>
                </Button>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col md={3}>
                  <p>Nome</p>
                </Col>
                <Col md={9}>
                  <Input
                    value={nome4}
                    onChange={e => {
                      setNome4(e.target.value)
                    }}
                    type="text"
                    name="nome4Input"
                    id="nome4Input"
                  />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col md={3}>
                  <p>CC</p>
                </Col>
                <Col md={9}>
                  <Input
                    value={cc4}
                    onChange={e => {
                      setCC4(e.target.value)
                    }}
                    type="number"
                    name="cc4Input"
                    id="cc4Input"
                  />
                </Col>
              </Row>
            </FormGroup>
        <h5>Campos</h5>
        <Row style={{ paddingBottom: "20px"}}>Campo da reserva: {campo}</Row>
        <Button style={{marginBottom: "20px"}} color="primary" onClick={async() => {
             var procuraReserva = new ProcuraReserva()
             procuraReserva.duracaoDaReserva = props.reserva.duracao
             procuraReserva.horaDaReserva = props.reserva.horaIncial.toDate()
             procuraReserva.localizacao = props.reserva.localizacao
             console.log('BP0')
             var camposs = await retornaCamposIndisponíveisNaHora(
               procuraReserva
             )
             removeCamposRepetidos(camposs)
        }}>Mostrar campos disponíveis</Button>

        <Row>
        <Row>
                        {camposDisponiv.map((value, index) => {
                          return (
                            <Col
                              key={index}
                              md={4}
                              style={{ paddingBottom: "10px" }}
                            >
                              <Button
                                outline={campoEscolhido == value ? false : true}
                                color="primary"
                                onClick={() => {
                                  if (campoEscolhido != value) {
                                    setCampoEscolhido(value)
                                  } else {
                                    setCampoEscolhido(null)
                                  }
                                }}
                              >
                                { convertCamps[value]}
                              </Button>
                            </Col>
                          )
                        })}
                      </Row>
        </Row>
          </Form>
          
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={async() => {
                

                  var json = {}
                json.jogador1estado = {}
                json.jogador2estado = {}
                json.jogador3estado = {}
                json.jogador4estado = {}
                json.campo = campoEscolhido;
                json.jogador1estado.cc = cc1.toString()
              json.jogador1estado.nome = nome1
                json.jogador1estado.email = email1
                json.jogador2estado.cc = cc2.toString()
                json.jogador2estado.nome = nome2
                json.jogador2estado.email = email2
                json.jogador3estado.cc = cc3.toString()
                json.jogador3estado.nome = nome3
                json.jogador3estado.email = email3
                json.jogador4estado.cc = cc4.toString()
                json.jogador4estado.nome = nome4
                json.jogador4estado.email = email4
                json.novaListaDeJogadores = [email1,email2,email3,email4]

                var res = await editarDadosReserva(props.reservaID, json.jogador1estado,json.jogador2estado,json.jogador3estado,json.jogador4estado, json.campo, json.novaListaDeJogadores)
                if(res) {
                    alert('Dados alterados com sucesso')
                    setIsOpen(!isOpen)
                } else {
                    alert('Erro a alterar dados')
                }   
            }}
            color="primary"
          >
            Editar
          </Button>
          <Button
            onClick={() => {
                
              setIsOpen(!isOpen)
            }}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  )
}

export default EditarReservasModal
