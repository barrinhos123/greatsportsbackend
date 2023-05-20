import { Treinador } from "models/treinador"
import React, { useState } from "react"
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
} from "reactstrap"
import { criarTreinador } from "services/treinadores/treinadores_Services"
import firebase from "firebase/app"
import "firebase/firestore"
import { useSelector } from "react-redux"
import { selectclubeid } from "store/localizacao/clube_id_reducer"

function AdicinoarTreinadorMolda() {
  const [isOpen, setIsOpen] = useState(false)
  const localId = useSelector(selectclubeid)

  return (
    <React.Fragment>
      <Button
        onClick={() => {
          setIsOpen(!isOpen)
        }}
        color="primary"
      >
        Adicionar Treinador
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
          Adicionar Treinador
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup row>
              <Label for="email" md={2}>
                <p>Email</p>
              </Label>
              <Col md={10}>
                <Input
                  type="email"
                  name="emailInput"
                  id="emailInput"
                  placeholder="example@domain.com"
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="nome" md={2}>
                <p>Nome</p>
              </Label>
              <Col md={10}>
                <Input
                  type="text"
                  name="nomeInput"
                  id="nomeInput"
                  placeholder="nome"
                />
              </Col>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={async () => {
              var newTreinador = new Treinador()
              newTreinador.createdAt = firebase.firestore.Timestamp.fromDate(
                new Date()
              )
              newTreinador.qrCode = null
              newTreinador.aulas = {}
              newTreinador.nome = document.getElementById("nomeInput").value
              newTreinador.email = document.getElementById("emailInput").value
              newTreinador.localizacao = "Great Padel Vila Verde"

              criarTreinador(newTreinador, localId).then(value => {
                if (value == true) {
                  alert("Treinador adicionado com sucesso")
                  setIsOpen(!isOpen)
                } else {
                  alert("Falha a adicionar treinador")
                }
              })
            }}
            color="primary"
          >
            Adicionar treinador
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

export default AdicinoarTreinadorMolda
