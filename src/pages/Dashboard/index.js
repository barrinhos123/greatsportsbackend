import React from "react"
import { useTranslation } from "react-i18next"
import { MetaTags } from "react-meta-tags"
import { Button, Col, Container, Row } from "reactstrap"

function Dashboard() {
  const { t, i18n } = useTranslation()

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Great Padel</title>
        </MetaTags>
        <Container fluid>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">{t("Dashboard")}</h6>

                {/* <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">
                    {t("Adicionar nova Reserva")}
                  </li>
                </ol> */}
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Dashboard
