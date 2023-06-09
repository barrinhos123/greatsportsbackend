import firebase from "firebase/app"
import "firebase/firestore"
import { PagamentoNumerario } from "models/pagamentos_numerario"
import { historicoDePagamentos, usersCollection } from "services/consts"

export async function pesquisarJogadoresByEmail(email) {
  try {
    return firebase
      .firestore()
      .collection(usersCollection)
      .where("email", "==", email)
      .limit(1)
      .get()
      .then(value => {
        console.log(value);
        console.log(value.docs.at(0))
        return value.docs.at(0)
      })
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function pesquisarJogadoresByEmailParaEntidades(emails) {
  var map = {}
  for (const element of emails) {
    try {
      await firebase
        .firestore()
        .collection(usersCollection)
        .where("email", "==", element)
        .limit(1)
        .get()
        .then(value => {
          if (typeof value.docs.at(0) == "undefined") {
            map[element] = null
          } else {
            map[element] = value.docs.at(0).id
          }
        })
    } catch (error) {
      map[element] = null
      console.error(error)
    }
  }
  return map
}

export async function criarUtilizador(email,password,nome,dataDN,cc) {
  try {
    var user = await firebase.auth().createUserWithEmailAndPassword(email,password)
  } catch (error) {
    
  }
}

export async function getAlllUsers() {
  var listaAux = [];
  try {
      await firebase.firestore().collection("users").get().then((value) => {
        value.docs.forEach((elem ,index) => {
          
          if(typeof elem.data().email != "undefined")
          listaAux.push(elem.data().email) 
        })
      })
     return listaAux;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function pesquisarComprasByRequestId(tipo,requestID) {
  var tipoA = "pagamentosMultibanco";
  var tipoB = "pagamentosMBway";
  var email;
  var json = {};

  console.log(requestID);
  
  try {
    if(tipo == "multibanco") { 
    await firebase
      .firestore()
      .collection(tipoA).where("reference" , "==", requestID).limit(1)
      .get().then(async (value) => {
        var data  = value.docs.at(0).data();
        json.email = data.email;
        json.userID = data.userId
        json.valor = data.valor
        json.tipo = data.tipo

        await firebase.firestore().collection("users").where("email", "==", json.email)
        .limit(1).get().then((valueUser) => {
          var dataUser  = valueUser.docs.at(0).data();
          json.nome = dataUser.primeiroNome + " " + dataUser.ultimoNome;
          json.nif = dataUser.nif
          json.codigoMoloni = dataUser.codigoMoloni
          json.morada = dataUser.morada
          json.localidade = dataUser.localidade
          json.country = dataUser.country
          json.codigoPostal = dataUser.codigoPostal
        })
      });

    } else {
     await firebase
      .firestore()
      .collection(tipoB).where("referencia" , "==", requestID).limit(1)
      .get().then(async (value) => {
        var data  = value.docs.at(0).data();
        json.email = data.email;
        json.userID = data.userId
        json.valor = data.valor
        json.tipo = data.tipo

        await firebase.firestore().collection("users").where("email", "==", json.email)
        .limit(1).get().then((valueUser) => {
          var dataUser  = valueUser.docs.at(0).data();
          json.nome = dataUser.primeiroNome + " " + dataUser.ultimoNome;
          json.nif = dataUser.nif
          json.codigoMoloni = dataUser.codigoMoloni
          json.morada = dataUser.morada
          json.localidade = dataUser.localidade
          json.country = dataUser.country
          json.codigoPostal = dataUser.codigoPostal

          console.log(json);
        })
      });
     
    }
    return json;
   
  } catch (error) {
    console.log(error)
    return null;
    
  }
  
}

export async function adicionarValorAoBancoDeHoras(pagamentoNumerario) {
  try {
    var pagamentoNum = new PagamentoNumerario()
    pagamentoNum = pagamentoNumerario
    var firebaseData = pagamentoNum.firebaseFormat()

    var snapData = await firebase
      .firestore()
      .collection("pagamentosNumerario")
      .add(firebaseData)
    var docID = snapData.id
    var userData = await firebase
      .firestore()
      .collection(usersCollection)
      .doc(pagamentoNum.userID)
      .get()
    var valorAntesDoPAgamento = userData.data().bancoDeHoras
    var valorDepoisDoPagamento =
      userData.data().bancoDeHoras + pagamentoNum.valorAAdicionar

    firebaseData["saldoAntesDoPagamento"] = valorAntesDoPAgamento
    firebaseData["saldoDepoisDoPagamento"] = valorDepoisDoPagamento

    await firebase
      .firestore()
      .collection(usersCollection)
      .doc(pagamentoNum.userID)
      .set(
        {
          historicoDePagamentos: { [docID]: firebaseData },
          bancoDeHoras: firebase.firestore.FieldValue.increment(
            pagamentoNum.valorAAdicionar
          ),
        },
        { merge: true }
      )

    await firebase
      .firestore()
      .collection(usersCollection)
      .doc(pagamentoNum.userID)
      .collection("historicoDePagamentos")
      .add(firebaseData)

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
