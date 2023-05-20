import { parse } from "dotenv"
import { map } from "lodash"
import { Desconto } from "models/desconto"
import React from "react"
import { useSelector } from "react-redux"
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Col,
  Input,
  Row,
} from "reactstrap"
import {
  addDessconto,
  confirmaSeAHoraEValida,
  confirmaSeOSDadosSaoValidos,
} from "services/descontos/descontos_services"
import { selectclasses } from "store/localizacao/classes_reducer"

class AdicionarDescontoModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false,
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    })
  }

  render() {
    return (
      <div>
        <Button color="primary" onClick={this.toggle}>
          Adicionar Desconto
        </Button>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>Adicionar Desconto</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup style={{ paddingBottom: "10px" }} row>
                <Label sm={3} for="classeId">
                  Classes
                </Label>
                <Col sm={9}>
                  <Input type="select" name="select" id="classeId">
                    {this.props.classes.map((elem, index) => {
                      return <option>{elem}</option>
                    })}
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup style={{ paddingBottom: "10px" }} row>
                <Label sm={3} for="diasId">
                  Dias
                </Label>
                <Col sm={9}>
                  <Input type="select" name="select" id="diasId">
                    <option>Semana</option>
                    <option>Fins de semana e Feriados</option>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup style={{ paddingBottom: "10px" }} row>
                <Label sm={3} for="horaIncialId">
                  Hora Inicial
                </Label>
                <Col sm={4}>
                  <Input
                    type="time"
                    name="time"
                    id="horaIncialId"
                    placeholder="10"
                    onChange={e => {
                      var valor = confirmaSeAHoraEValida(e.target.value)
                      if (valor != true) {
                        document.getElementById("horaIncialErro").innerHTML =
                          valor
                      } else {
                        document.getElementById("horaIncialErro").innerHTML = ""
                      }
                    }}
                  />
                </Col>
                <Col sm={5}>
                  <span style={{ color: "#DD2222" }} id="horaIncialErro"></span>
                </Col>
              </FormGroup>
              <FormGroup style={{ paddingBottom: "10px" }} row>
                <Label sm={3} for="horaFinalId">
                  Hora Final
                </Label>
                <Col sm={4}>
                  <Input
                    type="time"
                    name="time"
                    id="horaFinalId"
                    placeholder="10"
                    onChange={e => {
                      var valor = confirmaSeAHoraEValida(e.target.value)
                      if (valor != true) {
                        document.getElementById("horaFinalErro").innerHTML =
                          valor
                      } else {
                        document.getElementById("horaFinalErro").innerHTML = ""
                      }
                    }}
                  />
                </Col>
                <Col sm={5}>
                  <span style={{ color: "#DD2222" }} id="horaFinalErro"></span>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={3} for="preco">
                  Preço
                </Label>
                <Col sm={4}>
                  <div className="input-group mb-3">
                    <input
                      onChange={e => console.log(e.target.value)}
                      type="number"
                      className="form-control"
                      placeholder="6.50"
                      step="0.01"
                      pattern="^\d+(?:\.\d{1,2})?$"
                      id="preco"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text" id="basic-addon2">
                        €
                      </span>
                    </div>
                  </div>
                </Col>
              </FormGroup>
            </Form>
            <p id="erroAdicionar" style={{ color: "#DD2222" }}></p>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={async () => {
                var validacao = confirmaSeOSDadosSaoValidos(
                  document.getElementById("horaIncialId").value,
                  document.getElementById("horaFinalId").value,
                  document.getElementById("preco").value
                )
                if (validacao) {
                  document.getElementById("erroAdicionar").innerHTML = ""
                  var desconto = new Desconto()
                  desconto.classe = document.getElementById("classeId").value
                  desconto.horaFinal =
                    document.getElementById("horaFinalId").value
                  desconto.horaInicial =
                    document.getElementById("horaIncialId").value
                  desconto.localizacao = this.props.localizacao
                  desconto.preco = parseFloat(
                    document.getElementById("preco").value
                  )
                  desconto.semana = document.getElementById("diasId").value
                  await addDessconto(desconto, this.props.clubeId)
                  !this.state.modal
                } else {
                  document.getElementById("erroAdicionar").innerHTML =
                    "Não pode adicionar porque existem campos inválidos"
                }
                console.log(validacao)
              }}
              color="primary"
            >
              Adicionar
            </Button>{" "}
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default AdicionarDescontoModal
