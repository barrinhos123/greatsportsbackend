import { Reserva } from "models/reserva"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Col,
  Container,
  Row,
} from "reactstrap"
import { anularReservaPorUser, getReservaById } from "services/reservas/reservas_services"
import QRCode from "qrcode"
import { enviaEmailParaUmJogador } from "services/email/email_services"
import moment from "moment"
import EditarReservasModal from "components/modals/editar_reservas_modal"
import { convertCamps } from "services/consts"

function VerReservasScreen() {
  let { id } = useParams()
  const [reserva, setReservaData] = useState(new Reserva())
  const [isLoading, setIsLoading] = useState(true)

  const [qrCode1, setQrCode1] = useState("")
  const [qrCode2, setQrCode2] = useState("")
  const [qrCode3, setQrCode3] = useState("")
  const [qrCode4, setQrCode4] = useState("")

  const [isAnulaDisabled, setIsAnulaDisabled] = useState(true);

  function gerarQRCode1(qrCode) {
    QRCode.toDataURL(qrCode)
      .then(url => {
        console.log(url)
        setQrCode1(url)
      })
      .catch(err => {
        console.error(err)
      })
  }

  function gerarQRCode2(qrCode) {
    QRCode.toDataURL(qrCode)
      .then(url => {
        console.log(url)
        setQrCode2(url)
      })
      .catch(err => {
        console.error(err)
      })
  }

  function gerarQRCode3(qrCode) {
    QRCode.toDataURL(qrCode)
      .then(url => {
        console.log(url)
        setQrCode3(url)
      })
      .catch(err => {
        console.error(err)
      })
  }

  function gerarQRCode4(qrCode) {
    QRCode.toDataURL(qrCode)
      .then(url => {
        console.log(url)
        setQrCode4(url)
      })
      .catch(err => {
        console.error(err)
      })
  }

  useEffect(() => {
    getReservaById(id).then(value => { 
      if(value.estado == "Confirmada" || value.estado =="Pendente") {
        setIsAnulaDisabled(false);
      }
      var myDate = new Date(value.horaIncial*1000);
      var newDateObj = moment(myDate).subtract(180, 'm').toDate();
      console.log("newDateObj")
      console.log(newDateObj)
      gerarQRCode1(value.jogador1estado.qrcode.toString())
      gerarQRCode2(value.jogador2estado.qrcode.toString())
      gerarQRCode3(value.jogador3estado.qrcode.toString())
      gerarQRCode4(value.jogador4estado.qrcode.toString())
      setReservaData(value)
      setIsLoading(false)
    })
  }, [])

  if (isLoading) {
    return <h1>Loading...</h1>
  } else {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <div className="page-title-box">
              <Row>
              <Col md={8}>
                <h6 className="page-title">{reserva.jogador1estado.nome}</h6>
              </Col>
              <Col md={2}>
              <Button disabled={isAnulaDisabled} color={isAnulaDisabled ? "secondary" : "primary" } onClick={async ()=> {
                setIsAnulaDisabled(true)
               await  anularReservaPorUser(id).then((value) => {
                  if(value == true) {
                    alert("Reserva cancelada com sucesso. Até a reserva aparecer como cancelada podem demorar uns segundos")
                  }
                  else {
                    alert("Falha a cancelar a reserva");
                  }
                })  ;
              }}> Cancelar Reservar
              </Button>
              </Col>
              <Col md={2}>
              <EditarReservasModal reserva={reserva} reservaID={id} ></EditarReservasModal>
              
              </Col>
              </Row>
            </div>
            <Card style={{ padding: "20px" }}>
              <Row>
                <Col>
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    Campo:{" "}
                  </span>
                  {convertCamps[reserva.campo]}
                </Col>
                <Col>
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    Estado:{" "}
                  </span>
                  {reserva.estado}
                </Col>
                <Col>
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    Duração:{" "}
                  </span>
                  {reserva.duracao + " minutos"}
                </Col>

                <Col>
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    Horário:{" "}
                  </span>
                  {reserva.horaIncial.toDate().toDateString()}
                </Col>
                <Col>
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    Valor:{" "}
                  </span>
                  {reserva.valorTotal + "€"}
                </Col>
              </Row>
            </Card>
            <Row>
              <Col md={3}>
                <Card>
                  <CardBody>
                    <h4>Jogador 1</h4>
                    <CardSubtitle style={{ paddingTop: "10px" }}>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Nome:</span>{" "}
                        {reserva.jogador1estado.nome}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Email:</span>{" "}
                        {reserva.jogador1estado.email}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>CC:</span>{" "}
                        {reserva.jogador1estado.cc}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Pagamento:</span>{" "}
                        {reserva.jogador1estado.tipo}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>QrCode:</span>{" "}
                        {reserva.jogador1estado.qrcode}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>
                          Valor a Pagar:
                        </span>{" "}
                        {reserva.jogador1estado.valor + "€"}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Valor Pago:</span>{" "}
                        {reserva.jogador1estado.valorPago + "€"}
                      </p>
                      <p>
                        <img src={qrCode1} alt="qrCode"></img>
                      </p>
                      <Button
                        color="primary"
                        onClick={() => {
                          enviaEmailParaUmJogador(reserva,"jogador1estado")
                        }}
                      >
                        Enviar qrcode para o email
                      </Button>
                    </CardSubtitle>
                  </CardBody>
                </Card>
              </Col>
              <Col md={3}>
                <Card>
                  <CardBody>
                    <h4>Jogador 2</h4>
                    <CardSubtitle style={{ paddingTop: "10px" }}>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Nome:</span>{" "}
                        {reserva.jogador2estado.nome}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Email:</span>{" "}
                        {reserva.jogador2estado.email}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>CC:</span>{" "}
                        {reserva.jogador2estado.cc}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Pagamento:</span>{" "}
                        {reserva.jogador2estado.tipo}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>QrCode:</span>{" "}
                        {reserva.jogador2estado.qrcode}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>
                          Valor a Pagar:
                        </span>{" "}
                        {reserva.jogador2estado.valor + "€"}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Valor Pago:</span>{" "}
                        {reserva.jogador2estado.valorPago + "€"}
                      </p>
                      <p>
                        <img src={qrCode2} alt="qrCode"></img>
                      </p>
                      <Button
                        color="primary"
                        onClick={() => {
                          enviaEmailParaUmJogador(reserva,"jogador2estado")
                        }}
                      >
                        Enviar qrcode para o email
                      </Button>
                    </CardSubtitle>
                  </CardBody>
                </Card>
              </Col>
              <Col md={3}>
                <Card>
                  <CardBody>
                    <h4>Jogador 3</h4>
                    <CardSubtitle style={{ paddingTop: "10px" }}>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Nome:</span>{" "}
                        {reserva.jogador3estado.nome}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Email:</span>{" "}
                        {reserva.jogador3estado.email}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>CC:</span>{" "}
                        {reserva.jogador3estado.cc}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Pagamento:</span>{" "}
                        {reserva.jogador3estado.tipo}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>QrCode:</span>{" "}
                        {reserva.jogador3estado.qrcode}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>
                          Valor a Pagar:
                        </span>{" "}
                        {reserva.jogador3estado.valor + "€"}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Valor Pago:</span>{" "}
                        {reserva.jogador3estado.valorPago + "€"}
                      </p>
                      <p>
                        <img src={qrCode3} alt="qrCode"></img>
                      </p>
                      <Button
                        color="primary"
                        onClick={() => {
                          enviaEmailParaUmJogador(reserva,"jogador3estado")
                        }}
                      >
                        Enviar qrcode para o email
                      </Button>
                    </CardSubtitle>
                  </CardBody>
                </Card>
              </Col>
              <Col md={3}>
                <Card>
                  <CardBody>
                    <h4>Jogador 4</h4>
                    <CardSubtitle style={{ paddingTop: "10px" }}>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Nome:</span>{" "}
                        {reserva.jogador4estado.nome}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Email:</span>{" "}
                        {reserva.jogador4estado.email}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>CC:</span>{" "}
                        {reserva.jogador4estado.cc}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Pagamento:</span>{" "}
                        {reserva.jogador4estado.tipo}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>QrCode:</span>{" "}
                        {reserva.jogador4estado.qrcode}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>
                          Valor a Pagar:
                        </span>{" "}
                        {reserva.jogador4estado.valor + "€"}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Valor Pago:</span>{" "}
                        {reserva.jogador4estado.valorPago + "€"}
                      </p>
                      <p>
                        <img src={qrCode4} alt="qrCode"></img>
                      </p>
                      <Button
                        color="primary"
                        onClick={() => {
                          enviaEmailParaUmJogador(reserva,"jogador4estado")
                        }}
                      >
                        Enviar qrcode para o email
                      </Button>
                    </CardSubtitle>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    )
  }
}

export default VerReservasScreen
