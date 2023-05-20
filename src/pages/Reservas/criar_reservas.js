import DatePickerComp from "components/Common/DatePicker"
import React, { useEffect, useState } from "react"
import DatePicker from "react-date-picker"
import MetaTags from "react-meta-tags"
import { useTranslation } from "react-i18next"
import {
  Col,
  Container,
  Row,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Label,
  FormGroup,
  Input,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap"
import DateTimePicker from "react-datetime-picker"
import {
  checkIfUserExists,
  criarNovaReserva,
  gerarMBwayPayment,
  retornaCamposIndisponíveisNaHora,
} from "services/reservas/reservas_services"
import { Estado, ProcuraReserva, Reserva } from "models/reserva"
import {
  addDessconto,
  escolheOPrecoQueOUserVaiPagar,
} from "services/descontos/descontos_services"
import { Desconto } from "models/desconto"
import { useDispatch, useSelector } from "react-redux"
import { selectdescontos, setdescontos } from "store/descontos/descontos_reducer"
import { selectclubeid, setclubeid } from "store/localizacao/clube_id_reducer"
import AdicionarPagamentosModal from "components/modals/valor_do_pagamento_modal"
import { selectlocalizacao, setlocalizacao } from "store/localizacao/localizacao_reducer"
import { setclasses } from "store/localizacao/classes_reducer"
import { settreinadores } from "store/treinadores/treinadores_reducer"

const CriarReservas = () => {
  function calcMaxDate(date) {
    date.setDate(date.getDate() + 15)
    return date
  }

  var listaDeDescontosStrgf = useSelector(selectdescontos)
  var clubeID = useSelector(selectclubeid)
  var localizacao = useSelector(selectlocalizacao);

  const { t, i18n } = useTranslation()
  const [tempoDaReserva, setTempoDaReserva] = useState(60)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(true)
  const [textoDeErro, setTextoDeErro] = useState("")
  const [camposDisponiv, setCamposDisponiv] = useState([])
  const [camposIndsisponiv, setCamposIndisponiv] = useState([])
  const [campoEscolhido, setCampoEscolhido] = useState(null)
  const [pagamento1, setPagamento1] = useState(null)
  const [dividePagamento1, setDividePagamento1] = useState(true)
  const [pagamento2, setPagamento2] = useState(null)
  const [dividePagamento2, setDividePagamento2] = useState(false)
  const [pagamento3, setPagamento3] = useState(null)
  const [dividePagamento3, setDividePagamento3] = useState(false)
  const [pagamento4, setPagamento4] = useState(null)
  const [dividePagamento4, setDividePagamento4] = useState(false)
  const numeroDeCampos = 6

  const [isValidDate, setIsValidDate] = useState(false)
  const [value, onChange] = useState(new Date())
  const minDate = new Date()
  const maxDate = calcMaxDate(new Date())

  const [menu, setMenu] = useState(false)

  const toggle = () => {
    setMenu(!menu)
  }

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [listaDeAtletasComValorAPagar, setlistaDeAtletasComValorAPagar] =
    useState([{ valorFinalDaReserva: 0 }])

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible)
  }

  function removeCamposRepetidos(campoosInsdis) {
    console.log("A localizacao dos campos é :")
    console.log(localizacao);
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
  //Remover se nao for necessário
  //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
  /* function addCampos() {
    var listaDeCampos = []
    for (var i = 1; i <= numeroDeCampos; i++) {
      var stringAux = "Campo " + i
      listaDeCampos.push(stringAux)
    }
    setCamposDisponiv(listaDeCampos)
  } */

  function addEmailsAPagar() {
    var listaDeEmailsAPagar = []
    var email1 = document.getElementById("email1").value
    listaDeEmailsAPagar.push(email1)
    if (dividePagamento2) {
      var email2 = document.getElementById("email2").value
      listaDeEmailsAPagar.push(email2)
    }
    if (dividePagamento3) {
      var email3 = document.getElementById("email3").value
      listaDeEmailsAPagar.push(email3)
    }
    if (dividePagamento4) {
      var email4 = document.getElementById("email4").value
      listaDeEmailsAPagar.push(email4)
    }
    return listaDeEmailsAPagar
  }

  function checkaFormValidate() {
    console.log("checking form validation")
    var asd = document.getElementById("form").checkValidity()
    if (!asd) {
      setErrorMessage(false)
      setTextoDeErro("Todos os campos tem que ser preenchidos")
      return false
    } else {
      setErrorMessage(true)
      return true
    }
  }

  function checkaSeQuemPagaTemMetodoSelecionado() {
    console.log("checkaSeQuemPagaTemMetodoSelecionado")
    if (pagamento1 == null) {
      document.getElementById("mensagemDeErro").innerHTML =
        "O Jogador 1 tem que escolher um método de pagamento"
      setErrorMessage(false)
      return false
    }
    if (dividePagamento2 == true && pagamento2 == null) {
      document.getElementById("mensagemDeErro").innerHTML =
        "O Jogador 2 tem que escolher um método de pagamento"
      setErrorMessage(false)
      return false
    }
    if (dividePagamento3 == true && pagamento3 == null) {
      document.getElementById("mensagemDeErro").innerHTML =
        "O Jogador 3 tem que escolher um método de pagamento"
      setErrorMessage(false)
      return false
    }
    if (dividePagamento4 == true && pagamento4 == null) {
      document.getElementById("mensagemDeErro").innerHTML =
        "O Jogador 4 tem que escolher um método de pagamento"
      setErrorMessage(false)
      return false
    }
    return true
  }

  async function checkaSeTodosOsEmailsExistem() {
    console.log("A chekar se todos os emails existem")
    var listaAux = []
    var listaDeErros = []
    var email1 = document.getElementById("email1").value
    var email2 = document.getElementById("email2").value
    var email3 = document.getElementById("email3").value
    var email4 = document.getElementById("email4").value
    var isEmail1 = await checkIfUserExists(email1)
    var isEmail2 = await checkIfUserExists(email2)
    var isEmail3 = await checkIfUserExists(email3)
    var isEmail4 = await checkIfUserExists(email4)
    console.log(isEmail1)
    console.log(isEmail2)
    console.log(isEmail3)
    console.log(isEmail4)
    listaAux.push(isEmail1)
    listaAux.push(isEmail2)
    listaAux.push(isEmail3)
    listaAux.push(isEmail4)

    
    
    console.log("A checkar se retorna erro ou não")
    for (let index = 0; index < listaAux.length; index++) {
      if ( typeof listaAux[index].userID == "undefined" || listaAux[index].userID == null ) {
        if(index == 0 ) {
        var jogador = "Jogador " + (index + 1) + " "
        alert("O jogador 1 tem que estar registado")
        listaDeErros.push(jogador)
        }
        if(index == 1 /* && pagamento2 == 'Saldo' */) {
          var jogador = "Jogador " + (index + 1) + " "
          alert("O jogador 2 tem que estar registado")
          listaDeErros.push(jogador)
          }
        if(index == 2/*  && pagamento3 == 'Saldo' */) {
            var jogador = "Jogador " + (index + 1) + " "
            alert("O jogador 3 tem que estar registado")
            listaDeErros.push(jogador)
            }
        if(index == 3 /* && pagamento4 == 'Saldo' */) {
          var jogador = "Jogador " + (index + 1 )+ " "
          alert("O jogador 4 tem que estar registado")
          listaDeErros.push(jogador)
          }
      }
    }

    
    if (listaDeErros.length == 0) {
      return listaAux
    } else {
      var acc = ""
      var erro2 = "não tem conta na aplicação"
      listaDeErros.forEach(element => {
        acc = acc + element
      })
      acc = acc + erro2
      document.getElementById("mensagemDeErro").innerHTML = acc
      setErrorMessage(false)
      return null
    }
  }

  function calculaValorQueCadaJogadorTemQuePagar(listaDeAtletComValorAPagar) {
    var valorTotalPagar = 0
    var valorDoCriadorDaReserva = 0

    for (let index = 0; index < listaDeAtletComValorAPagar.length; index++) {
      valorTotalPagar += listaDeAtletComValorAPagar[index].valorAPagar
    }
    listaDeAtletComValorAPagar[0].valorFinalDaReserva = valorTotalPagar
    listaDeAtletComValorAPagar[0].valorTotalPagar = valorTotalPagar
    valorDoCriadorDaReserva = valorTotalPagar

    for (let index2 = 1; index2 < listaDeAtletComValorAPagar.length; index2++) {
      if (listaDeAtletComValorAPagar[index2].temQuePagar) {
        listaDeAtletComValorAPagar[index2].valorTotalPagar =
          listaDeAtletComValorAPagar[index2].valorAPagar
        valorDoCriadorDaReserva -=
          listaDeAtletComValorAPagar[index2].valorAPagar
      } else {
        listaDeAtletComValorAPagar[index2].valorTotalPagar = 0
      }
    }
    listaDeAtletComValorAPagar[0].valorTotalPagar = valorDoCriadorDaReserva
    return listaDeAtletComValorAPagar
  }

  function criaValoresDareserva(listaDeAtletaComValorAPagar) {
    var reserva = new Reserva()
    var estado1 = new Estado()
    var estado2 = new Estado()
    var estado3 = new Estado()
    var estado4 = new Estado()

    estado1.email = listaDeAtletaComValorAPagar[0].email
    estado1.estado = "Pendente"
    estado1.nome =
      listaDeAtletaComValorAPagar[0].primeiroNome +
      " " +
      listaDeAtletaComValorAPagar[0].ultimoNome
    estado1.numeroCC = document.getElementById("cc1").value
    estado1.numertl = document.getElementById("nr1").value
    estado1.tipo = pagamento1
    estado1.valor = listaDeAtletaComValorAPagar[0].valorTotalPagar

    estado2.email = document.getElementById("email2").value
    estado2.estado = "Pendente"
    estado2.nome =
      listaDeAtletaComValorAPagar[1].primeiroNome +
      " " +
      listaDeAtletaComValorAPagar[1].ultimoNome
    estado2.numeroCC = document.getElementById("cc2").value
    estado2.numertl = document.getElementById("nr2").value
    estado2.tipo = pagamento2
    estado2.valor = listaDeAtletaComValorAPagar[1].valorTotalPagar

    estado3.email = document.getElementById("email3").value
    estado3.estado = "Pendente"
    estado3.nome =
      listaDeAtletaComValorAPagar[2].primeiroNome +
      " " +
      listaDeAtletaComValorAPagar[2].ultimoNome
    estado3.numeroCC = document.getElementById("cc3").value
    estado3.numertl = document.getElementById("nr3").value
    estado3.tipo = pagamento3
    estado3.valor = listaDeAtletaComValorAPagar[2].valorTotalPagar

    estado4.email = document.getElementById("email4").value
    estado4.estado = "Pendente"
    estado4.nome =
      listaDeAtletaComValorAPagar[3].primeiroNome +
      " " +
      listaDeAtletaComValorAPagar[3].ultimoNome
    estado4.numeroCC = document.getElementById("cc4").value
    estado4.numertl = document.getElementById("nr4").value
    estado4.tipo = pagamento4
    estado4.valor = listaDeAtletaComValorAPagar[3].valorTotalPagar

    reserva.estado1 = estado1
    reserva.estado2 = estado2
    reserva.estado3 = estado3
    reserva.estado4 = estado4

    reserva.isUpdated = false
    reserva.duracaoDaReserva = document.getElementById("selectTime").value
    reserva.localizacao = localizacao
    reserva.nomeDoCampo = campoEscolhido
    reserva.userID = listaDeAtletaComValorAPagar[0].userID
    reserva.valorTotal = listaDeAtletaComValorAPagar[0].valorFinalDaReserva
    reserva.jogadores = [
      estado1.email,
      estado2.email,
      estado3.email,
      estado4.email,
    ]
    /* reserva.createdAt= createdAt,
    reserva.expiresIn= expiresIn,
    reserva.duracao=  "90",
    reserva.campo= reserva.nomeDoCampo,
    reserva.horaIncial= horarioTimeStamp,
    reserva.horaFinal= horarioFinalTimeStamp,
    reserva.userID= reserva.userID,
    reserva.estado=
    valorTotalPagoAux == reserva.valorTotal ? 'Confirmada' : 'Pendente',
    reserva.convidados= [],
    reserva.valorTotal= reserva.valorTotal,
    reserva.vavlorTotalPago= valorTotalPagoAux,
    reserva.localizacao= reserva.localizacao */
    console.log(reserva)
    return reserva
  }

  function adicionaNomeECCaosUsersSemCOnta(mapDosValoresDosUsersVar) {
    for (let index = 0; index < mapDosValoresDosUsersVar.length; index++) {
      if(mapDosValoresDosUsersVar[index].userID == null ) {
        if(index == 0) {
          mapDosValoresDosUsersVar[index].primeiroNome = document.getElementById("nome1").value
        mapDosValoresDosUsersVar[index].ultimoNome = ''
        mapDosValoresDosUsersVar[index].numeroDoCC = document.getElementById("cc1").value
        }
        if(index == 1) {
        mapDosValoresDosUsersVar[index].primeiroNome = document.getElementById("nome2").value
        mapDosValoresDosUsersVar[index].ultimoNome = ''
        mapDosValoresDosUsersVar[index].numeroDoCC = document.getElementById("cc2").value
        }
        if(index == 2) {
          mapDosValoresDosUsersVar[index].primeiroNome = document.getElementById("nome3").value
        mapDosValoresDosUsersVar[index].ultimoNome = ''
        mapDosValoresDosUsersVar[index].numeroDoCC = document.getElementById("cc3").value
        }
        if(index == 3) {
          mapDosValoresDosUsersVar[index].primeiroNome = document.getElementById("nome4").value
        mapDosValoresDosUsersVar[index].ultimoNome = ''
        mapDosValoresDosUsersVar[index].numeroDoCC = document.getElementById("cc4").value
        }
         
      }
    }
    return mapDosValoresDosUsersVar;
  }

  const [mapDosValoresDosUsers, setMapDosValoresDosUsers] = useState([{}])

  async function calculaPreco() {
    setIsLoading(true)
    if (checkaFormValidate()) {
      if (checkaSeQuemPagaTemMetodoSelecionado()) {
        var mapDosValoresDosUsersVar = await checkaSeTodosOsEmailsExistem()
        if(mapDosValoresDosUsersVar == null) {
          setIsLoading(false)
          return null;
        }
        setMapDosValoresDosUsers(mapDosValoresDosUsersVar)
        if (mapDosValoresDosUsers != null) {
          var horaInicial = value.getHours() + ":" + value.getMinutes()
          var dia = "Semana"
          if (value.getDay() == 0 || value.getDay() == 6) {
            dia = "Fins de semana e Feriados"
          } else {

          }
          var listaDeDescontos = JSON.parse(listaDeDescontosStrgf)
          var listaDeDividePagamentos = [
            dividePagamento1,
            dividePagamento2,
            dividePagamento3,
            dividePagamento4,
          ]
          var listaDeAtletaComValorAPagar = escolheOPrecoQueOUserVaiPagar(
            
            horaInicial,
            listaDeDescontos,
            dia,
            mapDosValoresDosUsersVar,
            listaDeDividePagamentos,
          )

          listaDeAtletaComValorAPagar = calculaValorQueCadaJogadorTemQuePagar(
            listaDeAtletaComValorAPagar
          )
          console.log("listaDeAtletaComValorAPagar")
          console.log(listaDeAtletaComValorAPagar);
          listaDeAtletaComValorAPagar = adicionaNomeECCaosUsersSemCOnta(listaDeAtletaComValorAPagar)
          setlistaDeAtletasComValorAPagar(listaDeAtletaComValorAPagar)

          toggleModal()
          setIsLoading(false)
        } else {
          setIsLoading(false)
          return null
        }
      } else {
        setIsLoading(false)
        return null
      }
    } else {
      setIsLoading(false)
      return null
    }

    if (value == null) {
    }
  }

  const rendera = () => {
    return (
      <Modal isOpen={isModalVisible} toggle={() => toggleModal()}>
        <ModalHeader toggle={() => toggleModal()}>Preço a pagar</ModalHeader>
        <ModalBody>
          <Container fluid>
            <Row>
              <Col md={2} xs={2}>
                <h5> Valor </h5>
              </Col>
              <Col md={10} xs={10}>
                <h5> Jogador</h5>
              </Col>
            </Row>
            {listaDeAtletasComValorAPagar.map((elemn, index) => {
              return (
                <Row key={index}>
                  <Col md={2} xs={2}>
                    <h6>{elemn.valorTotalPagar + "€"}</h6>
                  </Col>
                  <Col md={10} xs={10}>
                    {elemn.primeiroNome + " " + elemn.ultimoNome}
                  </Col>
                </Row>
              )
            })}
            <Row style={{ paddingTop: "20px" }}>
              <Col>
                <span>
                  Valor total da reserva:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {listaDeAtletasComValorAPagar[0].valorFinalDaReserva + "€"}
                  </span>
                </span>
              </Col>
            </Row>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              var newReserva = criaValoresDareserva(
                listaDeAtletasComValorAPagar
              )
              newReserva.horaDaReserva = value
              newReserva.jogadores = []
              console.log(newReserva)
              criarNovaReserva(newReserva, mapDosValoresDosUsers).then(v => {
                setIsModalVisible(!isModalVisible)
              })
            }}
            color="primary"
          >
            Criar Reserva
          </Button>
          <Button
            onClick={() => {
              setIsModalVisible(false)
            }}
            color="secondary"
          >
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    )
  }

  useEffect(() => {}, [])

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
                <h6 className="page-title">{t("Reservas")}</h6>

                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">
                    {t("Adicionar nova Reserva")}
                  </li>
                </ol>
              </Col>
            </Row>
            <Row>
             
              <Col md={6}>
                <Row>
                <Col md={6}>
                  <Card>
                    <CardBody>
                    <CardTitle>
                      Duração do jogo
                    </CardTitle>
                    <CardText>
                    <Label for="exampleSelect">Select</Label>
                    <Input onChange={() => {
                      console.log(document.getElementById("selectTime").value)
                    }} type="select" name="select" id="selectTime">
                      <option>60</option>
                      <option>90</option>
                      <option>120</option>
                    </Input>
                    </CardText>
                    </CardBody>
                  </Card>
                </Col>
                  <Col md={6}>
                <Card>
                  <CardBody>
                    <CardTitle>Horário do Jogo</CardTitle>
                    <DateTimePicker
                      minDate={minDate}
                      maxDate={maxDate}
                      disableClock={true}
                      onChange={value => {
                        console.log(value)
                        onChange(value)
                        setCamposDisponiv([])
                        if (value != null) {
                          if (
                            (value.getMinutes() === 30 ||
                              value.getMinutes() === 0) &&
                            value.getHours() >= 6 &&
                            value.getTime() > minDate &&
                            value.getTime() < maxDate
                          ) {
                            setIsValidDate(true)
                          } else {
                            setIsValidDate(false)
                          }
                        }
                      }}
                      value={value}
                    />
                    {isValidDate ? (
                      <p></p>
                    ) : (
                      <p style={{ color: "#CC2222" }}>Data Inválida</p>
                    )}
                    <Button
                      color="primary"
                      onClick={async () => {
                        var copiedDate = new Date(value.getTime())
                        var procuraReserva = new ProcuraReserva()
                        procuraReserva.duracaoDaReserva = document.getElementById("selectTime").value
                        procuraReserva.horaDaReserva = copiedDate
                        procuraReserva.localizacao = localizacao
                        console.log('BP0')
                        var camposs = await retornaCamposIndisponíveisNaHora(
                          procuraReserva
                        )
                        removeCamposRepetidos(camposs)
                      }}
                      disabled={!isValidDate}
                    >
                      {" "}
                      Pesquisar
                    </Button>
                  </CardBody>
                </Card>
                </Col>
               
                </Row>
              </Col>
              <Col md={6}>
                <Card>
                  <CardBody>
                    <CardTitle>Campos disponíveis</CardTitle>
                    <CardText>
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
                                {value}
                              </Button>
                            </Col>
                          )
                        })}
                      </Row>
                    </CardText>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Form id="form">
              <Row>
                <h6>Equipa 1</h6>
                <Col md={6}>
                  <Card>
                    <CardBody>
                      <CardTitle>Criador da Reserva</CardTitle>
                      <CardText>
                        <FormGroup style={{ paddingBottom: "10px" }} row>
                          <Label for="email1" sm={2}>
                            Email
                          </Label>
                          <Col sm={10}>
                            <Input
                              type="email"
                              name="email"
                              id="email1"
                              placeholder="example@email.pt"
                              required
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup style={{ paddingBottom: "10px" }} row>
                          <Label for="nome1" sm={2}>
                            Nome
                          </Label>
                          <Col sm={10}>
                            <Input
                              type="text"
                              name="email"
                              id="nome1"
                              placeholder="Primeiro Ultimo"
                              required
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup style={{ paddingBottom: "10px" }} row>
                          <Label for="cc1" sm={2}>
                            CC
                          </Label>
                          <Col sm={10}>
                            <Input
                              type="number"
                              name="email"
                              id="cc1"
                              placeholder="12345678"
                              required
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup
                          hidden={pagamento1 === "MBway" ? false : true}
                          style={{ paddingBottom: "20px" }}
                          row
                        >
                          <Label for="nr1" sm={2}>
                            Nr Tel
                          </Label>
                          <Col sm={10}>
                            <Input
                              type="number"
                              name="email"
                              id="nr1"
                              placeholder="912345678"
                              required={pagamento1 === "MBway" ? true : false}
                            />
                          </Col>
                        </FormGroup>

                        <Label>Método de pagamento</Label>
                        <FormGroup row>
                          <Col
                            lg={3}
                            md={6}
                            sm={6}
                            style={{ paddingBottom: "10px" }}
                          >
                            <Button
                              outline={pagamento1 == "Saldo" ? false : true}
                              color="primary"
                              onClick={() => {
                                if (pagamento1 == "Saldo") {
                                  setPagamento1(null)
                                } else {
                                  setPagamento1("Saldo")
                                }
                              }}
                            >
                              {" "}
                              Saldo{" "}
                            </Button>
                          </Col>
                          <Col
                            lg={3}
                            md={6}
                            sm={6}
                            style={{ paddingBottom: "10px" }}
                          >
                            <Button
                              outline={pagamento1 == "MBway" ? false : true}
                              color="primary"
                              onClick={() => {
                                if (pagamento1 == "MBway") {
                                  setPagamento1(null)
                                } else {
                                  setPagamento1("MBway")
                                }
                              }}
                            >
                              {" "}
                              MBway{" "}
                            </Button>
                          </Col>
                          <Col
                            lg={3}
                            md={6}
                            sm={6}
                            style={{ paddingBottom: "10px" }}
                          >
                            <Button
                              outline={pagamento1 == "Contrato" ? false : true}
                              color="primary"
                              onClick={() => {
                                if (pagamento1 == "Contrato") {
                                  setPagamento1(null)
                                } else {
                                  setPagamento1("Contrato")
                                }
                              }}
                            >
                              {" "}
                              Contrato{" "}
                            </Button>
                          </Col>
                          <Col
                            lg={3}
                            md={6}
                            sm={6}
                            style={{ paddingBottom: "10px" }}
                          >
                            <Button
                              outline={pagamento1 == "Numerário" ? false : true}
                              color="primary"
                              onClick={() => {
                                if (pagamento1 == "Numerário") {
                                  setPagamento1(null)
                                } else {
                                  setPagamento1("Numerário")
                                }
                              }}
                            >
                              {" "}
                              Numerário{" "}
                            </Button>
                          </Col>
                        </FormGroup>
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <CardBody>
                      <CardTitle>Jogador 2</CardTitle>
                      <CardText>
                        <FormGroup style={{ paddingBottom: "10px" }} row>
                          <Label for="email2" sm={2}>
                            Email
                          </Label>
                          <Col sm={10}>
                            <Input
                              type="email"
                              name="email"
                              id="email2"
                              placeholder="example@email.pt"
                              required
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup style={{ paddingBottom: "10px" }} row>
                          <Label for="nome2" sm={2}>
                            Nome
                          </Label>
                          <Col sm={10}>
                            <Input
                              type="text"
                              name="email"
                              id="nome2"
                              placeholder="Primeiro Ultimo"
                              required
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup style={{ paddingBottom: "10px" }} row>
                          <Label for="cc2" sm={2}>
                            CC
                          </Label>
                          <Col sm={10}>
                            <Input
                              type="number"
                              name="email"
                              id="cc2"
                              placeholder="12345678"
                              required
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup
                          hidden={pagamento2 === "MBway" ? false : true}
                          style={{ paddingBottom: "20px" }}
                          row
                        >
                          <Label for="nr2" sm={2}>
                            Nr Tel
                          </Label>
                          <Col sm={10}>
                            <Input
                              type="number"
                              name="email"
                              id="nr2"
                              placeholder="912345678"
                              required={
                                pagamento2 === "MBway" &&
                                dividePagamento2 == true
                                  ? true
                                  : false
                              }
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup style={{ paddingBottom: "10px" }} row>
                          <Label check>
                            <Input
                              value={dividePagamento2}
                              type="checkbox"
                              id="checkbox2"
                              onChange={e =>
                                setDividePagamento2(e.target.checked)
                              }
                            />{" "}
                            Dividir pagamento
                          </Label>
                        </FormGroup>

                        {dividePagamento2 ? (
                          <FormGroup>
                            <Label>Método de pagamento</Label>
                            <FormGroup row>
                              <Col
                                lg={3}
                                md={6}
                                sm={6}
                                style={{ paddingBottom: "10px" }}
                              >
                                <Button
                                  outline={pagamento2 == "Saldo" ? false : true}
                                  color="primary"
                                  onClick={() => {
                                    if (pagamento2 == "Saldo") {
                                      setPagamento2(null)
                                    } else {
                                      setPagamento2("Saldo")
                                    }
                                  }}
                                >
                                  {" "}
                                  Saldo{" "}
                                </Button>
                              </Col>
                              <Col
                                lg={3}
                                md={6}
                                sm={6}
                                style={{ paddingBottom: "10px" }}
                              >
                                <Button
                                  outline={pagamento2 == "MBway" ? false : true}
                                  color="primary"
                                  onClick={() => {
                                    if (pagamento2 == "MBway") {
                                      setPagamento2(null)
                                    } else {
                                      setPagamento2("MBway")
                                    }
                                  }}
                                >
                                  {" "}
                                  MBway{" "}
                                </Button>
                              </Col>
                              <Col
                                lg={3}
                                md={6}
                                sm={6}
                                style={{ paddingBottom: "10px" }}
                              >
                                <Button
                                  outline={
                                    pagamento2 == "Contrato" ? false : true
                                  }
                                  color="primary"
                                  onClick={() => {
                                    if (pagamento2 == "Contrato") {
                                      setPagamento2(null)
                                    } else {
                                      setPagamento2("Contrato")
                                    }
                                  }}
                                >
                                  {" "}
                                  Contrato{" "}
                                </Button>
                              </Col>
                              <Col
                                lg={3}
                                md={6}
                                sm={6}
                                style={{ paddingBottom: "10px" }}
                              >
                                <Button
                                  outline={
                                    pagamento2 == "Numerário" ? false : true
                                  }
                                  color="primary"
                                  onClick={() => {
                                    if (pagamento2 == "Numerário") {
                                      setPagamento2(null)
                                    } else {
                                      setPagamento2("Numerário")
                                    }
                                  }}
                                >
                                  {" "}
                                  Numerário{" "}
                                </Button>
                              </Col>
                            </FormGroup>
                          </FormGroup>
                        ) : null}
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row>
              <h6>Equipa 2</h6>
                <Col md={6}>
                  <Card>
                    <CardBody>
                      <CardTitle>Jogador 3</CardTitle>
                      <CardText>
                        <FormGroup style={{ paddingBottom: "10px" }} row>
                          <Label for="email3" sm={2}>
                            Email
                          </Label>
                          <Col sm={10}>
                            <Input
                              type="email"
                              name="email"
                              id="email3"
                              placeholder="example@email.pt"
                              required
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup style={{ paddingBottom: "10px" }} row>
                          <Label for="nome3" sm={2}>
                            Nome
                          </Label>
                          <Col sm={10}>
                            <Input
                              type="text"
                              name="email"
                              id="nome3"
                              placeholder="Primeiro Ultimo"
                              required
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup style={{ paddingBottom: "10px" }} row>
                          <Label for="cc3" sm={2}>
                            CC
                          </Label>
                          <Col sm={10}>
                            <Input
                              type="number"
                              name="email"
                              id="cc3"
                              placeholder="12345678"
                              required
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup
                          hidden={pagamento3 === "MBway" ? false : true}
                          style={{ paddingBottom: "20px" }}
                          row
                        >
                          <Label for="nr3" sm={2}>
                            Nr Tel
                          </Label>
                          <Col sm={10}>
                            <Input
                              type="number"
                              name="email"
                              id="nr3"
                              placeholder="912345678"
                              required={
                                pagamento3 === "MBway" &&
                                dividePagamento3 == true
                                  ? true
                                  : false
                              }
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup style={{ paddingBottom: "10px" }} row>
                          <Label check>
                            <Input
                              value={dividePagamento3}
                              type="checkbox"
                              id="checkbox3"
                              onChange={e =>
                                setDividePagamento3(e.target.checked)
                              }
                            />{" "}
                            Dividir pagamento
                          </Label>
                        </FormGroup>
                        {dividePagamento3 ? (
                          <FormGroup>
                            <Label>Método de pagamento</Label>
                            <FormGroup row>
                              <Col
                                lg={3}
                                md={6}
                                sm={6}
                                style={{ paddingBottom: "10px" }}
                              >
                                <Button
                                  outline={pagamento3 == "Saldo" ? false : true}
                                  color="primary"
                                  onClick={() => {
                                    if (pagamento3 == "Saldo") {
                                      setPagamento3(null)
                                    } else {
                                      setPagamento3("Saldo")
                                    }
                                  }}
                                >
                                  {" "}
                                  Saldo{" "}
                                </Button>
                              </Col>
                              <Col
                                lg={3}
                                md={6}
                                sm={6}
                                style={{ paddingBottom: "10px" }}
                              >
                                <Button
                                  outline={pagamento3 == "MBway" ? false : true}
                                  color="primary"
                                  onClick={() => {
                                    if (pagamento3 == "MBway") {
                                      setPagamento3(null)
                                    } else {
                                      setPagamento3("MBway")
                                    }
                                  }}
                                >
                                  {" "}
                                  MBway{" "}
                                </Button>
                              </Col>
                              <Col
                                lg={3}
                                md={6}
                                sm={6}
                                style={{ paddingBottom: "10px" }}
                              >
                                <Button
                                  outline={
                                    pagamento3 == "Contrato" ? false : true
                                  }
                                  color="primary"
                                  onClick={() => {
                                    if (pagamento3 == "Contrato") {
                                      setPagamento3(null)
                                    } else {
                                      setPagamento3("Contrato")
                                    }
                                  }}
                                >
                                  {" "}
                                  Contrato{" "}
                                </Button>
                              </Col>
                              <Col
                                lg={3}
                                md={6}
                                sm={6}
                                style={{ paddingBottom: "10px" }}
                              >
                                <Button
                                  outline={
                                    pagamento3 == "Numerário" ? false : true
                                  }
                                  color="primary"
                                  onClick={() => {
                                    if (pagamento3 == "Numerário") {
                                      setPagamento3(null)
                                    } else {
                                      setPagamento3("Numerário")
                                    }
                                  }}
                                >
                                  {" "}
                                  Numerário{" "}
                                </Button>
                              </Col>
                            </FormGroup>
                          </FormGroup>
                        ) : null}
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <CardBody>
                      <CardTitle>Jogador 4</CardTitle>
                      <CardText>
                        <FormGroup style={{ paddingBottom: "10px" }} row>
                          <Label for="email4" sm={2}>
                            Email
                          </Label>
                          <Col sm={10}>
                            <Input
                              type="email"
                              name="email"
                              id="email4"
                              placeholder="example@email.pt"
                              required
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup style={{ paddingBottom: "10px" }} row>
                          <Label for="nome4" sm={2}>
                            Nome
                          </Label>
                          <Col sm={10}>
                            <Input
                              type="text"
                              name="email"
                              id="nome4"
                              placeholder="Primeiro Ultimo"
                              required
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup style={{ paddingBottom: "10px" }} row>
                          <Label for="cc4" sm={2}>
                            CC
                          </Label>
                          <Col sm={10}>
                            <Input
                              type="number"
                              name="email"
                              id="cc4"
                              placeholder="12345678"
                              required
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup
                          hidden={pagamento4 === "MBway" ? false : true}
                          style={{ paddingBottom: "20px" }}
                          row
                        >
                          <Label for="nr4" sm={2}>
                            Nr Tel
                          </Label>
                          <Col sm={10}>
                            <Input
                              type="number"
                              name="email"
                              id="nr4"
                              placeholder="912345678"
                              required={
                                pagamento4 === "MBway" &&
                                dividePagamento4 == true
                                  ? true
                                  : false
                              }
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup style={{ paddingBottom: "10px" }} row>
                          <Label check>
                            <Input
                              value={dividePagamento4}
                              type="checkbox"
                              id="checkbox4"
                              onChange={e =>
                                setDividePagamento4(e.target.checked)
                              }
                            />{" "}
                            Dividir pagamento
                          </Label>
                        </FormGroup>
                        {dividePagamento4 ? (
                          <FormGroup>
                            <Label>Método de pagamento</Label>

                            <FormGroup row>
                              <Col
                                lg={3}
                                md={6}
                                sm={6}
                                style={{ paddingBottom: "10px" }}
                              >
                                <Button
                                  outline={pagamento4 == "Saldo" ? false : true}
                                  color="primary"
                                  onClick={() => {
                                    if (pagamento4 == "Saldo") {
                                      setPagamento4(null)
                                    } else {
                                      setPagamento4("Saldo")
                                    }
                                  }}
                                >
                                  {" "}
                                  Saldo{" "}
                                </Button>
                              </Col>
                              <Col
                                lg={3}
                                md={6}
                                sm={6}
                                style={{ paddingBottom: "10px" }}
                              >
                                <Button
                                  outline={pagamento4 == "MBway" ? false : true}
                                  color="primary"
                                  onClick={() => {
                                    if (pagamento4 == "MBway") {
                                      setPagamento4(null)
                                    } else {
                                      setPagamento4("MBway")
                                    }
                                  }}
                                >
                                  {" "}
                                  MBway{" "}
                                </Button>
                              </Col>
                              <Col
                                lg={3}
                                md={6}
                                sm={6}
                                style={{ paddingBottom: "10px" }}
                              >
                                <Button
                                  outline={
                                    pagamento4 == "Contrato" ? false : true
                                  }
                                  color="primary"
                                  onClick={() => {
                                    if (pagamento4 == "Contrato") {
                                      setPagamento4(null)
                                    } else {
                                      setPagamento4("Contrato")
                                    }
                                  }}
                                >
                                  {" "}
                                  Contrato{" "}
                                </Button>
                              </Col>
                              <Col
                                lg={3}
                                md={6}
                                sm={6}
                                style={{ paddingBottom: "10px" }}
                              >
                                <Button
                                  outline={
                                    pagamento4 == "Numerário" ? false : true
                                  }
                                  color="primary"
                                  onClick={() => {
                                    if (pagamento4 == "Numerário") {
                                      setPagamento4(null)
                                    } else {
                                      setPagamento4("Numerário")
                                    }
                                  }}
                                >
                                  {" "}
                                  Numerário{" "}
                                </Button>
                              </Col>
                            </FormGroup>
                          </FormGroup>
                        ) : null}
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col
                  style={{
                    paddingTop: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "1",
                    height: "100%",
                  }}
                >
                  {isLoading ? (
                    <Spinner color="primary"></Spinner>
                  ) : (
                    <Button
                      disabled={
                        isValidDate && campoEscolhido != null ? false : true
                      }
                      color="primary"
                      onClick={() => {
                        calculaPreco()
                      }}
                    >
                      Calcular preço
                    </Button>
                  )}
                </Col>
              </Row>
              {rendera()}
              <Row>
                <AdicionarPagamentosModal></AdicionarPagamentosModal>
              </Row>
              <Row>
                <Col
                  style={{
                    color: "#CC2222",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "1",
                    height: "100%",
                  }}
                >
                  <p id="mensagemDeErro" hidden={errorMessage}>
                    {textoDeErro}
                  </p>
                </Col>
              </Row>
            </Form>
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default CriarReservas
