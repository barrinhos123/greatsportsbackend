export class Aula {
  constructor(
    localizacao,
    horaInicial,
    horaFinal,
    diaInicial,
    diaFinal,
    professor,
    alunos,
    alunosPAX,
    nivel,
    estado,
    nome,
    campos,
    weekDay
  ) {
    this.createdAt = new Date()
    this.weekDay = weekDay
    this.localizacao = localizacao
    this.horaInicial = horaInicial
    this.horaFinal = horaFinal
    this.diaInicial = diaInicial
    this.diaFinal = diaFinal
    this.professor = professor
    this.alunos = alunos
    this.alunosPAX = alunosPAX
    this.nivel = nivel
    this.estado = estado
    this.nome = nome
    this.campos = campos
  }

  toJSON() {
    return {
      createdAt: this.createdAt,
      weekDay: this.weekDay,
      localizacao: this.localizacao,
      horaInicial: this.horaInicial,
      horaFinal: this.horaFinal,
      diaInicial: this.diaInicial,
      diaFinal: this.diaFinal,
      professor: this.professor,
      alunos: this.alunos,
      alunosPAX: this.alunosPAX,
      nivel: this.nivel,
      estado: this.estado,
      nome: this.nome,
      campos: this.campos,
    }
  }

  static fromJSON(json) {
    const aula = new Aula(
      json.localizacao,
      json.horaInicial,
      json.horaFinal,
      new Date(json.diaInicial),
      new Date(json.diaFinal),
      json.professor,
      json.alunos,
      json.alunosPAX,
      json.nivel,
      json.estado,
      json.nome,
      json.campos
    )
    aula.createdAt = new Date(json.createdAt)
    aula.weekDay = json.weekDay
    return aula
  }
}
