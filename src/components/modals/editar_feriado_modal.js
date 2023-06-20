import React, { useState } from 'react';
import { Pencil, PencilFill } from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Container, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { duplicate, updateFeriados } from 'services/localizacao/localizacao_services';
import { selectferiados, setferiados } from 'store/descontos/feriados';
import { selectclubeid } from 'store/localizacao/clube_id_reducer';

function EditarFeriadosModal(props) {
    const [isOpen, setIsOpen] = useState(false)
    const feriados = useSelector(selectferiados);
    const docID = useSelector(selectclubeid);
    const jsonFeriados = JSON.parse(feriados);
    const mapFeriados = Object.entries(jsonFeriados)

    const dispatch = useDispatch()

    const feriadoInicial = props.feriado;

    const [dia, setDia] = useState( parseInt( props.feriado[0].substring(3,5)));
    const [mes, setMes] = useState((parseInt( props.feriado[0].substring(0,2)) -1));
    const [nome, setNome] = useState(props.feriado[1]);

    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro" , "Outubro", "Novembro", "Dezembro"]

  function toggle() {
    setIsOpen(!isOpen)
  }

  return (
    <React.Fragment>
        <Button onClick={() => {toggle()}}>
        <PencilFill></PencilFill>
        </Button>
      <Modal
        isOpen={isOpen}
        toggle={() => {
          setIsOpen(!isOpen)
        }}
      >
        <ModalHeader
          toggle={() => {
            toggle()
          }}
        >
            Editar Feriado
        </ModalHeader>
        <ModalBody>
          <Container fluid>
            <FormGroup>
                <Row>
                <Col md={2}>
                    <Label>Dia</Label>
                </Col>
            
                <Col md={3}>
                    <Input value={dia} onChange={(e) => {
                        setDia(e.target.value)
                    }} type="number">
                    </Input>
                </Col>
                </Row>
            </FormGroup>
            <FormGroup style={{ paddingTop: "20px" , paddingBottom: "20px"}}>
                <Row>
                <Col md={2}>
                    <Label> Mês</Label>
                </Col>
                <Col md={10} >
                    <Input value={meses[mes]} onChange={(e) => {
                        setMes(e.target.selectedIndex)

                    }}  type="select" name="select" id="exampleSelect">
                        <option>Janeiro</option>
                        <option>Fevereiro</option>
                        <option>Março</option>
                        <option>Abril</option>
                        <option>Maio</option>
                        <option>Junho</option>
                        <option>Julho</option>
                        <option>Agosto</option>
                        <option>Setembro</option>
                        <option>Outubro</option>
                        <option>Novembro</option>
                        <option>Dezembro</option>
                    </Input>
                </Col>
                </Row>
            </FormGroup>
            <FormGroup>
                <Row>
                <Col md={2}>
                    <Label>
                        Nome
                    </Label>
                </Col>
                <Col md={10}>
                    <Input value={nome} onChange={(e) => {
                        setNome(e.target.value)
                    }} ></Input>
                </Col>
                </Row>
            </FormGroup>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={async () => {
            delete jsonFeriados[feriadoInicial[0]]

            var formateDay = ("0" + dia).slice(-2);
            var foramtedMes = ("0" + (mes + 1)).slice(-2);
            var diaMes = foramtedMes + '-' + formateDay;
            
            jsonFeriados[diaMes] = nome;
            dispatch(setferiados(jsonFeriados)) 

            var res = await updateFeriados(docID ,jsonFeriados) 

            if(res) {
                alert('Feriado editado com sucesso')
                toggle()
            } else {
                alert('Erro a criar feriado')
            }   
            }}
          >
            Editar
          </Button>{" "}
          <Button   onClick={() => {
              toggle()
            }}
          color="secondary">Cancelar</Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  )
}

export default EditarFeriadosModal;

/* campos:6
classes:[]
0
"Todos"
1
"Estudantes"
descontos{}
Todos
Fins de semana e Feriados
07:00 - 24:00
60
6.5
90
8
120
10
Semana
07:00 - 17:00
60
4.5
90
6
120
8
17:00 - 24:00
60
6.5
90
8
120
10
feriados
01-01
"Ano Novo"
04-07
"Sexta Feira Santa"
04-17
"Páscoa"
04-25
"Dia da Liberdade"
05-01
"Dia do Trabalhador"
05-10
"Implantação da República"
06-10
"Dia de Portugal"
06-16
"Corpo de Deus"
08-15
"Assunção de Nossa Senhora"
11-01
"Dia de Todos os Santos"
12-01
"Restauração da Independência"
12-08
"Imaculada Conceição"
12-25
"Natal"
localizacao
"Great Padel Vila Verde"
preco
6
treinadores
0
email
"luiscupido@greatpadel.pt"
nome
"Luis Cupido"
1
email
"joaomelo@greatpadel.pt"
nome
"Joao Melo"
2
email
"manuelbarros@macrobiiz.com"
nome
"Manuel Barros"
 */