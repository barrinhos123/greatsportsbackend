import React, { useState } from "react"
import { Trash2 } from "react-bootstrap-icons"
import { Alert, Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import firebase from "firebase/app"
import "firebase/firestore"
import { useSelector } from "react-redux"
import { selectclubeid } from "store/localizacao/clube_id_reducer"
import { selecttreinadores } from "store/treinadores/treinadores_reducer"

function RemoveTreinadoresModal(props) {
 
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
          Remover Treinador
        </ModalHeader>

        <ModalFooter>
          <Button
            onClick={async () => {
            var novosTreinadores = treinadoresRed.filter(elem => elem.email != props.email)
            var res = await updateTreinadores(novosTreinadores)
            if(res) {
                alert('Treinador Removido com sucesso')
                setIsOpen(!isOpen)
            } else {
                alert('Falha a Remover treinador')
                setIsOpen(!isOpen)
            }
            }}
          >
            Remover
          </Button>
          <Button onClick={() => setIsOpen(!isOpen)}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  )
}

export default RemoveTreinadoresModal

/* 
campos
6
classes
0
"Todos"
1
"Estudantes"
(string)
descontos
Todos
Fins de semana e Feriados
06:00 - 24:00
60
6.5
90
8
120
10
Semana
06:00 - 17:00
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
localizacao
"Great Padel Vila Verde"
preco
6
treinadores
0
email
"treinador@gmail.com"
nome
"Treinador 01"
1
email
"flutter@gmail.com"
nome
"asdasd"
2
email
"manuelbarrosnpg@gmail.coms"
nome
"Jilo Kui"
 */
