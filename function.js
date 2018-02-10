var urlReport = [];
var payloadReport = [];
var xml=[];
xml[0] = '<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="XSLT/tutorials.xsl"?>\n<xssreport>\n';
var xssExist=false;
var statoXML;
var contatore=2;

function createReport(){
  var doc = new jsPDF();
  var pos = 10
  doc.setFontSize(22);
  doc.setFont("times");
  doc.setFontType("bold");
  doc.setTextColor(255, 0, 0);
  doc.text('\t\t         XSS Scanner by Luca Facchin          \n', pos, pos);
  pos = pos+10;
  doc.setFontSize(14);
  doc.setFont("times");
  doc.setFontType("bold");
  doc.setTextColor(0, 0, 0);
  doc.text('\n\n\n\tSITO\t\tPayload\n\n',pos , 10)
  doc.setFontSize(8);
for (var cont=0;cont<urlReport.length;cont++){
    var reportPDF = "\n\n\n" + urlReport[cont] + "\t" + payloadReport[cont] + "\n\n\n";
doc.setFontSize(12);
doc.text(pos, 20, ' '  + reportPDF);
}
doc.text(pos,30, "\n \n \nSugli altri siti verificati non sono state trovate vulnerabilità sfruttabili")
doc.save('XSS_Report.pdf');

}


//Funzione che controlla la presenza di form, se ne trova richiama a sua volta un altra funzione per valutare la
//presenza di costrutti attaccabili
//function ValidURL(textval,contatore,numerourl) {
function ValidURL(textval) {
console.log("Funzione ValidURL chiamata e valore contatore = " + contatore);
	//For test into private net remove proxy
  
  console.log("lunghezza array: " + (xml.length));
	var x=0;
	var formOK = false;
  urlControl = 'http://allow-any-origin.appspot.com/' + textval;
  xhr = new XMLHttpRequest();
  xhr.open("GET",urlControl,false);
  xhr.send();
  verifyURL = new DOMParser();
  var sito = xhr.responseText;
  UrlExist = xhr.status;
  console.log(urlControl + UrlExist);
  if (UrlExist != 200)
    {
      statoXML = "wrongURL";
      StringToXML(textval,statoXML);
      console.log("Valore contatore wrongURL:"+contatore);
      return false;
    }

  riga = sito.split('\n');
  var posizione, metodo,stringa, value_post, stringa_post, pos_temp,str_temp, UrlDaControllare, tipoMetodo, nomeFunzione;
  var linkOnPage=[];
  //Trovo i campi form nella pagina web"
  for ( x=0; x<riga.length; x++){
         posizione=riga[x];
         stringa = posizione.indexOf('<form');
         if (stringa != -1){
        	 formOK=true;
           pos_temp = posizione.indexOf('method=');
             if (pos_temp != -1){
               pos_temp = posizione.substring(pos_temp+5);
               //Qui trovo il tipo di metodo;
               tipoMetodo = pos_temp.match(/"([^"]+)"/)[1];
                 //qui trovo il valore action del campo form
                 if (tipoMetodo != -1){
                   pos_temp = posizione.indexOf('action=');
                   pos_temp = posizione.substring(pos_temp+7);

                     nomeFunzione = pos_temp.match(/"([^"]+)"/)[1];
                 }
                 //Adesso devo trovare la variabile nei campi input successivi
                 for (var y = x; y < riga.length; y++){
                   var ptemp = riga[y];
                   str_temp = ptemp.indexOf('<input');
                   if (str_temp != -1){
                	   var namepos;
                	   namepos = ptemp.indexOf('name=');
                	   
                   //str_temp = ptemp.substring(str_temp+5);
                	   str_temp = ptemp.substring(namepos+5);
                	   valoreNome = str_temp.match(/"([^"]+)"/)[1];
                	   console.log("Valorenome = " + valoreNome);
                	   if (formOK){
                           UrlDaControllare=urlControl +'/'+ nomeFunzione ;
                           TestXSS(tipoMetodo,UrlDaControllare,valoreNome,textval);
                  // valoreNome = str_temp.match(/"([^"]+)"/)[1];
                 }
                 }
                 /*if (formOK){
                 UrlDaControllare=urlControl +'/'+ nomeFunzione ;
                 TestXSS(tipoMetodo,UrlDaControllare,valoreNome,textval);*/
                 }
                }
           }
        
         }
         //A questo punto ho ricavato tutti i parametri che mi servono per testare gli xss
         //Se non sono presenti costrutti get nella pagina scrivo ND su report XML
        if (formOK === false){
        	console.log("Campo form non trovato");
        	 statoXML = "formNonTrovato";
             StringToXML(textval,statoXML);
        }
         
        
    }



