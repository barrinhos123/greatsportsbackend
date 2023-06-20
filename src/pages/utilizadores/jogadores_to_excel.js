import React from 'react';
import { Button, Col, Container, Input, Row } from 'reactstrap';
import { useTranslation } from "react-i18next";  
import { enviaEmailParaUmJogador, enviarEmaiParaTodos } from 'services/email/email_services';
import { getAlllUsers } from 'services/useres/jogadores_services';
import fs from 'fs'



function JogadoresToExcel() {
    const { t, i18n } = useTranslation()

    function patig () {
        var asd = encodeURI(logo);
        console.log(asd)
    }

    return (  
        <React.Fragment>
            <div className="page-content">
        <Container fluid>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">{t("Enviar email a todos os utilizadores")}</h6>
              </Col>
            </Row>
            <Row style={{ paddingTop: "60px"}}>
                <Col md={2}>
                <h5>Assunto</h5>
                </Col>
                <Col>
                <Input type="textarea" name="text" id="subject"></Input>
                </Col>
                </Row>
            <Row style={{paddingTop: "40px", paddingBottom: "40px"}}>
                <Col md={2}>
                <h5>Corpo</h5>
                </Col>
                <Col>
                <Input type="textarea" name="text" id="body" />
                </Col>
            </Row>
               
            <Button color='primary'
                onClick={async () => {
                     getAlllUsers().then(async (value) => {
                        if( document.getElementById("subject").value.trim() != '' && document.getElementById("body").value.trim() != ''  ) { 
                            await enviarEmaiParaTodos(value,document.getElementById("body").value.trim(),document.getElementById("subject").value.trim(), null  )
                            } 
                    }) 
                    
                }}
            >
                Enviar Email
            </Button>
           
          </div>
        </Container>
        </div>
        </React.Fragment>
    );
}

export default JogadoresToExcel;


/* 

<h3>Caro cliente,</h3>

<p>Vimos por este meio comunicar-lhe o lançamento de uma nova atualização na App Great Sports.

<p>Durante estes primeiros dias, após o lançamento da aplicação, a nossa equipa melhorou e corrigiu alguns problemas e bugs que foram registados por parte de alguns utilizadores. 

<p>A usabilidade e experiência do utilizador foi melhorada, diminuimos também o tempo e processos necessários para concluir a sua reserva.

<p>Com esta nova atualização, pode realizar a sua reserva inserindo apenas os dados de 1 jogador.

<p>Caso pretenda, oferecemos também a possibilidade de realizar a reserva, juntamente com os outros jogadores. Assim, consegue parcelar os pagamentos, com a diferença de inserir apenas os e-mails dos restantes 3 jogadores.

<p>Com o objetivo de melhorar a sua experiência, trabalhamos diariamente na procura da melhor solução para os utilizadores. Por isso, é possível que no decorrer dos próximos dias ou semanas surja uma nova atualização.

<p>Pedimos desculpa por qualquer constrangimento que possa ter existido. Se existir algum problema ou dúvida na utilização da Aplicação, não hesite em solicitar a ajuda da nossa equipa.

<p>Estamos à distância de um clique!

<p>Aceda já à store do seu Smartphone e faça o Download ou a Atualização da App Great Sports.

<p>Esperamos a sua visita!<br>

<p>+351 969 714 124 <br>
+351 253 679 215<br>
geral@greatpadel.pt<br>
<p><p>
Atenciosamente,<br>
A equipa Great Padel
*/