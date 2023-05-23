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
import { selecttreinadores } from "store/treinadores/treinadores_reducer"

function AdicinoarTreinadorMolda() {
  const [isOpen, setIsOpen] = useState(false)
  const localId = useSelector(selectclubeid)

  var clubeId = useSelector(selectclubeid)
  var treinadoresRed = useSelector(selecttreinadores)
  
 async function updateTreinadores(novosTreinadores) {
  try {
      await firebase.firestore().collection("localizacao").doc(clubeId).set({
          treinadores: novosTreinadores
      }, {merge: true})
      return true
    } catch (error) {
      console.error(error)
      return null
    }
 } 

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
              var listaAUx = [...treinadoresRed]
              listaAUx.push({nome:document.getElementById("nomeInput").value ,email:document.getElementById("emailInput").value })
              var res = await updateTreinadores(listaAUx)
              if(res) {
                  alert('Treinador Removido com sucesso')
                  setIsOpen(!isOpen)
              } else {
                  alert('Falha a Remover treinador')
                  setIsOpen(!isOpen)
              }
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
