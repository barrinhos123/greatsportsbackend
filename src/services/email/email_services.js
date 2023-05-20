import firebase from "firebase/app"
import "firebase/firestore"
import { Reserva } from "models/reserva"
import QRCode from "qrcode"

function criaEmailBOdy(nome,campo) {
  const aretornar =
    " <style>" +
    ".text {" +
    " align-self: flex-end;" +
    "}" +
    ".image {" +
    " width: 120px;" +
    " height: 120px;" +
    "}" +
    ".paragraph {" +
    "display: flex;" +
    "}" +
    "</style>" +
    '<div style="font-weight: normal; font-size: 14px;">' +
    nome + "," +
    "</div>" +
    "<p>A sua reserva foi confirmada para o " + campo + ". Segue em anexo o seu QrCode de acesso</p>"
    "</div>"

  return aretornar
}

export async function enviaEmailParaUmJogador(reserva, jogadorEstado) {
  try {
    if (
      reserva[jogadorEstado].email != null ||
      typeof reserva[jogadorEstado].email != "undefined"
    ) {
        var hInicial = reserva.horaIncial.toDate()
        var dia =  ("0" + hInicial.getDate()).slice(-2)
        var mes =  ("0" + (hInicial.getMonth() + 1)).slice(-2)
        var ano = hInicial.getYear() + 1900
        var hor = hInicial.getHours()
        var min =  ("0" + hInicial.getMinutes() ).slice(-2)
        var assunto = reserva.localizacao + " || " +  "Reserva dia " +dia +"-" +mes + "-" + ano + " às " + hor + "h e " + min + "m"  
      QRCode.toDataURL(reserva[jogadorEstado].qrcode.toString())
        .then(async url => {
          console.log(url)
          const message = criaEmailBOdy(reserva[jogadorEstado].nome, reserva.campo)
          await enviarEmail(
            reserva[jogadorEstado].email,
            message,
            assunto,
            url
          )
        })
        .catch(err => {
          console.error(err)
          return null
        })
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function enviaEmails(reserva) {
  try {
    if (
      reserva.jogador1estado.email != null ||
      typeof reserva.jogador1estado.email != "undefined"
    ) {
        enviaEmailParaUmJogador(reserva, "jogador1estado")
    }
    if (
        reserva.jogador2estado.email != null ||
        typeof reserva.jogador2estado.email != "undefined"
      ) {
          enviaEmailParaUmJogador(reserva, "jogador2estado")
      }
      if (
        reserva.jogador3estado.email != null ||
        typeof reserva.jogador3estado.email != "undefined"
      ) {
          enviaEmailParaUmJogador(reserva, "jogador3estado")
      }
      if (
        reserva.jogador4estado.email != null ||
        typeof reserva.jogador4estado.email != "undefined"
      ) {
          enviaEmailParaUmJogador(reserva, "jogador4estado")
      }
  } catch (error) {
    console.error(error)
    return null
  }
}

async function enviarEmail(to, message, assunto, image) {
  try {
    await firebase
      .firestore()
      .collection("mail")
      .add({
        to: to,
        message: {
          subject: assunto,
          html: message,
          attachments: [
            {
              path: image,
            },
          ],
        },
      })
  } catch (e) {
    console.log(e)
    return null
  }
}