//Funzione che prende in input un metodo(GET o POST ma x adesso solo GET a causa dei limiti del proxy usato), URL e parametri
//per provare a iniettare il payload e verificare la presenza di un eventuale vulnerabilità XSS.
function TestXSS(method,url,parameters,sitoOriginale){
  	var length_file, allText;
console.log(parameters);
//La variabile params contiene il file da cui prendere i payload per testare l'attacco
  var params="payloads";
  //Se il metodo non è post segnalo errore
  if (method === 'post' || method === 'Post' || method === 'POST' ){
	  statoXML = "post";
      StringToXML(sitoOriginale,statoXML);
      return;
     }
  var Param_reader = new FileReader();
  //Leggo il file di configurazione per caricare i payloads
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", params, false);
  rawFile.onreadystatechange = function ()
//Controllo che la connessione sia completata
  {
      if(rawFile.readyState === 4)
      {
          if(rawFile.status === 200 || rawFile.status == 0)
          {
              allText = rawFile.responseText;
              allText = allText.split('\n');
              length_file = allText.length;
              console.log("Lunghezza file: " + length_file);
        //La variabile allText è un array che contiene tutti i payloads da testare per l'attacco
          }
      }
     
  }

  rawFile.send(null);
   var test_xss = new XMLHttpRequest();
   var stringaGet, ResponseSite, stringaConfronto;
   //testo tutti i parametri che ho nel file
   for (var z=0; z< (length_file); z++){
     //preparo la stringa da aggiungere all'URL
     stringaGet= (url + "?" + parameters + "=" + allText[z]);
     test_xss.open(method,stringaGet,false);
     test_xss.send();
     	//test connessione con injection
         if(test_xss.readyState === 4)
         	{
        	 if(test_xss.status === 200 || test_xss.status == 0)
        	 	{
        		 statoXML="notVulnerable";
        		 StringToXML(sitoOriginale,statoXML,allText[z]);
        	 	}
        	 	}
         ResponseSite = test_xss.responseText;
         stringaConfronto = ResponseSite.indexOf(allText[z]);
  //Controllo la risposta del sito e se trovo la stessa stringa che ho iniettato significa che probabilmente ho un XSS
     if (stringaConfronto != -1){
       xssExist = true;
       for(var x=0; x<6; x++){
       urlReport[x]=sitoOriginale;
       payloadReport[x]=allText[z];
           }
         statoXML="vulnerable";
         StringToXML(sitoOriginale,statoXML,allText[z],parameters);
         return;
     }
     statoXML="notVulnerable";
     StringToXML(sitoOriginale,statoXML,allText[z],parameters);
    }
}

function StringToXML(url,stato,payload,parameters) {
	//modifico il payload in maniera che sia visibile sul report.
	if( payload != undefined){
	payload = payload.replace(/</g ,"&lt;");
	payload = payload.replace(/>/g ,"&gt;");
	}
	
  if (payload === undefined && stato === "wrongURL"){
	  console.log("wrongURL su stringXtoxml")
	  contatore = (contatore+1);
	  xml[contatore]='<sito><url>' + url + '</url><result>NOT CONNECTED: Url wrong</result></sito>\n';
}
  else if (payload === undefined && stato === "post"){
	  contatore = (contatore+1);
	  console.log("only post method su stringXtoxml")
	  xml[contatore]='<sito><url>' + url + '</url><result>NOT Valutable: Only post method</result></sito>\n';
	}
else if (stato=== "vulnerable"){
	contatore = (contatore+1);
	console.log("vulnerable")
 	xml[contatore]='<sito><url>' + url + '</url><inputname>' + parameters + '</inputname><payload>' + payload + '</payload><result>VULNERABLE</result></sito>\n';
  }
else if (stato=== "notVulnerable"){
	contatore = (contatore+1);
	console.log(url + " non vulnerabile " + contatore);
  xml[contatore]='<sito><url>' + url + '</url><inputname>' + parameters + '</inputname><payload>' + payload + '</payload><result>NOT VULNERABLE</result></sito>\n';
 }
else if (stato=== "formNonTrovato")	{
	contatore++;
	xml[contatore]='<sito><url>' + url + '</url><payload> N.D. </payload><result>Form not present</result></sito>\n';
	}
}

function printXML(){
  xml[xml.length] = '</xssreport>';
 
 var postUpload = $.ajax({
	    url: "xmlUpload",
	    data: { name: xml  },
	    type: "POST"}).done(function(data){
	        console.log(data);
	        //window.location.href("/first/upload/"  + postUpload.responseText);
	        //document.getElementById("reportXML").style.visibility='visible';
	        //window.location.replace('/first/upload/' + postUpload.responseText);
	        //document.ViewreportXML.action="/first/upload/" + postUpload.responseText;
	  });
/* var risposta = (postUpload.responseText);
alert(risposta); 
*/}

