import firebase from "firebase/app"
import "firebase/firestore"

export class Contrato {
  constructor(
    createdAt,
    horario,
    startAt,
    entidade,
    diaDaSemana,
    expiresAt,
    localizacao,
    numeroDeJogos,
    periodo,
    userEmail,
    userEmails,
    expired,
    valor,
    userId,
    mapEmailId,
    tipo

  ) {
    this.createdAt = new Date()
    this.startAt = startAt
    this.entidade = entidade
    this.diaDaSemana = diaDaSemana
    this.expiresAt = expiresAt
    this.localizacao = localizacao
    this.numeroDeJogos = numeroDeJogos
    this.periodo = periodo
    this.userEmail = userEmail
    this.userEmails = userEmails
    this.expired = expired
    this.valor = valor
    this.userId = userId
    this.mapEmailId = mapEmailId
    this.tipo = tipo
    this.horario = horario
  }

  toJson() {
    var map = {
      createdAt: firebase.firestore.Timestamp.fromDate(this.createdAt),
      tipo: this.tipo,
      horario: this.horario,
      startAt: this.startAt,
      entidade: this.entidade,
      diaDaSemana: this.diaDaSemana,
      expiresAt: this.expiresAt,
      localizacao: this.localizacao,
      numeroDeJogos: this.numeroDeJogos,
      periodo: this.periodo,
      userEmail: this.userEmail,
      userEmails: this.userEmails,
      expired: this.expired,
      valor: this.valor,
      userId: this.userId,
      mapEmailId: this.mapEmailId,
    }
    return map
  }

  toFirebaseJson() {
    const formatStartsAt = firebase.firestore.Timestamp.fromDate(this.startAt)
    const formatExpiresAt = firebase.firestore.Timestamp.fromDate(
      this.expiresAt
    )
    const formatNumeroDeJogos = parseInt(this.numeroDeJogos)
    const formatedPreco = parseFloat(this.valor)
    var map = {
      createdAt : firebase.firestore.Timestamp.fromDate(this.createdAt),
      tipo: this.tipo,
      horario: this.horario,
      startAt: formatStartsAt,
      entidade: this.entidade,
      diaDaSemana: this.diaDaSemana,
      expiresAt: formatExpiresAt,
      localizacao: this.localizacao,
      numeroDeJogos: formatNumeroDeJogos,
      periodo: this.periodo,
      userEmail: this.userEmail,
      userEmails: this.userEmails,
      expired: this.expired,
      valor: formatedPreco,
      userId: this.userId,
      mapEmailId: this.mapEmailId,
    }
    return map
  }

  static fromJson(json) {
    const obj = JSON.parse(json)
    return new Contrato(
      obj.createdAt,
      obj.tipo,
      obj.startAt,
      obj.entidade,
      obj.diaDaSemana,
      obj.expiresAt,
      obj.localizacao,
      obj.numeroDeJogos,
      obj.periodo,
      obj.userEmail,
      obj.userEmails,
      obj.expired,
      obj.valor,
      obj.userId,
      obj.mapEmailId,
      obj.horario
    )
  }
}
