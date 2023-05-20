import firebase from "firebase/app"
import "firebase/firestore"
import { merge } from "lodash"
import { Aula } from "models/aula"
import {
  aulasCollection,
  localizacaoCollection,
  reservasCollection,
} from "services/consts"

export async function verListaDeAulas(localizacao) {
  try {
    return firebase
      .firestore()
      .collection(aulasCollection)
      .where("localizacao", "==", localizacao)
      .onSnapshot(docsSnap => {
        return docsSnap.docs
      })
  } catch (e) {
    console.error(e)
    return null
  }
}

export async function createAula(newAula) {
  var aula = new Aula()
  aula = newAula

  try {
    return firebase
      .firestore()
      .collection(aulasCollection)
      .add({
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        weekDay: aula.weekDay,
        localizacao: aula.localizacao,
        horaInicial: aula.horaInicial,
        horaFinal: aula.horaFinal,
        diaInicial: firebase.firestore.Timestamp.fromDate(aula.diaInicial),
        diaFinal: firebase.firestore.Timestamp.fromDate(aula.diaFinal),
        professor: aula.professor,
        alunos: aula.alunos,
        alunosPAX:aula.alunosPAX,
        nivel: aula.nivel,
        estado: aula.estado,
        nome: aula.nome,
        campos: aula.campos,
      })
      .then(value => {
        return true
      })
  } catch (e) {
    console.error(e)
    return null
  }
}

export async function updateAula(newAula, aulaId) {
  var aula = new Aula()
  aula = newAula

  try {
    return firebase
      .firestore()
      .collection(aulasCollection)
      .doc(aulaId)
      .set(
        {
          updatedAt: firebase.firestore.Timestamp.fromDate(new Date()),
          weekDay: aula.weekDay,
          localizacao: aula.localizacao,
          horaInicial: aula.horaInicial,
          horaFinal: aula.horaFinal,
          diaInicial: firebase.firestore.Timestamp.fromDate(aula.diaInicial),
          diaFinal: firebase.firestore.Timestamp.fromDate(aula.diaFinal),
          professor: aula.professor,
          nivel: aula.nivel,
          estado: aula.estado,
          nome: aula.nome,
          campos: aula.campos,
        },
        { merge: true }
      )
      .then(value => {
        return true
      })
  } catch (e) {
    console.error(e)
    return null
  }
}

export async function adicinarAlunosAAula(usersID, aulaID) {
  console.log(usersID)
  console.log(aulaID)
  try {
    await firebase
      .firestore()
      .collection(aulasCollection)
      .doc(aulaID)
      .set(
        {
          alunos: firebase.firestore.FieldValue.arrayUnion(...usersID),
        },
        { merge: true }
      )
    return true
  } catch (e) {
    console.error(e)
    return null
  }
}

export async function adicinarAlunosPAXAAula(usersID, aulaID) {
  console.log(usersID)
  console.log(aulaID)
  try {
    await firebase
      .firestore()
      .collection(aulasCollection)
      .doc(aulaID)
      .set(
        {
          alunosPAX: firebase.firestore.FieldValue.arrayUnion(...usersID),
        },
        { merge: true }
      )
    return true
  } catch (e) {
    console.error(e)
    return null
  }
}

export async function removeAula(aulaID) {
  try {
    await firebase.firestore().collection(aulasCollection).doc(aulaID).delete()
    return true
  } catch (error) {
    console.error(error)
    return null
  }
}
