## Installieren

1. Dependencies installieren
   ```shell
   npm install
   ```
2. Umgebungsvariablen nach der `.env.example` setzen

3. Anwendung starten
   ```shell
   npm run
   # oder
   npm run dev
   ```

## GO

### Setup

- Projekt initialisieren

      ```bash
      go mod init <module>
      ```

- Datei ausführen

      ```bash
      go run <datei>
      ```

- Projekt bauen

      ```bash
      go build index.go
      ```

- Pakete installieren/deinstallieren

      ```bash
      go mod init foo/bar # enables dependency tracking
      ```

### Codeauschnitte

#### Variablen definieren

````go
var name string = "Thorben" // store an variable string called name w/ value Thorben

// or w/ short assignment syntax
name, age := "Thorben", 21
```y

#### Sonstiges

```go
var year int = 2023
var p *int = &year // reference value of year
````

### Datentypen

#### Array

```go
myArray = [3]string
myArray[0] = "first"
myArray[1] = "second"
myArray[2] = "third"
```

#### Map

```go
myMap = map[string]int
myMap["thorben"] = 21
myMap["jakobus"] = 19
```

### Schleifen

#### for (i++)

```go
for i := 0; i < 10; i++ {
   fmt.Println(i)
}
```
