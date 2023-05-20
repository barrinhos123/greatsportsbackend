import { PagamentoNumerario } from "models/pagamentos_numerario"
import React, { useState } from "react"
import { Check } from "react-bootstrap-icons"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Container,
  Input,
  Row,
} from "reactstrap"
import { checkIfUserExists } from "services/reservas/reservas_services"
import { adicionarValorAoBancoDeHoras } from "services/useres/jogadores_services"
import { selectlocalizacao } from "store/localizacao/localizacao_reducer"

function AdicioanarBancoDeHoras() {
  const { t, i18n } = useTranslation()

  const [isEmailValid25, setIsEmailValid25] = useState(false)
  const [email25Id, setEmail25Id] = useState("")
  const [isEmailValid50, setIsEmailValid50] = useState(false)
  const [email50Id, setEmail50Id] = useState("")
  const [isEmailValid75, setIsEmailValid75] = useState(false)
  const [email75Id, setEmail75Id] = useState("")
  const [isEmailValid100, setIsEmailValid100] = useState(false)
  const [email100Id, setEmail100Id] = useState("")

  var localizacao = useSelector(selectlocalizacao)

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">{t("Adicionar Banco de Horas")}</h6>
              </Col>
            </Row>
          </div>
        </Container>
        <Row>
          <Col md={3} sm={6}>
            <Card style={{ textAlign: "center" }}>
              <CardBody>
                <h4>Valor 25€</h4>
                <p>Desconto 10€ </p>
                <h3 style={{ paddingBottom: "40px" }}>Recebe 35€</h3>
                <Row style={{ paddingBottom: "20px" }}>
                  <Col md={9} sm={9}>
                    <Input
                      type="email"
                      id="email25"
                      placeholder="Email do user"
                    ></Input>
                  </Col>
                  <Col md={2} sm={2}>
                    <Button
                      color={isEmailValid25 ? "primary" : "secondary"}
                      onClick={() => {
                        checkIfUserExists(
                          document.getElementById("email25").value
                        ).then(value => {
                          if (value == null) {
                            alert("O email não está registado na app")
                            setIsEmailValid25(false)
                            return
                          } else {
                            if (Object.keys(value).length === 0) {
                              alert("O email não está registado na app")
                              setIsEmailValid25(false)
                            } else {
                              setEmail25Id(value.userID)
                              setIsEmailValid25(true)
                            }
                          }
                        })
                      }}
                    >
                      <Check
                        style={
                          isEmailValid25
                            ? { color: "white" }
                            : { color: "black" }
                        }
                      ></Check>
                    </Button>
                  </Col>
                </Row>

                <Button
                  hidden={!isEmailValid25}
                  color="primary"
                  onClick={() => {
                    var pagamentoNUmerario = new PagamentoNumerario()

                    pagamentoNUmerario.email =
                      document.getElementById("email25").value
                    pagamentoNUmerario.estado = "PAGO"
                    pagamentoNUmerario.localizacao = localizacao
                    pagamentoNUmerario.tipo = "Numerário"
                    pagamentoNUmerario.userID = email25Id
                    pagamentoNUmerario.valor = 25
                    pagamentoNUmerario.valorAAdicionar = 35
                    adicionarValorAoBancoDeHoras(pagamentoNUmerario).then(
                      value => {
                        if (value == true) {
                          alert("Horas adicionadas com sucesso")
                        } else {
                          alert("Erro a adicionar horas")
                        }
                      }
                    )
                  }}
                >
                  Adicionar valor ao User
                </Button>
              </CardBody>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card style={{ textAlign: "center" }}>
              <CardBody>
                <h4>Valor 50€</h4>
                <p>Desconto 25€ </p>
                <h3 style={{ paddingBottom: "40px" }}>Recebe 75€</h3>
                <Row style={{ paddingBottom: "20px" }}>
                  <Col md={9} sm={9}>
                    <Input
                      type="email"
                      id="email50"
                      placeholder="Email do user"
                    ></Input>
                  </Col>
                  <Col md={2} sm={2}>
                    <Button
                      color={isEmailValid50 ? "primary" : "secondary"}
                      onClick={() => {
                        checkIfUserExists(
                          document.getElementById("email50").value
                        ).then(value => {
                          console.log(value)
                          if (value == null) {
                            alert("O email não está registado na app")
                            setIsEmailValid50(false)
                            return
                          } else {
                            if (Object.keys(value).length === 0) {
                              alert("O email não está registado na app")
                              setIsEmailValid50(false)
                            } else {
                              setEmail50Id(value.userID)
                              setIsEmailValid50(true)
                            }
                          }
                        })
                      }}
                    >
                      <Check
                        style={
                          isEmailValid50
                            ? { color: "white" }
                            : { color: "black" }
                        }
                      ></Check>
                    </Button>
                  </Col>
                </Row>

                <Button
                  hidden={!isEmailValid50}
                  color="primary"
                  onClick={() => {
                    var pagamentoNUmerario = new PagamentoNumerario()

                    pagamentoNUmerario.email =
                      document.getElementById("email50").value
                    pagamentoNUmerario.estado = "PAGO"
                    pagamentoNUmerario.localizacao = localizacao
                    pagamentoNUmerario.tipo = "Numerário"
                    pagamentoNUmerario.userID = email25Id
                    pagamentoNUmerario.valor = 50
                    pagamentoNUmerario.valorAAdicionar = 75
                    adicionarValorAoBancoDeHoras(pagamentoNUmerario).then(
                      value => {
                        if (value == true) {
                          alert("Horas adicionadas com sucesso")
                        } else {
                          alert("Erro a adicionar horas")
                        }
                      }
                    )
                  }}
                >
                  Adicionar valor ao User
                </Button>
              </CardBody>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card style={{ textAlign: "center" }}>
              <CardBody>
                <h4>Valor 75€</h4>
                <p>Desconto 40€ </p>
                <h3 style={{ paddingBottom: "40px" }}>Recebe 115€</h3>
                <Row style={{ paddingBottom: "20px" }}>
                  <Col md={9} sm={9}>
                    <Input
                      type="email"
                      id="email75"
                      placeholder="Email do user"
                    ></Input>
                  </Col>
                  <Col md={2} sm={2}>
                    <Button
                      color={isEmailValid75 ? "primary" : "secondary"}
                      onClick={() => {
                        checkIfUserExists(
                          document.getElementById("email75").value
                        ).then(value => {
                          console.log(value)
                          if (value == null) {
                            alert("O email não está registado na app")
                            setIsEmailValid75(false)
                            return
                          } else {
                            if (Object.keys(value).length === 0) {
                              alert("O email não está registado na app")
                              setIsEmailValid75(false)
                            } else {
                              setEmail75Id(value.userID)
                              setIsEmailValid75(true)
                            }
                          }
                        })
                      }}
                    >
                      <Check
                        style={
                          isEmailValid75
                            ? { color: "white" }
                            : { color: "black" }
                        }
                      ></Check>
                    </Button>
                  </Col>
                </Row>

                <Button
                  hidden={!isEmailValid75}
                  color="primary"
                  onClick={() => {}}
                >
                  Adicionar valor ao User
                </Button>
              </CardBody>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card style={{ textAlign: "center" }}>
              <CardBody>
                <h4>Valor 100€</h4>
                <p>Desconto 60€ </p>
                <h3 style={{ paddingBottom: "40px" }}>Recebe 160€</h3>
                <Row style={{ paddingBottom: "20px" }}>
                  <Col md={9} sm={9}>
                    <Input
                      type="email"
                      id="email100"
                      placeholder="Email do user"
                    ></Input>
                  </Col>
                  <Col md={2} sm={2}>
                    <Button
                      color={isEmailValid100 ? "primary" : "secondary"}
                      onClick={() => {
                        checkIfUserExists(
                          document.getElementById("email100").value
                        ).then(value => {
                          console.log(value)
                          if (value == null) {
                            alert("O email não está registado na app")
                            setIsEmailValid100(false)
                            return
                          } else {
                            if (Object.keys(value).length === 0) {
                              alert("O email não está registado na app")
                              setIsEmailValid100(false)
                            } else {
                              setEmail100Id(value.userID)
                              setIsEmailValid100(true)
                            }
                          }
                        })
                      }}
                    >
                      <Check
                        style={
                          isEmailValid100
                            ? { color: "white" }
                            : { color: "black" }
                        }
                      ></Check>
                    </Button>
                  </Col>
                </Row>

                <Button
                  hidden={!isEmailValid100}
                  color="primary"
                  onClick={() => {}}
                >
                  Adicionar valor ao User
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  )
}

export default AdicioanarBancoDeHoras
