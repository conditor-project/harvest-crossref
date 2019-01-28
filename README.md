# harvest-crossref

Cet outil permet d'automatiser l'interrogation à l'API Crossref pour récupérer un jeu de notices XML à partir d'une liste de DOI. 
Les appels à l'API Crossref se font via l'URL `https://api.crossref.org/works/<doi>.xml`

Usage : 

`./crawl-by-dois.js <file> <output_dir> <suffix_url> 2> error.log > out.log`

avec :

* `file` Un fichier texte contenant un DOI par ligne
* `output_dir` le répertoire de destination, dans lequel seront écrites les notices XML
* `suffix_url` un suffixe systématiquement ajouté à la fin de l'URL d'appel à l'API Crossref. Par exemple : `?usr=...&pwd=...` si vous êtes abonnés à Metadata Plus
* `error.log` un fichier de log d'erreur
* `out.log` un fichier de log
