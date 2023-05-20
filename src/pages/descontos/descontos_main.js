import AdicionarDescontoModal from "components/modals/adicionar_desconto_modal"
import { map } from "lodash"
import { element } from "prop-types"
import React from "react"
import { useTranslation } from "react-i18next"
import { Button, Col, Container, Row } from "reactstrap"
import { Trash2, TrashFill } from "react-bootstrap-icons"
import { useSelector } from "react-redux"
import { selectclasses } from "store/localizacao/classes_reducer"
import { selectclubeid } from "store/localizacao/clube_id_reducer"
import { selectlocalizacao } from "store/localizacao/localizacao_reducer"
import { selectdescontos } from "store/descontos/descontos_reducer"
import { transformaDescontos } from "services/descontos/descontos_services"
import { Desconto } from "models/desconto"
import RemoveDescontoModal from "components/modals/remove_desconto_modal"

const Descontos = () => {
  var classes = useSelector(selectclasses)
  var clubeId = useSelector(selectclubeid)
  var localizacao = useSelector(selectlocalizacao)
  var descontos = useSelector(selectdescontos)

  const { t, i18n } = useTranslation()
  var listaAux = [1, 2, 3]
  console.log("Descontos:", descontos)
  var listaDeDescontos = transformaDescontos(JSON.parse(descontos), localizacao)
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="page-title-box">
            <Row>
              <Col xs={7} sm={8} md={9} lg={10}>
                <h6 className="page-title">{t("Descontos")}</h6>
              </Col>
              <Col>
                <AdicionarDescontoModal
                  classes={classes}
                  clubeId={clubeId}
                  localizacao={localizacao}
                ></AdicionarDescontoModal>
              </Col>
              <Row style={{ paddingTop: "20px" }}>
                <Col md={3}>
                  <h4>Classe</h4>
                </Col>
                <Col md={3}>
                  <h4>Horário</h4>
                </Col>
                <Col md={3}>
                  <h4>Dias</h4>
                </Col>
                <Col md={2}>
                  <h4>Preço</h4>
                </Col>
                <Col md={1}></Col>
              </Row>

              {listaDeDescontos.map((element, index) => {
                var desconto = new Desconto()
                desconto = element
                return (
                  <Row
                    key={index}
                    className={index % 2 == 0 ? "myList-even" : "myList-odd"}
                  >
                    <Col md={3}>
                      <p>{desconto.classe}</p>
                    </Col>
                    <Col md={3}>
                      <p>{desconto.horaInicial + " : " + desconto.horaFinal}</p>
                    </Col>
                    <Col md={3}>
                      <p>{desconto.semana}</p>
                    </Col>
                    <Col md={2}>
                      <p>60m: {desconto.preco["60"] + "€"}</p>
                      <p>90m: {desconto.preco["90"] + "€"}</p>
                      <p>120m: {desconto.preco["120"] + "€"}</p>
                    </Col>
                    <Col md={1}>
                      <RemoveDescontoModal
                        index={index}
                        desconto={desconto}
                        clubeId={clubeId}
                      ></RemoveDescontoModal>
                    </Col>
                  </Row>
                )
              })}
            </Row>
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Descontos
