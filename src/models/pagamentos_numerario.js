import firebase from "firebase/app"
import "firebase/firestore"

export class PagamentoNumerario {
  constructor(
    valor,
    valorAAdicionar,
    localizacao,
    userID,
    email,
    tipo,
    estado
  ) {
    this.valor = valor
    this.valorAAdicionar = valorAAdicionar
    this.localizacao = localizacao
    this.userID = userID
    this.email = email
    this.tipo = tipo
    this.estado = estado
  }

  firebaseFormat() {
    var map = {}
    map = {
      valor: this.valor,
      valorAAdicionar: this.valorAAdicionar,
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      localizacao: this.localizacao,
      userID: this.userID,
      email: this.email,
      tipo: this.tipo,
      estado: this.estado,
    }
    return map
  }
}
