import firebase from "firebase/app"
import "firebase/firestore"

export async function getLocalizacaoFromEmail(email) {
  try {
    return await firebase
      .firestore()
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get()
      .then(value => {
        return value.docs.at(0).data().localizacao
      })
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getLocalValues(localizacao) {
  try {
    return firebase
      .firestore()
      .collection("localizacao")
      .where("localizacao", "==", localizacao)
      .limit(1)
      .get()
      .then(value => {
        return value.docs.at(0).data()
      })
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function duplicate(localizacao) {
  try {
    return firebase
      .firestore()
      .collection("localizacao")
      .where("localizacao", "==", localizacao)
      .limit(1)
      .get()
      .then(value => {
       firebase.firestore().collection("localizacaoBck").add(
        value.docs.at(0).data()
       )
      })
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function updateFeriados(localizacaoID, feriados) {
  try {
    await firebase.firestore().collection("localizacao").doc(localizacaoID).update(
      {feriados: feriados}
    );
    return true
  } catch (error) {
    console.log(error);
    return null;
  }
}
