export class Treinador {
  constructor(nome, email, aulas, createdAt, qrCode, localizacao) {
    this.nome = nome
    this.email = email
    this.aulas = aulas
    this.createdAt = createdAt
    this.qrCode = qrCode
    this.localizacao = localizacao
  }

  toFirebaseFormat() {
    var map = {
      nome: this.nome,
      email: this.email,
      aulas: null,
      createdAt: this.createdAt,
      qrCode: this.qrCode,
      localizacao: this.localizacao,
    }
    return map
  }
}
