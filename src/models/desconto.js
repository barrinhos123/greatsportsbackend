export class Desconto {
  constructor(localizacao, horaInicial, horaFinal, preco, semana, classe) {
    this.localizacao = localizacao
    this.horaInicial = horaInicial
    this.horaFinal = horaFinal
    this.preco = preco
    this.semana = semana
    this.classe = classe
  }

  formataDesconto(desconto) {
    var formatedDesconto
    var horario = desconto.horaInicial + " - " + desconto.horaFinal

    formatedDesconto = {
      [desconto.classe]: {
        [desconto.semana]: {
          [horario]: desconto.preco,
        },
      },
    }
    return formatedDesconto
  }

  fromDesconto(map, localizacao) {
    var listaDeDescontos = []
    var classe
    var semana
    var horaInicial
    var horaFinal
    var horario
    var preco
    for (var classeMap in map) {
      classe = classeMap
    }
    for (var semanaMap in map[classe]) {
      semana = semanaMap

      for (var horarioAux in map[classe][semana]) {
        horaInicial = horarioAux.substring(0, 5)
        horaFinal = horarioAux.substring(8, 13)
        horario = horarioAux

        for (var precoAux in map[classe][semana][horario]) {
          var desconto = new Desconto()
          preco = precoAux
          desconto.classe = classe
          desconto.semana = semana
          desconto.horaFinal = horaFinal
          desconto.horaInicial = horaInicial
          desconto.preco = preco
          desconto.localizacao = localizacao
          listaDeDescontos.push(desconto)
        }
      }
    }

    console.log("criou o desconto from desconto")
    console.log(desconto)
    return listaDeDescontos
  }
}
