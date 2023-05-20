import firebase from "firebase/app"
import "firebase/firestore"
import { ProcuraReserva, Reserva } from "models/reserva"
import {
  aulasCollection,
  listaDeFeriados2022,
  localizacaoCollection,
  reservasCollection,
  usersCollection,
} from "services/consts"
import "firebase/auth"
import Reservas from "pages/Reservas/reservas"
import axios from "axios"
import { element, func } from "prop-types"

const pagamentosMBwayCollection = "pagamentosMBway"

function subtractHours(date, hours) {
  var copiedDate = new Date(date.getTime())
  copiedDate.setHours(copiedDate.getHours() - hours)
  return copiedDate
}
/* 
Se nao for usado remover
function addHours(date, minutes) {
  var copiedDate = new Date(date.getTime())
  var hours = minutes / 60
  copiedDate.setHours(copiedDate.getHours() + hours)
  console.log(copiedDate)
  return copiedDate
} */

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000)
}

export async function retornaCamposIndisponíveisNaHora(procuraReserv) {
  var listaDeCamposIndisponiveis = []
  var procuraReserva = new ProcuraReserva()
  procuraReserva = procuraReserv
  console.log("bp1")
  var horaInicial = procuraReserva.horaDaReserva
  var horaInicialParaProcurarReserva = addMinutes(
    procuraReserva.horaDaReserva,
    -procuraReserva.duracaoDaReserva
  )
  var horaFinal = addMinutes(
    procuraReserva.horaDaReserva,
    procuraReserva.duracaoDaReserva
  )
  console.log("PATIG0")
  console.log(procuraReserva.localizacao)
  console.log(horaInicial), console.log(horaFinal)
  try {
    await firebase
      .firestore()
      .collection(reservasCollection)
      .where("localizacao", "==", "Great Padel Vila Verde")
      .where(
        "horaIncial",
        ">=",
        firebase.firestore.Timestamp.fromDate(horaInicialParaProcurarReserva)
      )
      .where(
        "horaIncial",
        "<=",
        firebase.firestore.Timestamp.fromDate(horaFinal)
      )
      .get()
      .then(value => {
        console.log("Resultados das reservas")
        console.log(value.docs.length)
        for (var element of value.docs) {
          var hi = element.data().horaIncial
          var hf = element.data().horaFinal
          var rhi = firebase.firestore.Timestamp.fromDate(horaInicial)
          var rhf = firebase.firestore.Timestamp.fromDate(horaFinal)
          console.log("patig")
          console.log(hi.toDate())
          console.log(hf.toDate())
          console.log(rhi.toDate())
          console.log(rhf.toDate())
          console.log(hi >= rhi && hf > rhf && rhf > hi)
          console.log(hi <= rhi && hf <= rhf && rhi < hf)
          console.log(hi >= rhi && hi < rhf)
          console.log(hf > rhi && hf <= rhf)
          console.log(hi <= rhi  && hf >= rhf)
          if (element.data().estado != 'Anulada') {
            if (hi >= rhi && hf > rhf && rhf > hi) {
              listaDeCamposIndisponiveis.push(element.data().campo)
            }
            if (hi <= rhi && hf <= rhf && rhi < hf) {
              listaDeCamposIndisponiveis.push(element.data().campo)
            }
            if (hi >= rhi && hi < rhf) {
              listaDeCamposIndisponiveis.push(element.data().campo)
            }
            if (hf > rhi && hf <= rhf) {
              listaDeCamposIndisponiveis.push(element.data().campo)
            }
            if (hi <= rhi  && hf >= rhf) {
              listaDeCamposIndisponiveis.push(element.data().campo)
            }
          }

          /* if (rhi <= hi && hi < rhf) {
            listaDeCamposIndisponiveis.push(element.data().campo)
          }
          if (hi <= rhi && rhi < hf) {
            listaDeCamposIndisponiveis.push(element.data().campo)
          }
          if (hi <= rhi && rhf <= hf) {
            listaDeCamposIndisponiveis.push(element.data().campo)
          } */
          
        }
      })

    //Coverter o horario da Reserva para um tempo compativel com o das aulas. Formato-> 00:00
    var horaIncialComp = ("0" + horaInicial.getHours()).slice(-2)
    var minutosInicialComp = ("0" + horaInicial.getMinutes()).slice(-2)
    var horaFinalComp = ("0" + horaFinal.getHours()).slice(-2)
    var minutosFinalComp = ("0" + horaFinal.getMinutes()).slice(-2)
    var horaInicialFormat1 = horaIncialComp + ":" + minutosInicialComp
    var horaInicialFormat2 = horaFinalComp + ":" + minutosFinalComp

    await firebase
      .firestore()
      .collection(aulasCollection)
      .where("localizacao", "==", procuraReserva.localizacao)
      .where("weekDay", "==", procuraReserva.horaDaReserva.getDay())
      .where("horaInicial", ">=", horaInicialFormat1)
      .where("horaInicial", "<=", horaInicialFormat2)
      .get()
      .then(value => {
        if (value.docs.length != 0) {
          console.log("Resultado das aulas ")
          console.log(value.docs.length)
          for (var elementa of value.docs) {
            if (elementa.data().estado != "Anulada") {
              var aulasHi = elementa.data().horaInicial
              var aulasHf = elementa.data().horaFinal

              var horaIncialAula = ("0" + horaInicial.getHours()).slice(-2)
              var minutosInicialAula = ("0" + horaInicial.getMinutes()).slice(
                -2
              )
              var horaFinalAula = ("0" + horaFinal.getHours()).slice(-2)
              var minutosFinalAula = ("0" + horaFinal.getMinutes()).slice(-2)

              var aulasRhi = horaIncialAula + ":" + minutosInicialAula
              var aulasRhf = horaFinalAula + ":" + minutosFinalAula

              console.log(aulasRhi)
              console.log(aulasRhf)
              console.log(aulasHi)
              console.log(aulasHf)

              if (aulasRhi <= aulasHi && aulasHi < aulasRhf) {
                for (
                  let index = 0;
                  index < elementa.data().campos.length;
                  index++
                ) {
                  listaDeCamposIndisponiveis.push(elementa.data().campos[index])
                }
              }
              if (aulasHi <= aulasRhi && aulasRhi < aulasHf) {
                for (
                  let index = 0;
                  index < elementa.data().campos.length;
                  index++
                ) {
                  listaDeCamposIndisponiveis.push(elementa.data().campos[index])
                }
              }
              if (aulasHi <= aulasRhi && aulasRhf <= aulasHf) {
                for (
                  let index = 0;
                  index < elementa.data().campos.length;
                  index++
                ) {
                  listaDeCamposIndisponiveis.push(elementa.data().campos[index])
                }
              }
              console.log(listaDeCamposIndisponiveis)
            }
          }
        }
      })

    return listaDeCamposIndisponiveis
  } catch (error) {
    console.log(error)
    return listaDeCamposIndisponiveis
  }
}

