import React, { useState } from 'react';
import DatePicker from 'react-date-picker';
import DateTimePicker from 'react-datetime-picker/dist/DateTimePicker';
import { useSelector } from 'react-redux';
import TimePicker from 'react-time-picker/dist/TimePicker';
import { Button, Col, Form, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { bloquearHorario } from 'services/reservas/reservas_services';
import { selectbloquearReservas } from 'store/bloquear_reservas/bloquear_reservas_reducer';
import { selectclubeid } from 'store/localizacao/clube_id_reducer';

function BloquearHorario() {
    const [isOpen, setIsOpen] = useState(false)

    const [horaInicial, setHoraInicial] = useState("00:00")
    const [horaFinal, setHoraFinal] = useState("00:00")
    const [startDate, setStartDate] = useState( new Date())
    const [endDate, setEndDate] = useState(  new Date())

    const [dataValue, setDataValue] = useState(new Date())
    const minDate = new Date()

    const listaDeBlocks = useSelector(selectbloquearReservas)
    const clubeId = useSelector(selectclubeid)

  function toggle() {
    setIsOpen(!isOpen)
  }

    return (  
        <React.Fragment>
            <Button color='primary' onClick={() => {toggle()}}>
                Bloquear Horário
            </Button>
            <Modal isOpen={isOpen}
        toggle={() => {
          setIsOpen(!isOpen)
        }}
      >
        <ModalHeader
          toggle={() => {
            setIsOpen(!isOpen)
          }}
        >
          Bloquear Horário
        </ModalHeader>
        <ModalBody>
          <Form>
          
            <FormGroup>
                <Row>
                    <Col md={3}>
                    <p>Horário Inicial</p>
                    </Col>
                    <Col md={9}>
                        <DateTimePicker
                            disableClock={true}
                            value={startDate} 
                            minDate={minDate}
                            onChange={(value) => {
                                console.log(value);
                                setStartDate(value)
                            }}>
                        </DateTimePicker>
                    </Col>
                </Row>
            
            </FormGroup>
            <FormGroup>
                <Row>
                    <Col md={3}>
                    <p>Horário Final</p>
                    </Col>
                    <Col md={9}>
                    <DateTimePicker
                    disableClock={true}
                        value={endDate} 
                        minDate={minDate}  
                        onChange={(value) => {
                            console.log(value);
                            setEndDate(value)
                        }}>
                    </DateTimePicker>
                    </Col>
                </Row>
            
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
            <Button color='primary' onClick={async () => {
              var res =  await  bloquearHorario(clubeId,listaDeBlocks, startDate, endDate )
                console.log(endDate);
                console.log(startDate);
                if(res) {
                    alert("Adicionado")
                    toggle()
                } else {
                    alert("Erro a adicionar")
                    toggle()
                }
            }} > Bloquear Horário</Button>
            <Button onClick={() => {toggle()}} >Cancelar </Button>

        </ModalFooter>
       
            </Modal>
        </React.Fragment>
    );
}

export default BloquearHorario;