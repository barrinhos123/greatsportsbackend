import React, { useState } from "react"
import { Trash2 } from "react-bootstrap-icons"
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import firebase from "firebase/app"
import "firebase/firestore"

function RemoveModal(props) {
  async function remove(collection, docID) {
    try {
      await firebase.firestore().collection(collection).doc(docID).delete()
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const [isOpen, setIsOpen] = useState(false)
  return (
    <React.Fragment>
      <Button
        color="secondary"
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        <Trash2></Trash2>
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
          {props.titulo}
        </ModalHeader>

        <ModalFooter>
          <Button color="primary"
            onClick={async () => {
              var res = await remove(props.collection, props.docID)
              if(res) {
                alert('Aula Removida Com sucesso')
                setIsOpen(!isOpen)
              } else {
                alert('Erro a remover a aula')
                setIsOpen(!isOpen)
              }
              
            }}
          >
            {props.removeLabel}
          </Button>
          <Button onClick={() => setIsOpen(!isOpen)}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  )
}

export default RemoveModal
