Variablen und Datentypen:

Variablendeklaration: var name type
Kurzform der Variablendeklaration: name := value
Ganzzahl: int, int8, int16, int32, int64
Fließkommazahlen: float32, float64
Boolesche Werte: bool (true, false)
Zeichenkette: string
Kontrollstrukturen:

If-Anweisung:

go
Copy code
if condition {
// Code, der ausgeführt wird, wenn die Bedingung wahr ist
} else {
// Code, der ausgeführt wird, wenn die Bedingung falsch ist
}
Schleifen:

For-Schleife:

go
Copy code
for initialization; condition; post {
// Code, der wiederholt ausgeführt wird
}
While-Schleife (ähnlich einer For-Schleife):

go
Copy code
for condition {
// Code, der wiederholt ausgeführt wird
}
Endlosschleife:

go
Copy code
for {
// Code, der unendlich wiederholt wird
}
Switch-Anweisung:

go
Copy code
switch variable {
case value1:
// Code, der ausgeführt wird, wenn variable mit value1 übereinstimmt
case value2:
// Code, der ausgeführt wird, wenn variable mit value2 übereinstimmt
default:
// Code, der ausgeführt wird, wenn keine der vorherigen Bedingungen erfüllt ist
}
Funktionen:

Funktionen definieren:

go
Copy code
func functionName(parameters) returnType {
// Code, der in der Funktion ausgeführt wird
return value
}
Funktionen aufrufen:

go
Copy code
result := functionName(arguments)
Arrays, Slices und Maps:

Arrays: var arr [size]type (statische Größe)
Slices: var slice []type (dynamische Größe)
Maps: var m map[keyType]valueType
Strukturen:

Strukturdefinition:

go
Copy code
type StructName struct {
field1 type1
field2 type2
// ...
}
Instanz einer Struktur erstellen:

go
Copy code
variable := StructName{field1: value1, field2: value2}
Pakete und Importe:

Paketdeklaration: package packageName
Importieren von Paketen: import "packageName" oder import aliasName "packageName"
Fehlerbehandlung:

Fehler zurückgeben: return value, error
Fehler prüfen:
go
Copy code
result, err := functionName(arguments)
if err != nil {
// Fehlerbehandlung
}
Zeiger:

Zeigerdeklaration: var p *type
Zeigerzugriff: *p
Adressoperator: &variable
Das sind die grundlegenden Konzepte, die dir den Einstieg