export async function editarDadosReserva(reservaId, jogador1estado,jogador2estado
,jogador3estado
,jogador4estado
) {
  try {
    console.log(reservaId)
    
    await firebase
      .firestore()
      .collection(reservasCollection)
      .doc(reservaId).set({
        jogador1estado,jogador2estado,jogador3estado,jogador4estado
      },{merge: true})
      return true;
  } catch (error) {
    console.log(error)
    return null
  }
}

//MUdar esta função para ir buscar a classe de cada jogador
export async function checkIfUserExists(email) {
  try {
    return firebase
      .firestore()
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get()
      .then(value => {
        if (value.docs.length == 0) {
          return {}
        } else {
          var user = value.docs.at(0).data()
          user.userID = value.docs.at(0).id
          return user
        }
      })
  } catch (error) {
    console.log(error)
    return null
  }
}

/* export async function checkIfAllUsersExist({
  email1,
  email2,
  email3,
  email4,
  pagamento1,
  pagamento2,
  pagamento3,
  pagamento4,
}) {
  var listaDeEmails = []
  var listaDeEmailsInvalidos = []
  var mapEmailsIds = {}

  await checkIfUserExists(email1).then(userSnap => {
    mapEmailsIds[email1] = null
    if (userSnap == null) {
      if (pagamento1 == "saldo") {
        listaDeEmailsInvalidos.add(email1)
      } else {
        listaDeEmails.add(email1)
      }
    } else {
      mapEmailsIds[email1] = userSnap.id
    }
  })

  await checkIfUserExists(email2).then(userSnap => {
    mapEmailsIds[email2] = null
    if (userSnap == null) {
      if (pagamento2 == "saldo") {
        listaDeEmailsInvalidos.add(email2)
      } else {
        listaDeEmails.add(email2)
      }
    } else {
      mapEmailsIds[email2] = userSnap.id
    }
  })

  await checkIfUserExists(email3).then(userSnap => {
    mapEmailsIds[email3] = null
    if (userSnap == null) {
      if (pagamento3 == "saldo") {
        listaDeEmailsInvalidos.add(email3)
      } else {
        listaDeEmails.add(email3)
      }
    } else {
      mapEmailsIds[email3] = userSnap.id
    }
  })

  await checkIfUserExists(email4).then(userSnap => {
    mapEmailsIds[email4] = null
    if (userSnap == null) {
      if (pagamento4 == "saldo") {
        listaDeEmailsInvalidos.add(email4)
      } else {
        listaDeEmails.add(email4)
      }
    } else {
      mapEmailsIds[email4] = userSnap.id
    }
  })

  if (listaDeEmailsInvalidos.length == 0) {
    return [listaDeEmails, mapEmailsIds]
  } else {
    var strg =
      "É necessário conta para efetuar o pagamento através de saldo. Os emails\n"
    listaDeEmailsInvalidos.forEach(element => {
      strg = strg + element + "\n"
    })
    strg += "não estão registados"
    return strg
  }
} */

