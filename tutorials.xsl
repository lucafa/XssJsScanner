<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<html>
<head>
<title>XSS Report Page</title>
</head>
<body>
	<h2>Report File from XSS scanner</h2>
	<table border="1">
		<tr>
			<th>URL</th>
			<th>INPUT NAME</th>
			<th>PAYLOAD</th>
			<th>RESULT</th>
		</tr>
		<xsl:for-each select="xssreport/sito">
		<tr>	
			<td><xsl:value-of select="url"/></td>
			<td><xsl:value-of select="inputname"/></td>
			<td><xsl:value-of select="payload"/></td>
			<td><xsl:value-of select="result"/></td>
		</tr>
		</xsl:for-each>
	</table>
	
	<iframe id="my_iframe" style="display:none;"></iframe>
<script>
function Download(url) {
    document.getElementById('my_iframe').src = url;
};
</script>
	
<p></p>
<a href="/first/upload/reportXML.xml" download="XMLReport">Scarica il report in formato XML</a>
<p></p>	 
	 <button onclick="goBack()">Torna indietro</button>

<script>
function goBack() {
    window.location.replace("../");
}
</script> 



</body>
</html>
</xsl:template>
</xsl:stylesheet>
