package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

const (
	apiEndpoint    = "https://api.panthor.de/v1/changelogs" // Ersetze durch den tatsächlichen Endpunkt
	checkInterval  = 5 * time.Minute                  // Ersetze mit dem gewünschten Intervall
	lastVersionKey = "lastVersion"                     // Schlüssel zum Speichern der zuletzt abgerufenen Version
)

type ChangelogResponse struct {
	data []Changelog
	requested_At int
}

type Changelog struct {
	ID            int      `json:"id"`
	Version       string   `json:"version"`
	ChangeMission []string `json:"change_mission"`
	ChangeMap     []string `json:"change_map"`
	ChangeMod     []string `json:"change_mod"`
	Note          string   `json:"note"`
	Active        int      `json:"active"`
	Size          string   `json:"size,omitempty"`
	ReleaseAt     string   `json:"release_at"`
	CreatedAt     string   `json:"created_at"`
	UpdatedAt     string   `json:"updated_at"`
}

func main() {
	// Lesen einer einzelnen Umgebungsvariable
	value := os.Getenv("MY_VARIABLE")
	fmt.Println("Wert der Umgebungsvariable MY_VARIABLE:", value)

	// Lesen aller Umgebungsvariablen
	env := os.Environ()
	for _, e := range env {
		fmt.Println(e)
	}
}

func fetchLatestChangelog() (*Changelog, error)  {
	res, err := http.Get(apiEndpoint)
	if err != nil { 
		return nil, err
	}

	defer res.Body.Close() // was genau macht hier das body.Close() und defer?

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Received Status-Code %d", res.StatusCode)
	}

	var changelogs ChangelogResponse	
	err = json.NewDecoder(res.Body).Decode(&changelogs)
	if err != nil {
		return nil, err
	}

	return &changelogs.data[0], nil
}