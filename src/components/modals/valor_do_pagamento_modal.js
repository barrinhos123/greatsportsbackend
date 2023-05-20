import React, { useState } from "react"
import {
  Button,
  Col,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap"

function AdicionarPagamentosModal() {
  const [isOpen, setIsOpen] = useState(false)

  function toggle() {
    setIsOpen(!isOpen)
  }

  return (
    <React.Fragment>
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
          Criar Reserva
        </ModalHeader>
        <ModalBody>
          <Container fluid>
            <Row>
              <Col md={10}>Jogador 1</Col>
              <Col md={2}>10€</Col>
            </Row>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              toggle()
            }}
          >
            Remover
          </Button>{" "}
          <Button color="secondary">Cancelar</Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  )
}

export default AdicionarPagamentosModal
