import firebase from "firebase/app"
import "firebase/firestore"

export async function getLocalizacaoFromEmail(email) {
  try {
    return firebase
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
