import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Col, Container, Input, Label, Row } from "reactstrap";
import { pesquisarComprasByRequestId } from "services/useres/jogadores_services";

function DadosDoRequestID() {
    const { t, i18n } = useTranslation()

    const [tipo, setTipo] = useState("MBway")
    const [user, setUset] = useState({})
    const [isUser, setIsUser] = useState(false)
    const [nome, setNome] = useState(null);
    const [nif, setNif] = useState('');
    const [email, setEmail] = useState('');
    const [moloniId, setMoloniId] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');
    const [morada, setMorada] = useState('');
    const [preco, setPreco] = useState('');

     function showUser(value) {
        console.log(value);
        setUset(value)
        setNome('PATIG')
    /*  setUserId(value.id);
        setUser(value.data())
        const userAux = value.data()
        setclassesEspeciais(userAux.classesEspeciais)
        console.log(userAux.classesEspeciais)
        setEmail(userAux.email)
        setNome(userAux.primeiroNome + " " + userAux.ultimoNome)
        setNumeroCC(userAux.numeroDoCC)
        setNif(userAux.nif)*/
        setIsUser(true)
    } 
/* j5VsjjWpO0wSui */
    useEffect(() => {

    }, [isUser,user]);

    /* useEffect(() => {}, [isUser]) */

    return (  
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="page-title-box">
            <Row style={{paddingBottom: "20px"}} className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">{t("Procurar Pagamentos")}</h6>
              </Col>
            </Row>
            <Row style={{ alignItems: "center", paddingBottom: "20px" }}>
                
            <Col md={4}> 
            <Row>
            <Col md={6}>
                <Button color = {tipo == "MBway" ? "primary" : "secondary" }  onClick={() => {
                    setTipo("MBway")
                }} >MBway</Button>
                </Col>
            <Col md={6}>
                <Button color = {tipo == "Multibanco" ? "primary" : "secondary" }  onClick={() => {
                    setTipo("Multibanco")
                }} >Multibanco</Button>
                </Col>
                </Row>
            </Col>

            <Col md={4}>
              <Input id="email" type="email" placeholder="Email"></Input>
            </Col>
            
            <Col md={2}>
               
              <Button
                onClick={ () => {
                    pesquisarComprasByRequestId(tipo,document.getElementById("email").value )
                    .then((value) => {
                      if(value != null) {
                        showUser(value)
                      }
                     
                    })
                }}
                color="primary"
              >
                {" "}
                Pesquisar{" "}
              </Button>
            </Col>
          </Row>

          
            <Col md={12} >
            Nome: {user.nome}
            </Col>
            <Col style={{paddingTop: "20px"}} md={12} >
            Email: {user.email}
            </Col>
            <Col style={{paddingTop: "20px"}} md={12} >
            Valor: {user.valor}
            </Col>
            <Col style={{paddingTop: "20px"}} md={12} >
            Nif: {user.nif}
            </Col>
            <Col style={{paddingTop: "20px"}} md={12} >
            Morada: {user.morada}
            </Col>
            <Col style={{paddingTop: "20px"}} md={12} >
            Codigo Postal: {user.codigoPostal}
            </Col>
            <Col  style={{paddingTop: "20px"}} md={12} >
            Codigo Moloni: {user.codigoMoloni}
            </Col>
            <Col style={{paddingTop: "20px"}} md={12} >
            Pais: {user.country}
            </Col>
            <Col style={{paddingTop: "20px"}} md={12} >
            localidade: {user.localidade}
            </Col>
            <Col style={{paddingTop: "20px"}} md={12} >
            Tipo: {user.tipo}
            </Col>
          
            </div>
            
        </Container>
            </div>
            </React.Fragment>
    );
}

export default DadosDoRequestID;