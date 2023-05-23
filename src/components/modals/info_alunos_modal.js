import React, { useState } from "react"
import { Check, Trash2 } from "react-bootstrap-icons"
import { Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap"
import firebase from "firebase/app"
import "firebase/firestore"

function InfoAlunosModal(props) {
 
    const [email, setEmail] = useState('')
  const [tel, setTel] = useState('')
  const [cc, setCC] = useState('')
  const [nome, setNome] = useState('')

  const [colorBTN1, setColorBTN1] = useState("secondary")

  async function emailCheck(email, nomeId, ccId) {
    var primeiroNome 
    var ultimoNome
    var isEmail1 = await checkIfUserExists(email)

    if(Object.keys(isEmail1).length == 0){
      alert('O email não está registado')
      return false
    }
    if(typeof isEmail1.primeiroNome != "undefined") {
      primeiroNome = isEmail1.primeiroNome + " "
    }
    if(typeof isEmail1.ultimoNome != "undefined") {
      ultimoNome = isEmail1.ultimoNome
    }
    if(typeof isEmail1.numeroDoCC != "undefined") {
      setCC(isEmail1.numeroDoCC);
    } else {
      document.getElementById(ccId).value = null
    }
    setNome(primeiroNome + ultimoNome)

    if(typeof isEmail1.primeiroNome != "undefined" && typeof isEmail1.ultimoNome != "undefined" && typeof isEmail1.numeroDoCC != "undefined" ) {
      return true
    } 
    else {
      return false;
    }
  }

  const [isOpen, setIsOpen] = useState(false)
  return (
    <React.Fragment>
      <Button
        color="primary"
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        Info
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
        <ModalBody>
          <Form style={{ paddingBottom: "20px" }}>
          <FormGroup>
              <Row>
                <Col md={2}>
                  <p>Email</p>
                </Col>
                <Col md={8}>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    name="email"
                    id="emailId"
                  />
                </Col>
                <Col md={2}>
                <Button id="ckeckButton1" color={colorBTN1} onClick={async() => {
                    var check = await emailCheck(document.getElementById("emailId").value,"nomeId","ccId" )
                        if(check) {
                            setColorBTN1("primary")
                        } else {
                            setColorBTN1("secondary")
                        }
                    }}>
                    <Check></Check>
                    </Button>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col md={2}>
                  <p>Nome</p>
                </Col>
                <Col md={10}>
                  <Input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    type="text"
                    name="nome"
                    id="nomeId" 
                  />
                </Col>
               
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col md={2}>
                  <p>Tel</p>
                </Col>
                <Col md={10}>
                  <Input
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                    type="number"
                    name="tel"
                    id="telId" 
                  />
                </Col>
               
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col md={2}>
                  <p>CC</p>
                </Col>
                <Col md={10}>
                  <Input
                  value={cc}
                  onChange={(e) => setCC(e.target.value)}
                    type="cc"
                    name="cc"
                    id="ccId"
                   
                  />
                </Col>
                
              </Row>
            </FormGroup>
          </Form>
         
        </ModalBody>
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
            Remover Aluno
          </Button>
          <Button
            onClick={async() => {
              
              var data = {}
              data.email = email
              data.cc = cc
              data.nome = nome
              data.tel = tel
             await  adicionarAlunoEData(email, data,props.aulaId ).then((value) => {
                if(value) {
                  alert('Dados atualizados com sucesso')
                  setIsOpen(!isOpen)
                } else {
                  alert('Erro ao criar dados')
                  setIsOpen(!isOpen)
                }
              })
            }}
            color="primary"
          >
            Editar Dados
          </Button>
          <Button color="primary"
            onClick={async () => {
             
              
            }}
          >
            Enviar QRCode
          </Button>
          <Button onClick={() => setIsOpen(!isOpen)}>Voltar</Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  )
}

export default InfoAlunosModal
