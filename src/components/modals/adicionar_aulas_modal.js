import React, { useEffect, useState } from "react"
import DateTimePicker from "react-datetime-picker"
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Row,
  Col,
  Input,
  Spinner,
  Alert,
} from "reactstrap"
import TimePicker from "react-time-picker"
import DatePicker from "react-date-picker"
import { element } from "prop-types"
import { Aula } from "models/aula"
import { createAula } from "services/aulas/aulas_services"
import { PlusCircle } from "react-bootstrap-icons"

function AdicionarAulasModal(props) {
  const [isOpen, setIsOpen] = useState(false)
  const [horaInicial, setHoraInicial] = useState("00:00")
  const [horaFinal, setHoraFinal] = useState("00:00")
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [campoEscolhido, setCampoEscolhido] = useState([])
  const [nivel, setNivel] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const [camposDisp, setCamposDisp] = useState([])
  const numeroDeCampos = 6

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
    <div>
      <Button
        color="primary"
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        Adicionar Reserva
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
          Modal title
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Row>
                <Col md={3}>
                  <p>Nome da Aula</p>
                </Col>
                <Col md={9}>
                  <Input
                    type="text"
                    name="aulaInput"
                    id="aulaInput"
                    placeholder="Nome da aula"
                  />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
            <Row>
                <Col md={3}>
                  <p> Duração </p>
                </Col>
                <Col md={9}>
                <Input onChange={() => {
                      console.log(document.getElementById("selectTime").value)
                    }} type="select" name="select" id="selectTime">
                      <option>60</option>
                      <option>90</option>
                      <option>120</option>
                    </Input>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col md={3}>
                  <p>Hora Inical</p>
                </Col>
                <Col md={9}>
                  <TimePicker
                    onChange={setHoraInicial}
                    value={horaInicial}
                    disableClock={true}
                  ></TimePicker>
                </Col>
              </Row>
            </FormGroup>
            <Row>
              <Col md={3}>
                <p>Hora Final</p>
              </Col>
              <Col md={9}>
                <TimePicker
                  onChange={setHoraFinal}
                  value={horaFinal}
                  disableClock={true}
                ></TimePicker>
              </Col>
            </Row>
            <Row>
              <Col md={3}>
                <p>Dia Inicial</p>
              </Col>
              <Col md={9}>
                <DatePicker
                  value={startDate}
                  onChange={date => {
                    setStartDate(date)
                  }}
                ></DatePicker>
              </Col>
            </Row>
            <Row>
              <Col md={3}>
                <p>Dia Final</p>
              </Col>
              <Col md={9}>
                <DatePicker
                  value={endDate}
                  onChange={date => {
                    setEndDate(date)
                  }}
                ></DatePicker>
              </Col>
            </Row>
            <FormGroup>
              <Row>
                <Col md={3}>
                  <p>Dia da semana</p>
                </Col>
                <Col md={9}>
                  <Input
                    onChange={() => {
                      console.log(
                        document.getElementById("weekdaySelect").selectedIndex
                      )
                    }}
                    type="select"
                    name="select"
                    id="weekdaySelect"
                  >
                    {weekday.map((element, index) => {
                      return <option key={index}>{element}</option>
                    })}
                  </Input>
                </Col>
              </Row>
            </FormGroup>
            <Row>
              <Col md={3}>
                <p>Localização</p>
              </Col>
              <Col md={9}>
                <FormGroup>
                  <Input type="select" name="select" id="localSelect">
                    <option>Great Padel Vila Verde</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Row>
                <Col md={3}>
                  <p>Professor</p>
                </Col>
                <Col md={9}>
                  <Input
                    type="email"
                    name="email"
                    id="professorInput"
                    placeholder="Professor"
                  />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col md={3}>
                  <p>Nivel</p>
                </Col>
                <Col md={9}>
                  <Input type="select" name="select" id="nivelSelect">
                    <option>1</option>
                  </Input>
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
        </ModalBody>
        <ModalFooter>
          <Spinner
            size="sm"
            hidden={!isLoading}
            animation="border"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <Button
            hidden={isLoading}
            color="primary"
            onClick={async () => {
              setIsLoading(true)
              var newAula = new Aula()
              newAula.estado = 1
              newAula.nome = document.getElementById("aulaInput").value
              newAula.alunos = []
              newAula.campos = campoEscolhido
              newAula.diaFinal = endDate
              newAula.diaInicial = startDate
              newAula.horaInicial = horaInicial
              newAula.horaFinal = horaFinal
              newAula.localizacao = document.getElementById("localSelect").value
              newAula.professor =
                document.getElementById("professorInput").value
              newAula.weekDay =
                document.getElementById("weekdaySelect").selectedIndex
              newAula.nivel = document.getElementById("nivelSelect").value
              console.log(newAula)
              /*  setIsOpen(!isOpen) */
              var aux = await createAula(newAula)
              setIsLoading(false)
              if (aux == true) {
                alert("Aula criada com sucesso")
              } else {
                alert(
                  "Erro a criar aula. Confirme se todos os dados estão preenchidos. Se sim, por favor tente mais tarde"
                )
              }
            }}
          >
            Adicionar Reserva
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              setIsOpen(!isOpen)
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default AdicionarAulasModal
