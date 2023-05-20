import { Contrato } from "models/contrato"
import React, { useState } from "react"
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
  historicoDeContratos,
} from "services/contratos/contratos_services"
import { pesquisarJogadoresByEmail } from "services/useres/jogadores_services"

function AdicionarContratosModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [numeroDeEmailsAenviar, setNumeroDeEmailsAenviar] = useState(1)
  const [emailsI, setEmailsI] = useState([])

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  async function createContratoSingular() {
    var contrato = new Contrato()
    contrato.expiresAt = endDate
    contrato.startAt = startDate
    contrato.diaDaSemana = 1
    contrato.entidade = null
    contrato.expired = false
    contrato.localizacao = "Great Padel Vila Verde"
    contrato.mapEmailId = {}
    contrato.numeroDeJogos = document.getElementById("nrInput").value
    contrato.periodo = document.getElementById("periodo").value
    contrato.userEmail = document.getElementById("emailInput").value
    contrato.userEmails = {}
    contrato.userId = null
    contrato.valor = document.getElementById("preco").value
    contrato.tipo = null;
    contrato.horario = document.getElementById("horario").value;

    if (
      document.getElementById("nrInput").value == "" ||
      document.getElementById("nrInput").value == null
    ) {
      alert("O número de jogos não pode estar vazio")
    } else if (
      document.getElementById("emailInput").value == "" ||
      document.getElementById("emailInput").value == null
    ) {
      alert("O email não pode estar vazio")
    } else if (
      document.getElementById("preco").value == "" ||
      document.getElementById("preco").value == null
    ) {
      alert("O preço não pode estar vazio")
    } else {
      var jogador = await pesquisarJogadoresByEmail(contrato.userEmail)
      if (typeof jogador === "undefined") {
        alert("Não existe nenhum jogador com esse email")
      } else {
        contrato.userId = jogador.id
        await createContrato(contrato).then(async value => {
          if (value == null) {
            alert("Erro a criar o contrato")
          } else {
            alert("Contrato criado com sucesso")
            await adicionarContratoAoUser(contrato, value, contrato.userId)
          }
        })
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
        Adicionar contrato individual
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
          Adicionar contrato individual
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup row>
              <Label md={3}>
                <p>Email</p>
              </Label>
              <Col md={9}>
                <Input
                  type="email"
                  name="emailInput"
                  id="emailInput"
                  placeholder="example@domain.com"
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="periodo" md={3}>
                <p>Periodo</p>
              </Label>
              <Col md={4}>
                <Input type="select" name="select" id="periodo">
                  <option>Diário</option>
                  <option>Semanal</option>
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
              <Label md={3}>
                <p>Horário</p>
              </Label>
              <Col md={4}>
              <Input type="select" name="select" id="horario">
                  <option>Todos</option>
                  <option>Off-Peak</option>
                </Input>
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
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={async () => {
              await createContratoSingular()
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

export default AdicionarContratosModal
