import React, { useEffect, useState } from "react"
import { Check, Trash2 } from "react-bootstrap-icons"
import { Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap"
import firebase from "firebase/app"
import "firebase/firestore"
import { adicionarAlunoEData, removerAlunoDaAula } from "services/aulas/aulas_services"
import QRCode from "qrcode"


function InfoAlunosModal(props) {
 
    const [email, setEmail] = useState(props.email)
    console.log(email)
    const [tel, setTel] = useState(null )
    const [cc, setCC] = useState(null)
    const [nome, setNome] = useState(null) 
    const [qrCode, setQrCode] = useState(null) 

    
 
  const [colorBTN1, setColorBTN1] = useState("secondary")

  var alunoData = props.aula.alunoData[email]

  async function emailCheck(email, nomeId, ccId) {
    var primeiroNome 
    var ultimoNome
    var isEmail1 = await checkIfUserExists(email)

   

    if(Object.keys(isEmail1).length == 0){
      alert('O email não está registado')
      return false
    }
    if(typeof isEmail1.primeiroNome != "undefined") {
      primeiroNome = isEmail1.primeiroNome + " "
    }
    if(typeof isEmail1.ultimoNome != "undefined") {
      ultimoNome = isEmail1.ultimoNome
    }
    if(typeof isEmail1.numeroDoCC != "undefined") {
      setCC(isEmail1.numeroDoCC);
    } else {
      document.getElementById(ccId).value = null
    }
    setNome(primeiroNome + ultimoNome)

    if(typeof isEmail1.primeiroNome != "undefined" && typeof isEmail1.ultimoNome != "undefined" && typeof isEmail1.numeroDoCC != "undefined" ) {
      return true
    } 
    else {
      return false;
    }
  }

  function gerarQRCode(qrCode) {
    QRCode.toDataURL(qrCode)
      .then(url => {
        console.log(url)
        setQrCode(url)
      })
      .catch(err => {
        console.error(err)
      })
  }

  useEffect(() => {
   setTel(props.aula.alunoData[email].tel )
   setCC(props.aula.alunoData[email].cc)
   setNome(props.aula.alunoData[email].nome) 

   if( typeof props.aula.alunoData[email].qrCode != "undefined") {
    gerarQRCode(props.aula.alunoData[email].qrCode.toString())
   }
    
  }, [])

  const [isOpen, setIsOpen] = useState(false)
  return (
    <React.Fragment>
      <Button
        color="primary"
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        Info
      </Button>
      <Modal
        isOpen={isOpen}
        toggle={() => {
          setIsOpen(!isOpen)
        }}
      >
        <ModalHeader
          toggle={() => {
            setIsOpen(!isOpen)
          }}
        >
          {props.titulo}
        </ModalHeader>
        <ModalBody>
          <Form style={{ paddingBottom: "20px" }}>
          <FormGroup>
              <Row>
                <Col md={2}>
                  <p>Email</p>
                </Col>
                <Col md={8}>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    name="email"
                    id="emailId"
                  />
                </Col>
                <Col md={2}>
                <Button id="ckeckButton1" color={colorBTN1} onClick={async() => {
                    var check = await emailCheck(document.getElementById("emailId").value,"nomeId","ccId" )
                        if(check) {
                            setColorBTN1("primary")
                        } else {
                            setColorBTN1("secondary")
                        }
                    }}>
                    <Check></Check>
                    </Button>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col md={2}>
                  <p>Nome</p>
                </Col>
                <Col md={10}>
                  <Input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    type="text"
                    name="nome"
                    id="nomeId" 
                  />
                </Col>
               
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col md={2}>
                  <p>Tel</p>
                </Col>
                <Col md={10}>
                  <Input
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                    type="number"
                    name="tel"
                    id="telId" 
                  />
                </Col>
               
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col md={2}>
                  <p>CC</p>
                </Col>
                <Col md={10}>
                  <Input
                  value={cc}
                  onChange={(e) => setCC(e.target.value)}
                    type="cc"
                    name="cc"
                    id="ccId"
                   
                  />
                </Col>
                
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col md={2}>
                  <p>QrCode</p>
                </Col>
                <Col md={10}>
                <p>
                  {qrCode != null ?    <img src={qrCode } alt="qrCode"></img> : null}
             
                </p>
                </Col>
                
              </Row>
            </FormGroup>
          </Form>
         
        </ModalBody>
        <ModalFooter>
        <Button
            onClick={async() => {

              var listaAlunosAux = [].concat(props.aula.alunos)
              var jsonAlunosDataAux = props.aula.alunoData;

              const index = listaAlunosAux.indexOf(email);
              const x = listaAlunosAux.splice(index, 1);

              delete jsonAlunosDataAux[email];

              console.log(`myArray values: ${listaAlunosAux}`);
              console.log(jsonAlunosDataAux)

              await removerAlunoDaAula(props.aulaId,listaAlunosAux,jsonAlunosDataAux )
            
              var data = {}
              data.email = email
              data.cc = cc
              data.nome = nome
              data.tel = tel
              
              await  adicionarAlunoEData(email, data,props.aulaId ).then((value) => {
                if(value) {
                  alert('Dados atualizados com sucesso')
                  setIsOpen(!isOpen)
                } else {
                  alert('Erro ao atualizar dados')
                  setIsOpen(!isOpen)
                }
              }) 
            }}
            color="primary"
          >
            Editar Dados
          </Button>
         
          <Button color="primary"
            onClick={async () => {
             
              
            }}
          >
            Enviar QRCode
          </Button>
          <Button color="danger"
            onClick={async () => {
              var listaAlunosAux = [].concat(props.aula.alunos)
              var jsonAlunosDataAux = props.aula.alunoData;

              const index = listaAlunosAux.indexOf(email);
              const x = listaAlunosAux.splice(index, 1);

              delete jsonAlunosDataAux[email];

              console.log(`myArray values: ${listaAlunosAux}`);
              console.log(jsonAlunosDataAux)

              var res = await removerAlunoDaAula(props.aulaId,listaAlunosAux,jsonAlunosDataAux )
              if(res) {
                alert('Aluno Removido com sucesso')
                setIsOpen(!isOpen)
              } else {
                alert('Erro a remover aluno')
                setIsOpen(!isOpen)
              } 
              
            }}
          >
            Remover Aluno
          </Button>
          
          <Button onClick={() => setIsOpen(!isOpen)}>Voltar</Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  )
}

export default InfoAlunosModal
