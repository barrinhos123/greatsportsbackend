import React, { useEffect, useState } from "react"
import { DashCircle, PlusCircle } from "react-bootstrap-icons"
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
import { adicinarAlunosAAula } from "services/aulas/aulas_services"

function AdicionarEmails(props) {
  const [isOpen, setIsOpen] = useState(false)
  const [numeroDeEmailsAenviar, setNumeroDeEmailsAenviar] = useState(1)
  const [emailsI, setEmailsI] = useState([])

  function incrementaEmails() {
    setNumeroDeEmailsAenviar(numeroDeEmailsAenviar + 1)
  }

  function decremntaEmails() {
    setNumeroDeEmailsAenviar(numeroDeEmailsAenviar - 1)
  }

  function criarInputDeEmails() {
    var listaAux = []
    for (let index = 0; index < numeroDeEmailsAenviar; index++) {
      listaAux.push(index)
    }
    setEmailsI(listaAux)
  }

  useEffect(() => {
    criarInputDeEmails()
  }, [numeroDeEmailsAenviar])
  return (
    <React.Fragment>
      <Button
        onClick={() => {
          setIsOpen(!isOpen)
        }}
        color="transparent"
      >
        <PlusCircle></PlusCircle>
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
          Emails dos jogadores a adicionar
        </ModalHeader>
        <ModalBody>
          <Form style={{ paddingBottom: "20px" }}>
            {emailsI.map((elemnt, index) => {
              const indexp1 = index + 1
              return (
                <FormGroup style={{ paddingBottom: "10px" }} key={index}>
                  <Row style={{ alignItems: "center" }}>
                    <Col md={2}>
                      <Label for="email">Email</Label>
                    </Col>
                    <Col md={10}>
                      <Input
                        className="input-email"
                        type="email"
                        name={"email" + index}
                        id={"idemail" + index}
                        placeholder={"Email " + indexp1}
                        onChange={e => {
                          let items = [...emailsI]
                          items[index] = e.target.value
                          setEmailsI(items)
                          console.log(emailsI)
                        }}
                      />
                    </Col>
                  </Row>
                </FormGroup>
              )
            })}
          </Form>
          <Row>
            <Col md={1}>
              <Button
                onClick={() => {
                  incrementaEmails()
                  console.log(numeroDeEmailsAenviar)
                }}
              >
                <PlusCircle></PlusCircle>
              </Button>
            </Col>
            <Col md={1}>
              <Button
                onClick={() => {
                  decremntaEmails()
                  console.log(numeroDeEmailsAenviar)
                }}
              >
                <DashCircle></DashCircle>
              </Button>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => {}} color="primary">
            Adicionar Emails
          </Button>
          <Button
            onClick={() => {
              setIsOpen(!isOpen)
            }}
          >
            Canclear
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  )
}

export default AdicionarEmails
