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
import { useSelector } from "react-redux"
import { selecttreinadores } from "store/treinadores/treinadores_reducer"
import { convertCamps, niveis } from "services/consts"
import { ProcuraReserva } from "models/reserva"
import { retornaCamposIndisponíveisNaHora } from "services/reservas/reservas_services"

function AdicionarAulasModal(props) {

  var asd = new Date()
  var treinadores = useSelector(selecttreinadores)
  const [isOpen, setIsOpen] = useState(false)
  const [horaInicial, setHoraInicial] = useState("00:00")
  const [horaFinal, setHoraFinal] = useState("00:00")
  const [startDate, setStartDate] = useState( asd)
  const [endDate, setEndDate] = useState(  asd)
  const [campoEscolhido, setCampoEscolhido] = useState([])
  const [nivel, setNivel] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  const [isAtiva, setIsAtiva] = useState(true);

  const handleChange = event => {
    if (event.target.checked) {
      console.log('✅ Checkbox is checked');
    } else {
      console.log('⛔️ Checkbox is NOT checked');
    }
    setIsAtiva(current => !current);
  }

  const [diaDaSemana, setDiaDaSemana] = useState(0)

  const [camposDisp, setCamposDisp] = useState([])
  const numeroDeCampos = 6

  var weekday = new Array(8)
  weekday[0] = " "
  weekday[1] = "Segunda"
  weekday[2] = "Terça"
  weekday[3] = "Quarta"
  weekday[4] = "Quinta"
  weekday[5] = "Sexta"
  weekday[6] = "Sábado"
  weekday[7] = "Domingo"

  const removeCamposEsc = value => {
    setCampoEscolhido(campoEscolhido.filter(item => item !== value))
  }

  function minsDiffs(horaInicial, horaFinal, weekDay) {

    var hi = new Date();
    var hf = new Date();
    var himins= horaInicial.substring(3,5)
    var hihour= horaInicial.substring(0,2)
    var hfmins= horaFinal.substring(3,5)
    var hfhour= horaFinal.substring(0,2)
    hi.setHours(hihour)
    hi.setMinutes(himins)
    hf.setHours(hfhour)
    hf.setMinutes(hfmins)

    var diffMs = (hf - hi); 
    var duracao = Math.round(diffMs / 60000); // minutes
    console.log( duracao + " minutes ");
    
    var today = hi.getDay()
    if(today == 0) {
      today = 7
    }

    if(today > weekDay) {
      weekDay = weekDay + 7
    }

    var daysDiff = weekDay  - today;

    console.log(hi.getDay())
    console.log(weekDay)
    console.log(daysDiff)

    var dia = hi.getDate()
    var mes = hi.getMonth()
    var ano = hi.getFullYear()
    var checkDate = new Date(ano, mes, dia + daysDiff, hihour, himins);
    console.log(checkDate);

    return [duracao, checkDate];
  }

  function removeCamposRepetidos(campoosInsdis) {

    var listaDeCampos = []
    var novaLista = []
    for (var i = 1; i <= numeroDeCampos; i++) {
      var stringAux = "Campo " + i
      if (campoosInsdis.includes(stringAux) == false) {
        listaDeCampos.push(stringAux)
      }
    }
    setCamposDisp(listaDeCampos)
  }

  useEffect(() => {
   /*  var listAux = []
    for (let index = 1; index <= 6; index++) {
      var campo = "Campo " + index
      listAux.push(campo)
    }

    setCamposDisp(listAux)
    return () => {
      setCamposDisp([]) // This worked for me
    } */
  }, [])

  return (
    <div>
      <Button
        color="primary"
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        Adicionar Aula
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
          Adicionar Aula
        </ModalHeader>
        <ModalBody>
          <Form>
          <FormGroup check>
          <Label check>
            <Input  type="checkbox"
            checked={isAtiva}
            value={isAtiva}
            onChange={handleChange}
            id="isAulaAtiva"
            name="subscribe"  />{' '}
            Ativa
          </Label>
        </FormGroup>
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
            
            </FormGroup>
            <FormGroup>
            <Row>
                <Col md={3}>
                  <p> Tipo </p>
                </Col>
                <Col md={9}>
                <Input onChange={() => {
                      console.log(document.getElementById("tipoAula").value)
                    }} type="select" name="select" id="tipoAula">
                      <option>Experimental</option>
                      <option>Academia</option>
                      <option>PAX</option>
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
            <FormGroup>
              
              <Row>
                <Col md={3}>
                  <p>Dia da semana</p>
                </Col>
                <Col md={9}>
                  <Input
                    value={weekday[diaDaSemana]} 
                    onChange={(e) => {
                      setDiaDaSemana(document.getElementById("weekdaySelect").selectedIndex)
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
                <Input type="select" name="select" id="professorInput">
                   {treinadores.map((elem,index) => {
                    return <option key={index}>{elem.nome}</option>
                   })}
                  </Input>
                
                  
                </Col>
              </Row>
            </FormGroup>
           
            <FormGroup>
              <Row>
                <Col md={3}>
                  <p>Nivel</p>
                </Col>
                <Col md={9}>
                  <Input
                    value={nivel}
                    onChange={e => {
                      setNivel(e.target.value)
                    }}
                    type="select"
                    name="select"
                    id="nivelSelect"
                  >
                    {niveis.map((elem,index) => {
                      return <option key={index}>{elem}</option>
                    })}
                  </Input>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
     
              <p style={{paddingTop: "20px", fontWeight: "bold"}}>Campos</p>
              
              <Button style={{marginBottom: "20px"}} color="primary" onClick={async() => {
                if(horaInicial == "00:00" ) {
                  alert('É necessário escolher a hora inicial ');
                } 
                if(horaFinal == "00:00" ) {
                  alert('É necessário escolher a hora final ');
                } 
                else if(diaDaSemana == 0) {
                  alert('É necessário escolher o dia da semana ');
                } else{
                const reserva = minsDiffs(horaInicial,horaFinal, diaDaSemana );
                  var procuraReserva = new ProcuraReserva()
                  procuraReserva.duracaoDaReserva = reserva[0]
                  procuraReserva.horaDaReserva = reserva[1]
                  procuraReserva.localizacao = "Great Padel Vila Verde"
                  
                  var camposs = await retornaCamposIndisponíveisNaHora(
                    procuraReserva
                  )
                  removeCamposRepetidos(camposs) }
              }}>Mostrar campos disponíveis</Button>
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
                        { convertCamps[value]}
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
              newAula.isAtiva = isAtiva
              newAula.estado = 1
              newAula.nome = document.getElementById("aulaInput").value
              newAula.alunos = []
              newAula.alunosPAX = []
              newAula.tipo = document.getElementById("tipoAula").value
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
              newAula.nivel = nivel
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
            Adicionar Aula
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
