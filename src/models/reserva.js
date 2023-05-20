export class Reserva {
  constructor(
    valorTotal,
    jogadores,
    estado1,
    estado2,
    estado3,
    estado4,
    horaDaReserva,
    duracaoDaReserva,
    userID,
    nomeDoCampo,
    localizacao
  ) {
    this.valorTotal = valorTotal
    this.jogadores = jogadores
    this.estado1 = estado1
    this.estado2 = estado2
    this.estado3 = estado3
    this.estado4 = estado4
    this.horaDaReserva = horaDaReserva
    this.duracaoDaReserva = duracaoDaReserva
    this.userID = userID
    this.nomeDoCampo = nomeDoCampo
    this.localizacao = localizacao
  }

  toHistoricoDeReservasDoUser() {
    var map = {
      startAt: this.horaDaReserva,
      campo: this.nomeDoCampo,
      jogadores: this.jogadores,
      localizacao: this.localizacao,
    }
    return map
  }
}

export class ProcuraReserva {
  constructor(localizacao, horaDaReserva, duracaoDaReserva) {
    this.localizacao = localizacao
    this.horaDaReserva = horaDaReserva
    this.duracaoDaReserva = duracaoDaReserva
  }

  fromReserva(reserva) {
    const procuraReserva = new ProcuraReserva(
      reserva.localizacao,
      reserva.horaDaReserva,
      reserva.duracaoDaReserva
    )
    return procuraReserva
  }
}

export class Estado {
  constructor(email, estado, tipo, valor, nome, numeroCC, numertl) {
    this.email = email
    this.estado = estado
    this.tipo = tipo
    this.valor = valor
    this.nome = nome
    this.numeroCC = numeroCC
    this.numertl = numertl
  }
}
