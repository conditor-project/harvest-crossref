<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:cr11="http://www.crossref.org/xschema/1.1"
    xmlns:cr10="http://www.crossref.org/xschema/1.0" 
    xmlns:cr30="http://www.crossref.org/qrschema/3.0"
    exclude-result-prefixes="xs cr"
    version="1.0">
<xsl:output indent="yes"/>
    
    <xsl:template match="/"><xsl:text>
</xsl:text>
        <xsl:apply-templates select="//cr10:crossref | //cr11:crossref | //cr30:crossref"/>
        
    </xsl:template>
    
    <xsl:template match="@* | node()">
        <xsl:copy>
            <xsl:apply-templates select="@* | node()"/>
        </xsl:copy>
    </xsl:template>
</xsl:stylesheet>