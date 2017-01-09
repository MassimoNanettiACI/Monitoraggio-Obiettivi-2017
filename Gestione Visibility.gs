// ***** Funzione per estrarre l'ufficio dell'utente loggato 
//       (col1 = Ufficio col7 = RUT inseritore col9 = mese) 
 
function searchUserOffice(){
  // var userMail="c.palla@aci.it"
   var userMail = Session.getActiveUser()
  Logger.log("userLogged: " + userMail)
  
  var ss = SpreadsheetApp.openById('1A2-BGyBcXVRBnywFuz3giulmzotOwMQIuEIkb6b24BU')  // foglio Produzione UAB Toscana 
  var sheet = ss.getSheetByName('Produzione')
  var data = sheet.getDataRange().getValues()
  for (i=0; i<3; i++){
    data.shift()
  }
  for (var i=0; i<data.length; i++){ 
    if (data[i][7] == userMail){
      var userName = data[i][7]
 //     var periodo = data[i][9]
      var userOffice = data[i][1]
 //     Logger.log("Inseritore: " + data[i][7] + " Periodo: " + data[i][9] + " Ufficio: " + data[i][1]);
      Logger.log("Ufficio: " + userOffice);
      return userOffice;
    }
  }
  Logger.log(userMail + " Account non trovato" )
}
