var formURL = 'https://docs.google.com/a/aci.it/forms/d/1PjFq5sZ63XGfFW0W4Awr3X0BahksAxUIWMe3b0Mg8uA/viewform';
var sheetName = 'Risposte';
var columnIndex = 12; // colonna "Update"

// costruisce l'url per la colonna "Update" .. poi esegue a funzione "setFormatDate" 
function getEditResponseUrls(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();
  var form = FormApp.openByUrl(formURL);
  
  for(var i = 2; i < data.length; i++) {
    if(data[i][0] != '' && data[i][columnIndex-1] == '') {
      var timestamp = data[i][0];
      var formSubmitted = form.getResponses(timestamp);
      if(formSubmitted.length < 1) continue;
      var editResponseUrl = formSubmitted[0].getEditResponseUrl();
      sheet.getRange(i+1, columnIndex).setValue(editResponseUrl);
    }}
// Settaggio le colonne contenenti date in formato "testo normale" per poterle utilizzare in Datatables 
  for(var i = 2; i < data.length; i++) {
    
    Logger.log("contenuto della cella colonna 3: " + data[i][2])
    var lunghezzaCella = data[i][2].length;
    Logger.log("lunghezza cella colonna 3: " + lunghezzaCella)
    if(lunghezzaCella != 10) {
      if(data[i][0] != '')  {
        var existingDate = data[i][2];
        Logger.log(existingDate);
        sheet.getRange(i+1,3).setValue(Utilities.formatDate(new Date(existingDate), "GMT+01:00", "'data:'dd/MM/yyyy"));
        // sheet.getRange(i+1,3).setValue(Utilities.formatDate(new Date(existingDate), "GMT+01:00", "MM/dd/yyyy"));
      
    }
  }
}
}

  //**************************************************
/*

// Gestione dei permessi: vengono visualizzati solo i record dell'utente che li ha inseriti nella tabella
function doGet(e) {
  var currentUser = Session.getActiveUser().getEmail();
  var ssUrl =  e.parameter.url;
  var sheetName = e.parameter.sheet;
  var a1Notation = e.parameter.range;
//  var sps = SpreadsheetApp.openByUrl(ssUrl);
  var sps = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1yL_waBjXed_uVWbKLF-jhpf5vB_rQID9N6ujc7_rHFI/edit#gid=48835627");
  var sheet = sps.getSheetByName(sheetName);
  var range = sheet.getRange(a1Notation);
  var data = range.getValues();
  var dt = {cols:[], rows:[]};
  var permissionsCol = null;
  var firstCol = range.getColumn();
  for(var i = 0; i < data[0].length; i++) {
    if(data[1][i].indexOf('Permissions') != -1) permissionsCol = i;
    dt.cols.push({id:numToA(firstCol+i), label:data[0][i] + ' ' + data[1][i].replace('Permissions', ''), type: 'string', isNumber:true, isDate:true, isEmpty:true});
  }
  for(var i = 2; i < data.length; i++) {
    if(permissionsCol == null || currentUser != '' && data[i][permissionsCol].indexOf(currentUser) != -1) {
      var row = [];
      for(var j = 0; j < data[i].length; j++) {
        if(isNaN(data[i][j])) dt.cols[j].isNumber = false;
        if(data[i][j] != '') dt.cols[j].isEmpty = false;
        if(data[i][j] instanceof Date == false) dt.cols[j].isDate = false;
        else if(data[i][j].getFullYear() == 1899) {
          dt.cols[j].isDate = false;
          data[i][j] = data[i][j].getHours()+':'+(data[i][j].getMinutes()<10?'0':'')+data[i][j].getMinutes();
        }
        else data[i][j] = "Date("+data[i][j].getTime()+")";
        row.push({v:data[i][j]});
      }
      dt.rows.push({c:row});
    }
  }
  for(var i = 0; i < data[0].length; i++) {
    if(dt.cols[i].isEmpty) dt.cols[i].type = 'string';
    else if(dt.cols[i].isDate) dt.cols[i].type = 'datetime';
    else if(dt.cols[i].isNumber) dt.cols[i].type = 'number';
  }
  if ('templateSheet' in e.parameter && e.parameter.templateSheet.toLowerCase().indexOf('template') != -1){
    var templateSheet = sps.getSheetByName(e.parameter.templateSheet);
    var templateRange = templateSheet.getRange(e.parameter.templateRange);
    var templateData = templateRange.getValues();
    var tp = {cols:[], rows:[]};
    for(var i = 0; i < templateData[0].length; i++) tp.cols.push({id:i, label:templateData[0][i], type: 'string'});
    for(var i = 0; i < templateData.length; i++) {
      var row = [];
      for(var j = 0; j < templateData[i].length; j++) row.push({v:templateData[i][j]});
      tp.rows.push({c:row});
    }
    var output = e.parameters.callback + '(' + JSON.stringify({dataTable: dt,template: tp}) + ')';
  }else{
    var output = e.parameters.callback + '(' + JSON.stringify({dataTable: dt}) + ')';
  }
  
  return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JAVASCRIPT);
}
function numToA(num){
  var a = '',modulo = 0;
  for (var i = 0; i < 6; i++){
    modulo = num % 26;
    if(modulo == 0) {a = 'Z' + a;num = num / 26 - 1;}
    else{a = String.fromCharCode(64 + modulo) + a;num = (num - modulo) / 26;}
    if (num <= 0) break;}
  return a;
}


*/