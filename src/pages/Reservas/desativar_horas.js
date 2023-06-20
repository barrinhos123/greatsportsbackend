import BloquearHorario from 'components/modals/bloquear_horario';
import React from 'react';
import { Trash, Trash2, Trash2Fill, Trash3, Trash3Fill } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Col, Container, Row } from 'reactstrap';
import { removerHorarioBloq } from 'services/reservas/reservas_services';
import { selectbloquearReservas } from 'store/bloquear_reservas/bloquear_reservas_reducer';
import { selectclubeid } from 'store/localizacao/clube_id_reducer';

function DesativarHoras() {
    const { t, i18n } = useTranslation()

    const horariosBloqueadosList = useSelector(selectbloquearReservas)
    const clubeID = useSelector(selectclubeid)

    console.log("horariosBloqueados")
    console.log(horariosBloqueadosList)

      

    return (  
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <div className="page-title-box">
                        <Row className="align-items-center">
                            <Col md={8}>
                                <h6 className="page-title">{t("Desativar Reservas")}</h6>
                            </Col>
                            <Col md={4}>
                                <BloquearHorario></BloquearHorario>
                            </Col>
                        </Row>
                    </div>
                        <Row>
                            <h4>Horários bloqueados</h4>
                        </Row>
                    <Row style={{paddingTop: "40px"}}>
                        <Col md={5}>
                          <p style={{fontWeight: 'bold'}} > Horário Inicial</p>
                        </Col>
                        <Col md={5}>
                            <p style={{fontWeight: 'bold'}} >Horário Final</p>
                        </Col>

                    </Row>
                    <Row>
                    {horariosBloqueadosList.map((elem,index) => {
                        console.log("patig")
                        console.log(elem)
                        return(
                        <Row  key={index + "row"}
                        className={index % 2 == 0 ? "myList-even" : "myList-odd"}
                        >
                    <Col key={"hi" + index} md={5}>
                             {elem['0'].toDate().toDateString() + ' ' +  ("0" + elem['0'].toDate().getHours().toString()).slice(-2) + ':' +  ("0" + elem['0'].toDate().getMinutes().toString()).slice(-2)   }
                        </Col>
                        <Col md={5}>
                        {elem['1'].toDate().toDateString() + ' ' +  ("0" + elem['1'].toDate().getHours().toString()).slice(-2) + ':' +  ("0" + elem['1'].toDate().getMinutes().toString()).slice(-2)   }
                        </Col>
                    <Col md={1}>
                        <Button onClick={async () => {
                            var aux = [].concat(horariosBloqueadosList)
                           const newList = aux.splice(index,1);
                            var res = await removerHorarioBloq(clubeID, newList)
                            if(res) {
                                alert("Removido")
                            }else {
                                alert("Erro a Remover")
                            }
                        }}>
                            <Trash2></Trash2>
                            </Button>
                    </Col>

                        </Row>)
                    })}
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default DesativarHoras;