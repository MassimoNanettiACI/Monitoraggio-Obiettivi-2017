/**
 * Get the URL for the Google Apps Script running as a WebApp.
 */
function getScriptUrl() {
  var url = ScriptApp.getService().getUrl();
  return url;
}

function doGet(e) {

  if (!e.parameter.page) {
    Logger.log("sei in index.html");
  var html= HtmlService.createTemplateFromFile('Index').evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
    // When no specific page requested, return "home page"
  }

  else 
  {
  // else, use page parameter to pick an html file from the script
    Logger.log("sei in form.html")
  var html = HtmlService.createTemplateFromFile(e.parameter['page']).evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
  }
  
  return html
}

// *****************  LEGGE I DATI DALLO SHEET E RESTITUISCE UN OBJECT  *************

function readData(){
// Logger.log("readData " + new Date())
//  Logger.log("Ufficio " + Ufficio)
var rows = sheet.getLastRow()-2
// Logger.log(rows);
var cols = sheet.getLastColumn()+1
// Logger.log(cols);
var headers = sheet.getRange(1,2,1,cols).getValues()
// Logger.log(headers)
var data = sheet.getRange(3,2,rows,cols).getValues()
//  Logger.log(data)

//Object con un Array di Objects
var dataObjectsArray = [] // inizializza l'array di Objects
for (var i=0; i<rows; i++){ // per ogni riga 
var dataObjects = {} // inizializza un object
  for (var j=0; j<cols; j++){ // per ogni colonna 
  Object.defineProperty(dataObjects, headers[0][j], { // ne definisce le proprietà usando i nomi di colonna 
    value: data[i][j], // e i valori usando i dati in tabella 
    writable: true,
    enumerable: true,
    configurable: true
    }); 
  }  
  // quando completa l'Object lo aggiunge all'array di Objects  
    dataObjectsArray.push(dataObjects)
}
// quando completa l'array di Object costruisce l'oggetto Contenitore
var mainObject = {
      table: null,
      init : function (){                    // definisce un metodo 
        mainObject.table = dataObjectsArray; // che assegna l'array di Objects alla proprietà "table" 
                                             // una semplice assegnazione del valore alla proprietà non funzionava
      }
    };
    mainObject.init(); // aziona il metodo per assegnare l'array di Objects alla proprietà "table"
    
//  var JSONdata = JSON.stringify(mainObject)
//   Logger.log(JSONdata)
   Logger.log(mainObject)
 return mainObject // il risultato viene restituito come Object e non come JSON stringify 
// return JSONdata  // il risultato viene restituito come JSON stringify
}

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
