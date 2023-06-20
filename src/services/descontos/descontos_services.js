import firebase from "firebase/app"
import "firebase/firestore"
import { Desconto } from "models/desconto"

export function confirmaSeOSDadosSaoValidos(horaI, horaF, preco) {
  var horafAux = horaF
  if (horaF == "00:00") {
    horafAux = "24:00"
  }
  if (
    horaI < horafAux &&
    confirmaSeAHoraEValida(horaI) == true &&
    confirmaSeAHoraEValida(horafAux) == true &&
    preco != null &&
    preco != ""
  ) {
    return true
  } else {
    return false
  }
}

export function confirmaSeAHoraEValida(hora) {
  console.log("Horas value: ", hora)
  if (hora == null || hora == "") {
    return "Horário Inválido"
  }
  var horas = hora.substring(0, 2)
  var minutos = hora.substring(3, 5)

  if (minutos != "00" && minutos != "30") {
    return "Minutos inválidos"
  }
  return true
}

export async function addDessconto(descontoParam, clubeid) {
  try {
    console.log("A adicionar desconto")
    var desconto = new Desconto()
    desconto = descontoParam

    var formatedDesconto = desconto.formataDesconto(descontoParam)
    console.log(formatedDesconto)
    firebase
      .firestore()
      .collection("localizacao")
      .doc(clubeid)
      .set({ descontos: formatedDesconto }, { merge: true })
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getAllDescontos(localizacao) {
  try {
    firebase
      .firestore()
      .collection("descontos")
      .where("localizacao", "==", localizacao)
      .onSnapshot(value => {
        value.docs
      })
  } catch (error) {
    console.error(error)
    return null
  }
}

export function escolheOPrecoQueOUserVaiPagar(
  horaInicial,
  listaDeDescontos,
  dia,
  mapDosValoresDosUsers,
  listaDeEmailsAPagar
) {
  try {
    var duracao = document.getElementById("selectTime").value
    for (let index = 0; index < mapDosValoresDosUsers.length; index++) {
      var classe
      for (var element in mapDosValoresDosUsers[index].classes) {
        /* console.log(element) */
        classe = element
      }
      
      console.log("eclescolheOPrecoQueOUserVaiPagarasse")
      console.log(horaInicial);
      var asdasd = horaInicial.split(":")
      var asdasd1 = ("0" + asdasd[0]).slice(-2);
      var asdasd2 = ("0" + asdasd[1]).slice(-2);
      console.log(asdasd);
      console.log(asdasd1)
      console.log(asdasd2)
      horaInicial = asdasd1 + ":" + asdasd2;

      /* console.log(horaInicial) */

      var descontoARetornar = null
      var horario = listaDeDescontos[classe][dia]
      /* console.log(listaDeDescontos)
      console.log(classe)
      console.log(dia) */
      for (var elemnt in horario) {
        /* console.log("element")
        console.log(elemnt) */

        var horaI = elemnt.substring(0, 5)
        var horaf = elemnt.substring(8, 13)

        console.log(elemnt)
        console.log(horaI)
        console.log(horaf)
        var asd123 = horaInicial.replace(":" , "-");
        
        console.log(asd123)
        
        if (horaI <= asd123 && asd123 <= horaf) {
          descontoARetornar = listaDeDescontos[classe][dia][elemnt][duracao]
          if (listaDeEmailsAPagar[index] == true) {
            mapDosValoresDosUsers[index].temQuePagar = true
          } else {
            mapDosValoresDosUsers[index].temQuePagar = false
          }
          mapDosValoresDosUsers[index].valorAPagar = descontoARetornar
        }
      }
    }

    return mapDosValoresDosUsers
  } catch (error) {
    console.error(error)
    return null
  }
}

export function escolheOPrecoQueOUserVaiPagarSemRegisto(
  horaInicial,
  listaDeDescontos,
  dia,
  mapDosValoresDosUsers,
  listaDeEmailsAPagar
) {
  try {
    console.log("asd asd as dsad ")
    console.log(horaInicial)
    console.log(listaDeDescontos)
    console.log(dia)
    console.log(mapDosValoresDosUsers)
      var classe = "Todos"
      var descontoARetornar = null
      var horario = listaDeDescontos[classe][dia]
      for (var elemnt in horario) {
        console.log("element")
        console.log(elemnt)
        var horaI = elemnt.substring(0, 5)
        var horaf = elemnt.substring(8, 13)
        if (horaI < horaInicial && horaInicial < horaf) {
          descontoARetornar = listaDeDescontos[classe][dia][elemnt]
          mapDosValoresDosUsers[0].valorAPagar = descontoARetornar * 4
        }
    }

    return mapDosValoresDosUsers
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function removeDesconto(desconto, localId) {
  try {
    var newDesconto = new Desconto()

    newDesconto = desconto
    var horario = newDesconto.horaInicial + " - " + newDesconto.horaFinal
    firebase
      .firestore()
      .collection("localizacao")
      .doc(localId)
      .set(
        {
          descontos: {
            [newDesconto.classe]: {
              [newDesconto.semana]: {
                [horario]: firebase.firestore.FieldValue.delete(),
              },
            },
          },
        },
        { merge: true }
      )
    return true
  } catch (error) {
    console.error(error)
    return null
  }
}

export function transformaDescontos(map, localizacao) {
  var listaDeDescontos = []
  var classe
  var semana
  var horaInicial
  var horaFinal
  var horario
  var preco
  for (var classeMap in map) {
    classe = classeMap
    console.log(classe)
    for (var semanaMap in map[classe]) {
      semana = semanaMap
      console.log(semanaMap)
      for (var horarioAux in map[classe][semana]) {
        console.log(horarioAux)
        horaInicial = horarioAux.substring(0, 5)
        horaFinal = horarioAux.substring(8, 13)
        horario = horarioAux
        preco = map[classe][semana][horario]

        var desconto = new Desconto()
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

  return listaDeDescontos
}
