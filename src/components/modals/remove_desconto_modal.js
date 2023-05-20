import React from "react"
import { Trash2 } from "react-bootstrap-icons"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import { removeDesconto } from "services/descontos/descontos_services"

class RemoveDescontoModal extends React.Component {
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
        <Button
          className={
            this.props.index % 2 == 0 ? "deleteIcon-even" : "deleteIcon-odd"
          }
          onClick={this.toggle}
        >
          <Trash2 size={15}></Trash2>
        </Button>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>Remover desconto</ModalHeader>
          <ModalBody>Tem a certeza que deseja remover este desconto?</ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={async () => {
                var asd = await removeDesconto(
                  this.props.desconto,
                  this.props.clubeId
                )
                if (asd) {
                  !this.state.modal
                } else {
                  console.log("nao esta a funcioar como suposto")
                  !this.state.modal
                }
              }}
            >
              Remover
            </Button>{" "}
            <Button color="secondary" onClick={this.toggle}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default RemoveDescontoModal
