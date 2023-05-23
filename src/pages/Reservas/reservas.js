import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Button, Col, Container, Row } from "reactstrap"
import firebase from "firebase/app"
import "firebase/firestore"
import { ArrowRightCircle } from "react-bootstrap-icons"
import { Link } from "react-router-dom"

const Reservas = () => {
  const { t, i18n } = useTranslation()
  const [listaDeReservas, setListaDeReservas] = useState([])
  const [listaDeReservasFiltrada, setListaDeReservasFiltrada] = useState([])

  async function getReservas(localizacao) {
    var horaIncial = new Date()
    horaIncial.setHours(0, 0, 0, 0)
    console.log("Hora inicial: ", horaIncial)
    console.log("getting reservas")
    try {
      firebase
        .firestore()
        .collection("reservas")
        .where("localizacao", "==", localizacao)
        .where(
          "horaIncial",
          ">=",
          firebase.firestore.Timestamp.fromDate(horaIncial)
        )
        .onSnapshot(docsSnaps => {
          var listaAux = []
          setListaDeReservas([])
          for (const element of docsSnaps.docs) {
            listaAux.push(element)
          }
          setListaDeReservasFiltrada(listaAux)
          setListaDeReservas(listaAux)
        })
      return true
    } catch (error) {
      console.error(error)
      return null
    }
  }

  function filtraReservas(filtro) {
    var asd = listaDeReservas.filter(elem => elem.data().estado == filtro)
    setListaDeReservasFiltrada(asd);
  }

  function resetAoFiltro() {
    setListaDeReservasFiltrada(listaDeReservas)
  }

  useEffect(() => {
    getReservas("Great Padel Vila Verde")
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">{t("Reservas")}</h6>
              </Col>
            </Row>
            
            <Row>
              <Col md={2}>
              <Button color="primary" onClick={() => {
                  filtraReservas('Confirmada')
              }}
              >Confirmadas</Button></Col>
               <Col md={2}>
              <Button color="primary" onClick={() => {
                  resetAoFiltro()
              }}
              >Todas</Button></Col>
            </Row>
            <Row style={{paddingTop: "20px"}}>
              <Col><h5>Jogador</h5></Col>
            </Row>
            <Row style={{paddingTop: "20px"}}>
              <Col><h5>Email</h5></Col>
            </Row>
            <Row style={{ paddingTop: "20px" }}>
              <Col className="list-title" md={3}>
                <h4>Reservada por</h4>
              </Col>
              <Col className="list-title" md={3}>
                <h4> Dia</h4>
              </Col>
              <Col className="list-title" md={2}>
                <h4> Início</h4>
              </Col>
              <Col className="list-title" md={2}>
                <h4> Estado</h4>
              </Col>
              <Col className="list-title" md={1}>
                <h4> Valor</h4>
              </Col>
            </Row>

            {listaDeReservasFiltrada.map((reservaSnap, index) => {
              const reserva = reservaSnap.data()
              var date = new Date()
              date = reserva.horaIncial.toDate()
              const horas = ("0" + date.getHours().toString()).slice(-2)
              const minutos = ("0" + date.getMinutes().toString()).slice(-2)
              return (
                <Row
                  style={{ alignItems: "start" }}
                  onClick={() => {
                    console.log("asdasd")
                  }}
                  key={index}
                  className={index % 2 == 0 ? "myList-even" : "myList-odd"}
                >
                  <Col md={3}>
                    <p>{reserva.jogador1estado.email}</p>
                  </Col>
                  <Col md={3}>
                    <p>{date.toDateString()}</p>
                  </Col>
                  <Col md={2}>
                    <p>{horas + " : " + minutos}</p>
                  </Col>
                  <Col md={2}>
                    {reserva.estado == "Anulada" ? (
                      <p style={{ color: "red" }}>{reserva.estado}</p>
                    ) : reserva.estado == "Pendente" ? (
                      <p style={{ color: "indigo" }}>{reserva.estado}</p>
                    ) : (
                      <p style={{ color: "green" }}>{reserva.estado}</p>
                    )}
                  </Col>
                  <Col md={1}>
                    <p>{reserva.valorTotal + "€"}</p>
                  </Col>
                  <Col md={1}>
                    <Link to={"/reservas/" + reservaSnap.id}>
                      <ArrowRightCircle></ArrowRightCircle>
                    </Link>
                  </Col>
                </Row>
              )
            })}
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Reservas
