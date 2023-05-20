import { Contrato } from 'models/contrato';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-date-picker';
import DateTimePicker from 'react-datetime-picker';
import TimePicker from 'react-time-picker';
import { Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { adicionarContratoAoUser, createContrato } from 'services/contratos/contratos_services';
import { pesquisarJogadoresByEmailParaEntidades } from 'services/useres/jogadores_services';

function AdicionarContratosPeriodicoModal() {
    const [isOpen, setIsOpen] = useState(false)

    const [numeroDeEmailsAenviar, setNumeroDeEmailsAenviar] = useState(1)
    const [emailsI, setEmailsI] = useState([])
    const [camposDisp, setCamposDisp] = useState([])
  
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())

    const [campoEscolhido, setCampoEscolhido] = useState([])

    var weekday = new Array(7)
    weekday[0] = "Segunda"
    weekday[1] = "Terça"
    weekday[2] = "Quarta"
    weekday[3] = "Quinta"
    weekday[4] = "Sexta"
    weekday[5] = "Sábado"
    weekday[6] = "Domingo"

  const removeCamposEsc = value => {
    setCampoEscolhido(campoEscolhido.filter(item => item !== value))
  }

  async function adicionarContrato() {
    var contrato = new Contrato()

    contrato.expiresAt = endDate
    contrato.startAt = startDate
    contrato.diaDaSemana = 1
    contrato.entidade = null
    contrato.expired = false
    contrato.localizacao = "Great Padel Vila Verde"
    contrato.mapEmailId = {}
    contrato.numeroDeJogos = 0
    contrato.periodo = "Semanal"
    contrato.userEmail = null
    contrato.userEmails = {}
    contrato.userId = null
    contrato.valor = document.getElementById("preco").value
    contrato.tipo = "Periodico";
    if( document.getElementById("email1").value == "" || document.getElementById("email1").value == null ) {
        alert("O email 1 não pode estar vazio não pode estar vazio")
    }
    if( document.getElementById("email2").value == "" || document.getElementById("email2").value == null ) {
        alert("O email 2 não pode estar vazio não pode estar vazio")
    }
    if( document.getElementById("email3").value == "" || document.getElementById("email3").value == null ) {
        alert("O email 3 não pode estar vazio não pode estar vazio")
    }
    if( document.getElementById("email4").value == "" || document.getElementById("email4").value == null ) {
        alert("O email 4 não pode estar vazio não pode estar vazio")
    }
    else if (
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
      console.log("mapEMails")
      console.log(mapEMails);
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

  useEffect(() => {
    var listAux = []
    for (let index = 1; index <= 6; index++) {
      var campo = "Campo " + index
      listAux.push(campo)
    }

    setCamposDisp(listAux)
    return () => {
      setCamposDisp([]) // This worked for me
    }
  }, [])
  

    return (  
        <React.Fragment>
            <Button color='primary' onClick={() => {
          setIsOpen(!isOpen)
        }}>
                Adicionar contrato periódico
            </Button>
        <Modal
          isOpen={isOpen}
          toggle={() => {
            setIsOpen(!isOpen)
          }}>
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
            <FormGroup row>
              <Label md={3}>
                <p>Email 1</p>
              </Label>
              <Col md={9}>
                <Input
                className="input-email"
                  type="email"
                  name="email1"
                  id="email1"
                  placeholder="example@domain.com"
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label md={3}>
                <p>Email 2</p>
              </Label>
              <Col md={9}>
                <Input
                className="input-email"
                  type="email"
                  name="email2"
                  id="email2"
                  placeholder="example@domain.com"
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label md={3}>
                <p>Email 3</p>
              </Label>
              <Col md={9}>
                <Input
                className="input-email"
                  type="email"
                  name="email3"
                  id="email3"
                  placeholder="example@domain.com"
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label md={3}>
                <p>Email 4</p>
              </Label>
              <Col md={9}>
                <Input
                className="input-email"
                  type="email"
                  name="email4"
                  id="email4"
                  placeholder="example@domain.com"
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
                  <p>Duração</p>
                </Label>
                <Col md={9}>
                 90 minutos
                </Col>
              </Row>
            </FormGroup>
            <FormGroup row>
                <Label md={3}>
                  <p>Hora da reserva</p>
                </Label>
                <Col md={9}>
                <TimePicker disableClock ></TimePicker>
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
            <FormGroup>
              <p>Campos</p>
              <Row>
                {camposDisp.map((value, index) => {
                  return (
                    <Col key={index} md={4} style={{ paddingBottom: "10px" }}>
                      <Button
                        outline={campoEscolhido.includes(value) ? false : true}
                        color="primary"
                        onClick={() => {
                          if (!campoEscolhido.includes(value)) {
                            setCampoEscolhido(campoEscolhido => [
                              ...campoEscolhido,
                              value,
                            ])
                          } else {
                            removeCamposEsc(value)
                          }
                        }}
                      >
                        {value}
                      </Button>
                    </Col>
                  )
                })}
              </Row>
            </FormGroup>
            </Form>
            <ModalFooter>
          <Button
            onClick={async () => {
              await adicionarContrato()
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
        </ModalBody>
        </Modal>
        </React.Fragment>
    );
}

export default AdicionarContratosPeriodicoModal;