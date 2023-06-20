import AdicionarContratosModal from 'components/modals/adicionar_contratos_modal';
import AdicionarContratroEntidadesModal from 'components/modals/adicionar_contrato_entidades';
import AdicionarContratosPeriodicoModal from 'components/modals/adicionar_contrato_periodico';
import firebase from "firebase/app"
import React, { useEffect, useState } from 'react';
import { Pencil } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { Col, Container, Row } from 'reactstrap';
import { contratosCollection } from 'services/consts';


function ContratosPeriodicos() {
    
    const { t, i18n } = useTranslation();
    const [contratos, setContratos] = useState([])

    async function getContratosPeriodicos(localizacao) {
        try {
          var listaAux = []
          firebase
            .firestore()
            .collection(contratosCollection)
            .where("localizacao", "==", localizacao).where("tipo", "==", "periodico")
            .onSnapshot(docsSnap => {
              docsSnap.docs.forEach(element => {
                console.log(element.data())
                listaAux.push(element)
              })
              setContratos(listaAux)
            })
        } catch (error) {
          console.error(error)
        }
      }
      
      useEffect(() => {
        getContratosPeriodicos("Great Padel Vila Verde")
      }, [])

    return (  
        <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">{t("Contratos")}</h6>
              </Col>
              <Col color="primary" md={2}>
                <AdicionarContratosPeriodicoModal></AdicionarContratosPeriodicoModal>
              </Col>
            </Row>
            <Row style={{ paddingTop: "40px" }}>
              <Col className="list-title" md={3}>
                <h4>Nome</h4>
              </Col>
              <Col className="list-title" md={3}>
                <h4>Expira em</h4>
              </Col>
              <Col className="list-title" md={2}>
                <h4>Periodo</h4>
              </Col>
              <Col className="list-title" md={2}>
                <h4> Nr de Jogos</h4>
              </Col>
              <Col className="list-title" md={1}>
                <h4> Valor</h4>
              </Col>
            </Row>
            {contratos.map((element, index) => {
              const data = element.data()
              return (
                <Row
                  key={index}
                  className={index % 2 == 0 ? "myList-even" : "myList-odd"}
                >
                  <Col md={3}>
                    {data.entidade == null ? data.userEmail : data.entidade}
                  </Col>
                  <Col md={3}>
                    <p>{data.expiresAt.toDate().toDateString()}</p>
                  </Col>
                  <Col md={2}>
                    <p>{data.periodo}</p>
                  </Col>
                  <Col md={2}>
                    <p>{data.numeroDeJogos}</p>
                  </Col>
                  <Col md={1}>
                    <p>{data.valor + "€"}</p>
                  </Col>
                  <Col md={1}>
                    <div style={{ marginBottom: "5px" }}>
                      <Button
                        className={
                          index % 2 == 0 ? "deleteIcon-even" : "deleteIcon-odd"
                        }
                      >
                        <Pencil size={15}></Pencil>
                      </Button>
                    </div>
                  </Col>
                </Row>
              )
            })}
             </div>
            </Container>
            </div>
            </React.Fragment>
    );
}

export default ContratosPeriodicos;