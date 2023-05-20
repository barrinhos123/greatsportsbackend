import firebase from "firebase/app"
import "firebase/firestore"
import { Contrato } from "models/contrato"
import {
  contratosCollection,
  historicoDeContratosCollection,
  usersCollection,
} from "services/consts"

export async function createContrato(contratoP) {
  try {
    const id = firebase.firestore().collection(contratosCollection).doc().id
    var contrato = new Contrato()
    contrato = contratoP
    const contratoJson = contrato.toFirebaseJson()
    console.log(contratoJson)

    await firebase
      .firestore()
      .collection(contratosCollection)
      .doc(id)
      .set(contrato.toFirebaseJson())

    return id
  } catch (e) {
    console.error(e)
    console.log("Falha a criar contrato")
    return null
  }
}

export async function adicionarContratoAoUser(contratoD, contratoId, userId) {
  var contratos = new Contrato()
  var contratos = contratoD
  try {
    await firebase
      .firestore()
      .collection(usersCollection)
      .doc(userId)
      .set(
        {
          contrato: firebase.firestore.FieldValue.increment(
            contratos.numeroDeJogos
          ),
        },
        { merge: true }
      )

    return await historicoDeContratos(userId, contratoD, contratoId)
  } catch (e) {
    console.error(e)
    return null
  }
}

export async function historicoDeContratos(userID, contratoData, contratoID) {
  console.log("Historico de Contratos")
  console.log(userID)
  console.log(contratoData)
  console.log(contratoID)
  try {
    var contrato = new Contrato()
    var map = {}
    contrato = contratoData
    map = contrato.toFirebaseJson()
    map.contratoID = contratoID
    map.createdAt = firebase.firestore.Timestamp.fromDate(new Date())

    await firebase
      .firestore()
      .collection(usersCollection)
      .doc(userID)
      .set(
        {
          historicoDeContratos: {
            [contratoID]: {
              expiresAt: map.expiresAt,
              diaDaSemana: map.diaDaSemana,
              numeroDeJogos: map.numeroDeJogos,
              periodo: map.periodo,
            },
          },
        },
        { merge: true }
      )

    return true
  } catch (e) {
    console.error(e)
    return null
  }
}


