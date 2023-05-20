import { set } from "lodash"
import { Contrato } from "models/contrato"
import React, { useEffect, useState } from "react"
import { DashCircle, PlusCircle } from "react-bootstrap-icons"
import DatePicker from "react-date-picker"
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
import {
  adicionarContratoAoUser,
  createContrato,
} from "services/contratos/contratos_services"
import {
  pesquisarJogadoresByEmail,
  pesquisarJogadoresByEmailParaEntidades,
} from "services/useres/jogadores_services"

function AdicionarContratroEntidadesModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [numeroDeEmailsAenviar, setNumeroDeEmailsAenviar] = useState(1)
  const [emailsI, setEmailsI] = useState([])

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  function incrementaEmails() {
    setNumeroDeEmailsAenviar(numeroDeEmailsAenviar + 1)
  }

  function decremntaEmails() {
    setNumeroDeEmailsAenviar(numeroDeEmailsAenviar - 1)
  }

  function criarInputDeEmails() {
    var listaAux = []
    for (let index = 0; index < numeroDeEmailsAenviar; index++) {
      listaAux.push(index)
    }
    setEmailsI(listaAux)
  }

  useEffect(() => {
    criarInputDeEmails()
  }, [numeroDeEmailsAenviar])

  async function criaContratos() {
    var contrato = new Contrato()

    contrato.expiresAt = endDate
    contrato.startAt = startDate
    contrato.diaDaSemana = 1
    contrato.entidade = document.getElementById("entidadeInput").value
    contrato.expired = false
    contrato.localizacao = "Great Padel Vila Verde"
    contrato.mapEmailId = {}
    contrato.numeroDeJogos = document.getElementById("nrInput").value
    contrato.periodo = document.getElementById("periodo").value
    contrato.userEmail = null
    contrato.userEmails = {}
    contrato.userId = null
    contrato.valor = document.getElementById("preco").value
    contrato.tipo = null;

    if (
      document.getElementById("nrInput").value == "" ||
      document.getElementById("nrInput").value == null
    ) {
      alert("O número de jogos não pode estar vazio")
    } else if (
      document.getElementById("preco").value == "" ||
      document.getElementById("preco").value == null
    ) {
      alert("O preço não pode estar vazio")
    } else {
      var listaAux = []
      var emailsArrays = document.getElementsByClassName("input-email")
      for (const elemn of emailsArrays) {
        if (elemn.value == "" || elemn.value == null) {
        } else {
          listaAux.push(elemn.value)
        }
      }
      var mapEMails = await pesquisarJogadoresByEmailParaEntidades(listaAux)
      console.log(mapEMails)
      var controla = false
      for (var elem in mapEMails) {
        if (mapEMails[elem] == null) {
          alert("O email " + elem + " não existe")
          controla = true
        }
      }
      if (controla) {
        return
      } else {
        for (var elem in mapEMails) {
          contrato.userId = mapEMails[elem]
          await createContrato(contrato).then(async value => {
            if (value == null) {
              alert("Erro a criar o contrato")
            } else {
              alert("Contrato criado com sucesso")
              await adicionarContratoAoUser(
                contrato,
                value,
                contrato.userId
              ).then(value => {
                if (value) {
                  setIsOpen(!isOpen)
                } else {
                  alert("Erro ao adicionar contrato ao utilizador")
                }
              })
            }
          })
        }
      }
    }
  }

  return (
    <React.Fragment>
      <Button
        color="primary"
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        Adicionar contrato entidades
      </Button>
      <Modal
        isOpen={isOpen}
        toggle={() => {
          setIsOpen(!isOpen)
        }}
      >
        <ModalHeader
          color="primary"
          toggle={() => {
            setIsOpen(!isOpen)
          }}
        >
          Adicionar contrato entidades
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Row>
                <Label for="entidade" md={3}>
                  <p>Entidade</p>
                </Label>
                <Col md={9}>
                  <Input
                    type="text"
                    name="entidadeInput"
                    id="entidadeInput"
                    placeholder="nome"
                  />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup row>
              <Label for="periodo" md={3}>
                <p>Nr de Jogos</p>
              </Label>
              <Col md={4}>
                <Input type="select" name="select" id="periodo">
                  <option>Diário</option>
                  <option>Mensal</option>
                  <option>Duas Semanas</option>
                  <option>Mensal</option>
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label md={3}>
                <p>Nr de Jogos</p>
              </Label>
              <Col md={4}>
                <Input
                  type="number"
                  name="nrInput"
                  id="nrInput"
                  placeholder="1"
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={3} for="preco">
                Preço
              </Label>
              <Col sm={4}>
                <div className="input-group mb-3">
                  <input
                    onChange={e => console.log(e.target.value)}
                    type="number"
                    className="form-control"
                    placeholder="6.50"
                    step="0.01"
                    pattern="^\d+(?:\.\d{1,2})?$"
                    id="preco"
                  />
                  <div className="input-group-append">
                    <span className="input-group-text" id="basic-addon2">
                      €
                    </span>
                  </div>
                </div>
              </Col>
            </FormGroup>
            <FormGroup>
              <Row>
                <Label md={3}>
                  <p>Dia Inicial</p>
                </Label>
                <Col md={9}>
                  <DatePicker
                    value={startDate}
                    onChange={date => {
                      setStartDate(date)
                    }}
                  ></DatePicker>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Label md={3}>
                  <p>Dia Final</p>
                </Label>
                <Col md={9}>
                  <DatePicker
                    value={endDate}
                    onChange={date => {
                      setEndDate(date)
                    }}
                  ></DatePicker>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup style={{ paddingBottom: "20px" }} row>
              <Label>Emails </Label>
              {emailsI.map((elemnt, index) => {
                const indexp1 = index + 1
                return (
                  <Row
                    key={index}
                    style={{ alignItems: "center", paddingBottom: "10px" }}
                  >
                    <Col md={2}>
                      <Label for="email">Email</Label>
                    </Col>
                    <Col md={10}>
                      <Input
                        className="input-email"
                        type="email"
                        name={"email" + index}
                        id={"idemail" + index}
                        placeholder={"Email " + indexp1}
                        onChange={e => {
                          let items = [...emailsI]
                          items[index] = e.target.value
                          setEmailsI(items)
                          console.log(emailsI)
                        }}
                      />
                    </Col>
                  </Row>
                )
              })}
              <Row style={{ marginTop: "10px" }}>
                <Col md={1} style={{ marginRight: "10px" }}>
                  <Button
                    onClick={() => {
                      incrementaEmails()
                      console.log(numeroDeEmailsAenviar)
                    }}
                  >
                    <PlusCircle></PlusCircle>
                  </Button>
                </Col>
                <Col md={1}>
                  <Button
                    onClick={() => {
                      decremntaEmails()
                      console.log(numeroDeEmailsAenviar)
                    }}
                  >
                    <DashCircle></DashCircle>
                  </Button>
                </Col>
              </Row>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={async () => {
              await criaContratos()
            }}
            color="primary"
          >
            Adicionar Contrato
          </Button>
          <Button
            color="secondary"
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

export default AdicionarContratroEntidadesModal
