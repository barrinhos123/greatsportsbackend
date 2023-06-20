import EditarFeriadosModal from 'components/modals/editar_feriado_modal';
import React from 'react';
import { Pencil, Trash2Fill } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { MetaTags } from 'react-meta-tags';
import { useSelector } from 'react-redux';
import { Button, Col, Container, Row } from 'reactstrap';
import { selectferiados } from 'store/descontos/feriados';

function Feriados() {
    const { t, i18n } = useTranslation()
    const feriados = useSelector(selectferiados);
    const jsonFeriados = JSON.parse(feriados);
    const mapFeriados = Object.entries(jsonFeriados)

    const sortedList = mapFeriados.sort((a,b) => {
       if(a > b) {
        return 1
       } else 
       return -1
    })

    console.log(mapFeriados)

       

    function convertDias(mes,dia) {
      var year = new Date().getFullYear();
      var date = new Date( year, (parseInt(mes) - 1), dia);
      return date;
    }

    return (
        <React.Fragment>
          <div className="page-content">
            <MetaTags>
              <title>Great Padel - Feriados</title>
            </MetaTags>
            <Container fluid>
              <div className="page-title-box">
                <Row className="align-items-center">
                  <Col md={8}>
                    <h6 className="page-title">{t("Feriados")}</h6>
                  </Col>
                  <Col md={4}>
                    <Button>
                        Adicionar Feriado
                    </Button>
                  </Col>
                </Row>
                
              </div>
                <Row>
                    <Col md={5}>
                        Dia
                    </Col>
                    <Col md={5}>
                        Nome
                    </Col>
                </Row>
              {sortedList.map((elem,index) => {
                
                return <Row key={elem[1] + index} className={index % 2 == 0 ? "myList-even" : "myList-odd"}>
                   <Col md={5} >
                       {convertDias(elem[0].substring(0,2), elem[0].substring(3,5)).toDateString()  } 
                   </Col>
                   <Col md={5} >
                        {elem[1]}
                   </Col>
                   <Col md={1}>
                     <EditarFeriadosModal feriado={elem}   key={ elem[1] + "edit" + index} ></EditarFeriadosModal>
                   </Col>
                   <Col md={1} key={ elem[1] + "trash" + index}>
                   <Trash2Fill>

                   </Trash2Fill>
                   </Col>
                </Row>
              }) }
            </Container>
          </div>
        </React.Fragment>
      )
}

export default Feriados;