import React, { useState } from "react";
import DateTimePicker from "react-datetime-picker/dist/DateTimePicker";
import { MetaTags } from "react-meta-tags";
import { Button, Col, Container, Input, Row } from "reactstrap";



function RegistarJogador() {
    const [value, onChange] = useState(new Date())

    

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
                <h6 className="page-title">Dados</h6>
                    
              </Col>
            </Row>
          </div>
          <Row>
            <Col md={2}>
                Email
            </Col>
            <Col md={10}>
            <Input type="email"></Input>
            </Col>
          </Row>

          <Row style={{ paddingTop: "20px"}}>
            <Col md={2}>
                Password
            </Col>
            <Col md={10}>
            <Input type="password"></Input>
            </Col>
          </Row>
          <Row style={{paddingTop: "20px"}}>
          <Col  md={2}>
                Data de Nascimento
            </Col>
            <Col md={2}>
                
          <DateTimePicker

            disableClock={true}
                onChange={value => {
                onChange(value)
                    }}
                value={value}
            />
            </Col>
            </Row>
          <Row style={{ paddingTop: "20px"}}>
            <Col md={2}>
                Nome
            </Col>
            <Col md={10}>
            <Input type="text"></Input>
            </Col>
          </Row>
          <Row style={{ paddingTop: "20px"}}>
            <Col md={2}>
                CC
            </Col>
            <Col md={10}>
            <Input type="number"></Input>
            </Col>
          </Row>
          <Row style={{paddingTop: "60px"}}>
            <Col>
            <Button color="primary">
                Criar utilizador
            </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
     );
}

export default RegistarJogador;