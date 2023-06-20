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
        alunos: [],
        alunosData: {},
        nivel: aula.nivel,
        estado: aula.estado,
        nome: aula.nome,
        campos: aula.campos,
        tipo: aula.tipo,
        notas: '',
        isAtiva: aula.isAtiva
        
      })
      .then(value => {
        return true
      })
  } catch (e) {
    console.error(e)
    return null
  }
}

export async function removerAlunoDaAula(aulaID, alunos, alunosData){
  try {
    await firebase.firestore().collection(aulasCollection).doc(aulaID).update({
      "alunos": alunos,
      "alunoData": alunosData
    })
    return true;
  } catch (error) {
    print(error)
    return false; 
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
          tipo: aula.tipo,
          notas: aula.notas,
          isAtiva: aula.isAtiva
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

function getRandomQrcode(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

export async function adicionarAlunoEData(email,alunoData, aulaID) {
  console.log(email)
  console.log(aulaID)
  var qrCode = getRandomQrcode(1, 16777215)

  try {
    await firebase
      .firestore()
      .collection(aulasCollection)
      .doc(aulaID)
      .set(
        {
          alunos: firebase.firestore.FieldValue.arrayUnion(email),
          alunoData: {[email]: {nome: alunoData.nome, cc: alunoData.cc, tel: alunoData.tel, qrCode: qrCode  }  }
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