function getRandomQrcode(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

/* async function adicionarReservaALocalizacao(localID, reserva, reservaID) {
  try {
    firebase.firestore().collection(localizacaoCollection).doc(localID).set(
      {
        reservas: { reservaID:
          {reservadaPor:  }},
      },
      { merge: true }
    )
    return true
  } catch (error) {
    console.log(error)
    return null
  }
} */

export async function criarNovaReserva(reservav, mapDosValoresDosUsers,semRegisto) {
  console.log("Map dos Valores dos Users: id em criar nova reserva ")
  console.log(mapDosValoresDosUsers)
  var reserva = new Reserva()
  reserva = reservav

  var qrCode1 = getRandomQrcode(1, 4194302)
  var qrCode2 = getRandomQrcode(4194303, 8388608)
  var qrCode3 = getRandomQrcode(8388609, 12582911)
  var qrCode4 = getRandomQrcode(12582912, 16777215)

  var docRef = firebase.firestore().collection("reservas").doc()

  var horaFinal = addMinutes(
    reserva.horaDaReserva,
    parseInt(reserva.duracaoDaReserva)
  )
  var horarioTimeStamp = firebase.firestore.Timestamp.fromDate(
    reserva.horaDaReserva
  )
  var horarioFinalTimeStamp = firebase.firestore.Timestamp.fromDate(horaFinal)
  var createdAt = firebase.firestore.Timestamp.fromDate(new Date())

  var expiresIn = firebase.firestore.Timestamp.fromDate(
    addMinutes(new Date(), 5)
  )

  if (typeof mapDosValoresDosUsers[0].userID == "undefined") {
    mapDosValoresDosUsers[0].userID = null
  }
  if (typeof mapDosValoresDosUsers[1].userID == "undefined") {
    mapDosValoresDosUsers[1].userID = null
  }
  if (typeof mapDosValoresDosUsers[2].userID == "undefined") {
    mapDosValoresDosUsers[2].userID = null
  }
  if (typeof mapDosValoresDosUsers[3].userID == "undefined") {
    mapDosValoresDosUsers[3].userID = null
  }

  var valorTotalPagoAux = 0
  if (reserva.estado1.tipo == "Numerário") {
    valorTotalPagoAux = valorTotalPagoAux + reserva.estado1.valor
  }
  if (reserva.estado2.tipo == "Numerário") {
    valorTotalPagoAux = valorTotalPagoAux + reserva.estado2.valor
  }
  if (reserva.estado3.tipo == "Numerário") {
    valorTotalPagoAux = valorTotalPagoAux + reserva.estado3.valor
  }
  if (reserva.estado4.tipo == "Numerário") {
    valorTotalPagoAux = valorTotalPagoAux + reserva.estado4.valor
  }
  console.log("reservav");
  console.log(reservav);
 /*  await gerarReferenciaMultibanco(reserva, docRef) */
  await gerarReferenciaMbway(reserva, docRef.id)
  try {
    await firebase
      .firestore()
      .collection("reservas")
      .doc(docRef.id)
      .set({
        isUpdated: reserva.isUpdated,
        jogadores: reserva.jogadores,
        jogador1estado: {
          qrcode: qrCode1,
          valorPago:
            reserva.estado1.tipo == "Numerário" ? reserva.estado1.valor : 0,
          numertl: reserva.estado1.numertl,
          nome: reserva.estado1.nome,
          cc: reserva.estado1.numeroCC,
          email: reserva.estado1.email,
          estado: reserva.estado1.estado,
          tipo: reserva.estado1.tipo,
          valor: reserva.estado1.valor,
          userID: mapDosValoresDosUsers[0].userID,
          contrato: 0,
        },
        jogador2estado: {
          qrcode: qrCode2,
          valorPago:
            reserva.estado2.tipo == "Numerário" ? reserva.estado2.valor : 0,
          numertl: reserva.estado2.numertl,
          nome: reserva.estado2.nome,
          cc: reserva.estado2.numeroCC,
          email: reserva.estado2.email,
          estado: reserva.estado2.estado,
          tipo: reserva.estado2.tipo,
          valor: reserva.estado2.valor,
          userID: mapDosValoresDosUsers[1].userID,
          contrato: 0,
        },
        jogador3estado: {
          qrcode: qrCode3,
          valorPago:
            reserva.estado3.tipo == "Numerário" ? reserva.estado3.valor : 0,
          numertl: reserva.estado3.numertl,
          nome: reserva.estado3.nome,
          cc: reserva.estado3.numeroCC,
          email: reserva.estado3.email,
          estado: reserva.estado3.estado,
          tipo: reserva.estado3.tipo,
          valor: reserva.estado3.valor,
          userID: mapDosValoresDosUsers[2].userID,
          contrato: 0,
        },
        jogador4estado: {
          qrcode: qrCode4,
          valorPago:
            reserva.estado4.tipo == "Numerário" ? reserva.estado4.valor : 0,
          numertl: reserva.estado4.numertl,
          nome: reserva.estado4.nome,
          cc: reserva.estado4.numeroCC,
          email: reserva.estado4.email,
          estado: reserva.estado4.estado,
          tipo: reserva.estado4.tipo,
          valor: reserva.estado4.valor,
          userID: mapDosValoresDosUsers[3].userID,
          contrato: 0,
        },
        createdAt: createdAt,
        expiresIn: expiresIn,
        duracao: reserva.duracaoDaReserva,
        campo: reserva.nomeDoCampo,
        horaIncial: horarioTimeStamp,
        horaFinal: horarioFinalTimeStamp,
        userID: reserva.userID,
        estado:
          valorTotalPagoAux == reserva.valorTotal ? "Confirmada" : "Pendente",
        jogadores: [
          reserva.estado1.email,
          reserva.estado2.email,
          reserva.estado3.email,
          reserva.estado4.email,
        ],
        valorTotal: reserva.valorTotal,
        valorTotalPago: valorTotalPagoAux,
        localizacao: reserva.localizacao,
      })
    console.log("adicionaReservaAosUtilizadores")
    await adicionaReservaAosUtilizadores(
      reserva,
      mapDosValoresDosUsers,
      docRef.id
    )
    /*  await adicionarReservaALocalizacao(localID, reserva, docRef.id) */
    console.log("Reserva Adicionada Com suceesso")
  } catch (error) {
    console.log(error)
  }
}

async function adicionaReservaAosUtilizadores(
  reserva,
  mapDosValoresDosUsers,
  reservaID
) {
  console.log("BP0")
  var listaAux = [].concat(mapDosValoresDosUsers)
  var reservaAux = new Reserva()
  reservaAux = reserva
  var firebaseReserva = reservaAux.toHistoricoDeReservasDoUser()
  console.log(listaAux)
  console.log(firebaseReserva)

  try {
    for (var elemnt of listaAux) {
      if (element.userID != null) {
        console.log(elemnt)
        await firebase
          .firestore()
          .collection(usersCollection)
          .doc(elemnt.userID)
          .set(
            {
              historicoDePagamentos: { [reservaID]: firebaseReserva },
            },
            { merge: true }
          )
      }
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

async function createMbwayPayment(
  userId,
  tipo,
  valorAAdicionar,
  reservaId,
  localizacao,
  numeroDeTelemovel,
  valor,
  email
) {
  try {
    console.log("createMbwayPayment")
    var documentID = firebase
      .firestore()
      .collection(pagamentosMBwayCollection)
      .doc().id
    return gerarMBwayPayment(valor, numeroDeTelemovel, email).then(
      async value => {
        if (value != null) {
          var json = value.data
          return gravaPagamentoDeMbway(
            json["IdPedido"],
            email,
            valorAAdicionar,
            reservaId,
            documentID,
            userId,
            localizacao,
            numeroDeTelemovel,
            tipo,
            json["Valor"],
            json["Estado"]
          ).then(value => true)
        } else {
          return false
        }
      }
    )
  } catch (e) {
    console.log(e)
    return false
  }
}

/* async function criaReferenciaMultibancoViaAPI(  valor) {
  try {
    var url =
        Uri.parse('https://ifthenpay.com/api/multibanco/reference/init');
    var response = await http.post(url,
        "body" : jsonEncode({
          "mbKey": "XZZ-289765",
          "orderId": "order1234",
          "amount": valor
        }));
    print(response.body);
    print('Multibanco criado com sucesso');
    return jsonDecode(response.body);
  } catch (e) {
    print(e);
    print('eero');
    return null;
  }
} */

export async function gerarMBwayPayment(valor, nrtlm, email) {
  console.log("A gerar pagamentos de MBWAy")
  console.log(nrtlm)
  try {
    var canal = "03"
    var mbWayKey = "WEJ-596359"
    var documentID = firebase.firestore().collection("pagamentosMBway").doc().id

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    }
    const formData = new URLSearchParams()
    formData.append("MbWayKey", mbWayKey)
    formData.append("canal", canal)
    formData.append("referencia", documentID.substring(0, 14))
    formData.append("valor", valor)
    formData.append("nrtlm", nrtlm)
    formData.append("email", email)
    formData.append("descricao", "[REFERENCIA]")

    return axios
      .post(
        "https://mbway.ifthenpay.com/ifthenpaymbw.asmx/SetPedidoJSON",
        formData,
        { headers }
      )
      .then(function (response) {
        console.log(response.data)
        console.log(response.data.IdPedido)
        console.log(response.data["IdPedido"])
        return response
      })
      .catch(function (error) {
        console.log(error)
        console.log(error.response)
      })
  } catch (e) {
    console.log(e)
    return null
  }
}

async function gravaPagamentoDeMbway(
  idPedido,
  email,
  valorAAdicionar,
  reservaId,
  documentId,
  userId,
  localizacao,
  nrmtl,
  tipo,
  valor,
  estado
) {
  try {
    console.log("A adicionar pagamentos de MBWAy")
    await firebase
      .firestore()
      .collection("pagamentosMBway")
      .doc(documentId)
      .set({
        email: email,
        valorAAdicionar: valorAAdicionar,
        reservaId: reservaId,
        userId: userId,
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        valor: valor,
        tipo: tipo,
        idpedido: idPedido,
        estado: estado,
        numeroDeTelemovel: nrmtl,
        datahorapag: "",
        localizacao: localizacao,
      })
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

async function gerarReferenciaMbway(reserva, reservaId) {
  console.log("A gerarReferenciaMbway ")
  try {
    if (reserva.estado1.tipo == "MBway") {
      createMbwayPayment(
        reserva.userID,
        "Pagamento",
        reserva.estado1.valor.toString(),
        reservaId,
        reserva.localizacao,
        reserva.estado1.numertl,
        reserva.estado1.valor.toString(),
        reserva.estado1.email
      )
    }
    if (reserva.estado2.tipo == "MBway") {
      createMbwayPayment(
        reserva.userID,
        "Pagamento",
        reserva.estado2.valor.toString(),
        reservaId,
        reserva.localizacao,
        reserva.estado2.numertl,
        reserva.estado2.valor.toString(),
        reserva.estado2.email
      )
    }
    if (reserva.estado3.tipo == "MBway") {
      createMbwayPayment(
        reserva.userID,
        "Pagamento",
        reserva.estado3.valor.toString(),
        reservaId,
        reserva.localizacao,
        reserva.estado3.numertl,
        reserva.estado3.valor.toString(),
        reserva.estado3.email
      )
    }
    if (reserva.estado4.tipo == "MBway") {
      createMbwayPayment(
        reserva.userID,
        "Pagamento",
        reserva.estado4.valor.toString(),
        reservaId,
        reserva.localizacao,
        reserva.estado4.numertl,
        reserva.estado4.valor.toString(),
        reserva.estado4.email
      )
    }
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

async function gerarReferenciaMultibanco(reserva, reservaId){
  try {
    if (reserva.estado1.tipo == "MBway") {
      createMbwayPayment(
        reserva.userID,
        "Pagamento",
        reserva.estado1.valor.toString(),
        reservaId,
        reserva.localizacao,
        reserva.estado1.numertl,
        reserva.estado1.valor.toString(),
        reserva.estado1.email
      )
    }
    if (reserva.estado2.tipo == "MBway") {
      createMbwayPayment(
        reserva.userID,
        "Pagamento",
        reserva.estado2.valor.toString(),
        reservaId,
        reserva.localizacao,
        reserva.estado2.numertl,
        reserva.estado2.valor.toString(),
        reserva.estado2.email
      )
    }
    if (reserva.estado3.tipo == "MBway") {
      createMbwayPayment(
        reserva.userID,
        "Pagamento",
        reserva.estado3.valor.toString(),
        reservaId,
        reserva.localizacao,
        reserva.estado3.numertl,
        reserva.estado3.valor.toString(),
        reserva.estado3.email
      )
    }
    if (reserva.estado4.tipo == "MBway") {
      createMbwayPayment(
        reserva.userID,
        "Pagamento",
        reserva.estado4.valor.toString(),
        reservaId,
        reserva.localizacao,
        reserva.estado4.numertl,
        reserva.estado4.valor.toString(),
        reserva.estado4.email
      )
    }
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

export async function getAllReservas(localizacao) {
  try {
    return firebase
      .firestore()
      .collection(reservasCollection)
      .where("localizacao", "==", localizacao)
      .onSnapshot(docsSnaps => {
        console.log(docsSnaps.docs)
        return docsSnaps.docs
      })
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getReservaById(docId) {
  try {
    return firebase
      .firestore()
      .collection(reservasCollection)
      .doc(docId)
      .get()
      .then(value => {
        return value.data()
      })
  } catch (error) {
    console.error(error)
    return null
  }
}

function escolheMelhoresDescontosParaCadaEmail(
  listaDeEmails,
  dataDaReserva,
  mapEmailClasses,
  mapDescontos
) {
  var mapEmailValorAPAgar = {}
  var mapAUXDES = {}
  var date = new Date()
  date = dataDaReserva
  var diaParaVerSeEFeriado =
    date.getDate() + "-" + (date.getMonth() + 1).toString()

  date.getDate()
  for (var i = 0; i < listaDeEmails.length; i++) {
    if (
      date.getDay() < 6 ||
      date.getDay() == 0 ||
      listaDeFeriados2022[diaParaVerSeEFeriado] != null
    ) {
      if (mapEmailClasses[listaDeEmails[i]] != null) {
        mapEmailClasses[listaDeEmails[i]].forEach(
          (keyClasse, valueExpiraEm) => {
            if (
              mapDescontos[keyClasse]["Semana"] != null ||
              mapDescontos[keyClasse]["Semana"].isNotEmpty
            ) {
            }
          }
        )
      }
    }
  }
}

export async function anularReservaPorUser(docId) {
  try {
    firebase.firestore().collection("reservas").doc(docId).set({
      canceladaPeloUser: true,
    },{merge: true})
    return true;
  } catch (error) {
    console.log(error);
    return null;
  }
    
}

/*
 *
 *
 */

/* async function
      veSeHaConflitoDeHorariosNasReservasRetornaNomeDosCamposIndisponiveis(
           procuraReserva)  {
    List<String> listaDeNomesDosCamposIndisponiveis = [];

    try {
      await reservasCollection
          .where('localizacao', isEqualTo: reserva.localizacao)
          .where('horaIncial',
              isGreaterThanOrEqualTo: Timestamp.fromDate(
                  reserva.horaDaReserva.subtract(const Duration(hours: 2))))
          .where('horaIncial',
              isLessThan: Timestamp.fromDate(reserva.horaDaReserva
                  .add(Duration(minutes: int.parse(reserva.duracaoDaReserva)))))
          .get()
          .then((value) {
        print(
            'Resultado de ir buscar reservas duas horas antes da hora inicial:' +
                value.docs.toString());
        List listaDeCampos = value.docs;

        if (listaDeCampos.isNotEmpty && listaDeCampos != []) {
          for (var element in listaDeCampos) {
            if (element['estado'] != 'Anulada') {
              Timestamp hi = element['horaIncial'];
              Timestamp hf = element['horaFinal'];
              Timestamp rhi = Timestamp.fromDate(reserva.horaDaReserva);
              Timestamp rhf = Timestamp.fromDate(reserva.horaDaReserva
                  .add(Duration(minutes: int.parse(reserva.duracaoDaReserva))));

              if ((rhi.compareTo(hi) <= 0) && (hi.compareTo(rhf) < 0)) {
                listaDeNomesDosCamposIndisponiveis.add(element['campo']);
              }
              if ((hi.compareTo(rhi) <= 0) && (rhi.compareTo(hf) < 0)) {
                listaDeNomesDosCamposIndisponiveis.add(element['campo']);
              }
              if ((hi.compareTo(rhi) <= 0) && (rhf.compareTo(hf) <= 0)) {
                listaDeNomesDosCamposIndisponiveis.add(element['campo']);
              }
            }
          }
        }

        print('Resultado da pesquisa de Campos:' +
            listaDeNomesDosCamposIndisponiveis.toString());
      });
      //Coverter o horario da Reserva para um tempo compativel com o das aulas. Formato-> 00:00
      String _horaInicialCompativel = DateFormat('HH:mm')
          .format(reserva.horaDaReserva.subtract(const Duration(hours: 2)));

      String _horaIncialCompativel2 = DateFormat('HH:mm').format(reserva
          .horaDaReserva
          .add(Duration(minutes: int.parse(reserva.duracaoDaReserva))));

      DateTime horaFinal = reserva.horaDaReserva
          .add(Duration(minutes: int.parse(reserva.duracaoDaReserva)));

      String _horaFinalCompativel = DateFormat('HH:mm').format(horaFinal);

      await aulasCollection
          .where('localizacao', isEqualTo: reserva.localizacao)
          .where('weekDay', isEqualTo: reserva.horaDaReserva.weekday)
          .where('horaInicial', isGreaterThanOrEqualTo: _horaInicialCompativel)
          .where('horaInicial', isLessThan: _horaIncialCompativel2)
          .get()
          .then((value) {
        print(
          'AULAS Resultado de ir buscar reservas duas horas antes da hora inicial:' +
              value.docs.toString(),
        );

        List listaDeCampos = value.docs;

        if (listaDeCampos.isNotEmpty && listaDeCampos != []) {
          for (var element in listaDeCampos) {
            if (element['estado'] != 'Anulada') {
              String hi = element['horaInicial'];
              String hf = element['horaFinal'];
              String rhi = DateFormat('HH:mm').format(reserva.horaDaReserva);
              String rhf = DateFormat('HH:mm').format(reserva.horaDaReserva
                  .add(Duration(minutes: int.parse(reserva.duracaoDaReserva))));

              if ((rhi.compareTo(hi) <= 0) && (hi.compareTo(rhf) < 0)) {
                element['campos'].forEach((elem) {
                  listaDeNomesDosCamposIndisponiveis.add(elem);
                });
              }
              if ((hi.compareTo(rhi) <= 0) && (rhi.compareTo(hf) < 0)) {
                element['campos'].forEach((elem) {
                  listaDeNomesDosCamposIndisponiveis.add(elem);
                });
              }
              if ((hi.compareTo(rhi) <= 0) && (rhf.compareTo(hf) <= 0)) {
                element['campos'].forEach((elem) {
                  listaDeNomesDosCamposIndisponiveis.add(elem);
                });
              }
            }
          }
        }

        print('AULAS Resultado da pesquisa de Campos:' +
            listaDeNomesDosCamposIndisponiveis.toString());
      });
      return listaDeNomesDosCamposIndisponiveis;
    } catch (e) {
      print('AULAS' + e.toString());
      return [];
    }
  } */
