import firebase from "firebase/app"
import "firebase/firestore"
import { Treinador } from "models/treinador"
import { localizacaoCollection, treinadoresCollection } from "services/consts"

export async function getTreinadores(localizacao) {
  try {
    firebase
      .firestore()
      .collection(treinadoresCollection)
      .where("localizacao", "==", localizacao)
      .onSnapshot(docsSnaps => {
        docsSnaps.docs()
      })
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function adicionarTreinarALocalizacao(treinador, localID) {
  var newTreinador = new Treinador()
  var newTreinador = treinador
  try {
    firebase
      .firestore()
      .collection(localizacaoCollection)
      .doc(localID)
      .set(
        {
          treinadores: firebase.firestore.FieldValue.arrayUnion({
            email: newTreinador.email,
            nome: newTreinador.nome,
          }),
        },
        { merge: true }
      )
    return true
  } catch (error) {
    console.error(error)
  }
}

export async function criarTreinadorNosTreinadores(treinador) {
  var newTreinador = new Treinador()
  var newTreinador = treinador
  var fbData = newTreinador.toFirebaseFormat()

  try {
    await firebase
      .firestore()
      .collection(treinadoresCollection)
      .doc()
      .set(fbData)
    return true
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function criarTreinador(treinador, localID) {
  var local = await adicionarTreinarALocalizacao(treinador, localID)
  console.log("treinador")
  console.log(treinador)
  var treina = await criarTreinadorNosTreinadores(treinador)
  if (local == true && treina == true) {
    return true
  } else {
    return null
  }
}
