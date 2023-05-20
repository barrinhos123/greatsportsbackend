import React, { useEffect, useState } from "react"
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
import { editarDadosReserva } from "services/reservas/reservas_services"

function EditarReservasModal(props) {
  const [isOpen, setIsOpen] = useState(false)
  
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
                <Col md={9}>
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
                <Col md={9}>
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
                <Col md={9}>
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
                <Col md={9}>
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

                var res = await editarDadosReserva(props.reservaID, json.jogador1estado,json.jogador2estado,json.jogador3estado,json.jogador4estado)
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
