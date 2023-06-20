import firebase from "firebase/app"
import "firebase/firestore"
import React, { useEffect, useState } from "react"
import { Pencil, PlusCircle } from "react-bootstrap-icons"
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
import { createAula, updateAula } from "services/aulas/aulas_services"
import AdicionarAlunos from "./adicionar_alunos_modal"
import AdicionarAlunosPAX from "./editar_alunos_PAX"
import { useSelector } from "react-redux"
import { selecttreinadores } from "store/treinadores/treinadores_reducer"
import { convertCamps, niveis } from "services/consts"
import InfoAlunosModal from "./info_alunos_modal"
import { retornaCamposIndisponíveisNaHora } from "services/reservas/reservas_services"
import { ProcuraReserva } from "models/reserva"

function EditarAulasModal(props) {
  const [isOpen, setIsOpen] = useState(false)
  var treinadores = useSelector(selecttreinadores)
  const [nomeDaAula, setNomeDaAula] = useState(props.aula.nome)
  const [horaInicial, setHoraInicial] = useState(props.aula.horaInicial)
  const [horaFinal, setHoraFinal] = useState(props.aula.horaFinal)
  const [startDate, setStartDate] = useState(props.aula.diaInicial.toDate())
  const [endDate, setEndDate] = useState(props.aula.diaFinal.toDate())
  const [campoEscolhido, setCampoEscolhido] = useState(props.aula.campos)
  const [nivel, setNivel] = useState(props.aula.nivel)
  const [professor, setProfessor] = useState(props.aula.professor)
  const [isLoading, setIsLoading] = useState(false)
  const [diaDaSemana, setDiaDaSemana] = useState(props.aula.weekDay)
  const [isAtiva, setIsAtiva] = useState(props.aula.isAtiva)

  const handleChange = event => {
    if (event.target.checked) {
      console.log('✅ Checkbox is checked');
    } else {
      console.log('⛔️ Checkbox is NOT checked');
    }
    setIsAtiva(current => !current);
  }

  const [tipoDeAula, setTipoDeAula] = useState(props.aula.tipo)

  const [alunos, setAlunos] = useState(props.aula.alunos)
  const [alunosData, setAlunosData] = useState(props.aula.alunosData)
  const [alunosPax, setAlunosPax] = useState(props.aula.alunosPAX)

  const [notas, setNotas] = useState('')
  

  const [camposDisp, setCamposDisp] = useState([])
  const numeroDeCampos = 6

  var weekday = new Array(7)
  weekday[0] = " "
  weekday[1] = "Segunda"
  weekday[2] = "Terça"
  weekday[3] = "Quarta"
  weekday[4] = "Quinta"
  weekday[5] = "Sexta"
  weekday[6] = "Sábado"
  weekday[7] = "Domingo"

/*   const [camposDisponiv, setCamposDisponiv] = useState([]) */

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
      
      if (campoosInsdis.includes(stringAux) == false  ) {
        listaDeCampos.push(stringAux)
      }
    }
    for(var l = 0; l < props.aula.campos.length; l++ ) {
      listaDeCampos.push(props.aula.campos[l])
    }
    
    setCamposDisp(listaDeCampos)
  }

  const removeCamposEsc = value => {
    setCampoEscolhido(campoEscolhido.filter(item => item !== value))
  }

  useEffect(() => {
    console.log("props.aula.notas")
    console.log(props.aula.notas)
    if(typeof props.aula.notas != "undefined")  {
    setNotas(props.aula.notas)
    } else {
    setNotas('')
  }
    /* console.log(props)
    var listAux = []
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
    <React.Fragment>
      <Button
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        <Pencil></Pencil>
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
                    value={nomeDaAula}
                    onChange={e => {
                      setNomeDaAula(e.target.value)
                    }}
                    type="text"
                    name="aulaInput"
                    id="aulaInput"
                  />
                </Col>
              </Row>
            </FormGroup>
           
            <FormGroup>
              <Row>
                  <Col md={3}>
                    <p> Tipo </p>
                  </Col>
                  <Col md={9}>
                  <Input 
                  value={tipoDeAula}
                  onChange={(e) => {
                    setTipoDeAula(e.target.value)
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
                  <p>Hora Inicial</p>
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
                  <Input onChange={(e) => {
                    console.log(e.target.value);
                    setProfessor(e.target.value)}} value={professor} type="select" name="select" id="professorInput">
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
              <Row>
                <Col>
                  Alunos
                  <AdicionarAlunos aulaId={props.aulaId} aula={props.aula}></AdicionarAlunos>
                </Col>
              </Row>
              <Col>
                {alunos == 0 ? (
                  <p>Nenhum aluno inscrito</p>
                ) : (
                  alunos.map((aluno, index) => {
                    return <Row style={{padding: "10px"}} key={index +aluno }>
                       <Col md={2}>
                       <InfoAlunosModal key={index} aula={props.aula} email={aluno} aulaId={props.aulaId} ></InfoAlunosModal>
                      </Col>
                      <Col md={10}>
                        {aluno}
                      </Col>
                     
                    </Row>
                  })
                )}
              </Col>
            </FormGroup>
            
            <FormGroup>
           
              <Row style={{ paddingTop: "20px"}}><p style={{ fontWeight: "bold" }}>Campo da aula: { convertCamps[props.aula.campos] }</p></Row>
              <Button style={{marginBottom: "20px"}} color="primary" onClick={async() => {
                const reserva = minsDiffs(horaInicial,horaFinal, diaDaSemana );
                  var procuraReserva = new ProcuraReserva()
                  procuraReserva.duracaoDaReserva = reserva[0]
                  procuraReserva.horaDaReserva = reserva[1]
                  procuraReserva.localizacao = "Great Padel Vila Verde"
                  
                  var camposs = await retornaCamposIndisponíveisNaHora(
                    procuraReserva
                  )
                  console.log("O campo que")
                  console.log(camposs)

                  removeCamposRepetidos(camposs) 
                  /* var listaAux = [].concat(camposDisp);
                  const index = listaAux.indexOf(props.aula.campos[0]);
                  const x = listaAux.splice(index, 1);
                  
                  console.log(x)
                  console.log(listaAux) */
                  
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
            <Label for="exampleText">Notas</Label>
          <Input type="textarea" name="text" value={notas} id="notasID" onChange={(e) =>  setNotas(e.target.value) } />
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
              newAula.alunosData = {}
              newAula.campos = campoEscolhido
              newAula.diaFinal = endDate
              newAula.diaInicial = startDate
              newAula.horaInicial = horaInicial
              newAula.horaFinal = horaFinal
              newAula.tipo = document.getElementById("tipoAula").value
              newAula.localizacao = document.getElementById("localSelect").value
              newAula.professor =
              professor
              newAula.weekDay =
                document.getElementById("weekdaySelect").selectedIndex
              newAula.nivel = nivel
              newAula.notas = notas;
              console.log(newAula)
              /*  setIsOpen(!isOpen) */
              var aux = await updateAula(newAula, props.aulaId)
              setIsLoading(false)
              if (aux == true) {
                alert("Aula criada com sucesso")
                setIsOpen(!isOpen)
              } else {
                alert(
                  "Erro a criar aula. Confirme se todos os dados estão preenchidos. Se sim, por favor tente mais tarde"
                )
                setIsOpen(!isOpen)
              }
            }}
          >
            Editar aula
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
    </React.Fragment>
  )
}

export default EditarAulasModal
