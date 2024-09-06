package main

import (
	"database/sql"
	"fmt"
	"io"
	"strings"

	"encoding/json"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	createDB()

	http.HandleFunc("/blurays", getBlurays)
	http.HandleFunc("/bluray", getBluray)
	http.HandleFunc("/bluray/delete", deleteBluray)
	http.HandleFunc("/bluray/add", addBluray)
	http.HandleFunc("/series", getBluRaySeries)
	http.HandleFunc("/series/blurays", getBluraysInSeries)

	// TODO - Used for testing, to be deleted
	http.HandleFunc("/debug/populate", populateDB)

	fmt.Println("Server listening on port 8080")
	http.ListenAndServe(":8080", nil)
}

type BluRay struct {
	ID      int
	Name    string
	Series  string
	Barcode string
}

func openDB() *sql.DB {
	db, err := sql.Open("sqlite3", "./3DBluRays.db")
	if err != nil {
		panic(err)
	}
	return db
}

func createDB() {
	db := openDB()
	defer db.Close()

	// TODO Make combo of name and series unique
	_, err := db.Exec("CREATE TABLE IF NOT EXISTS blurays (id INTEGER PRIMARY KEY, Name TEXT, Series TEXT, Barcode TEXT)")
	if err != nil {
		panic(err)
	}
}

func getBlurayInfoFromRow(row *sql.Rows) BluRay {
	var id int
	var name string
	var series string
	var barcode string
	err := row.Scan(&id, &name, &series, &barcode)
	if err != nil {
		panic(err)
	}
	return BluRay{ID: id, Name: name, Series: series, Barcode: barcode}
}

func getBlurays(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") // TODO - Change later to the correct domain
	w.Header().Set("Access-Control-Allow-Methods", strings.Join([]string{http.MethodOptions, http.MethodGet}, ", "))
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
	} else if r.Method == http.MethodGet {
		db := openDB()
		defer db.Close()
		var blurays []BluRay = []BluRay{}
		rows, err := db.Query("SELECT * FROM blurays")
		if err != nil {
			panic(err)
		}
		defer rows.Close()
		for rows.Next() {
			blurays = append(blurays, getBlurayInfoFromRow(rows))
		}
		// Set content type to JSON
		w.Header().Set("Content-Type", "application/json")

		// Encode the users as JSON
		json.NewEncoder(w).Encode(blurays)
	}
}

func getBluraysInSeries(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") // TODO - Change later to the correct domain
	w.Header().Set("Access-Control-Allow-Methods", strings.Join([]string{http.MethodOptions, http.MethodGet}, ", "))
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
	} else if r.Method == http.MethodGet {
		db := openDB()
		defer db.Close()
		series := r.URL.Query().Get("name")
		var blurays []BluRay = []BluRay{}
		rows, err := db.Query("SELECT * FROM blurays WHERE series = ?", series)
		if err != nil {
			panic(err)
		}
		defer rows.Close()
		for rows.Next() {
			blurays = append(blurays, getBlurayInfoFromRow(rows))
		}
		// Set content type to JSON
		w.Header().Set("Content-Type", "application/json")

		// Encode the users as JSON
		json.NewEncoder(w).Encode(blurays)
	}
}

func getBluRaySeries(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") // TODO - Change later to the correct domain
	w.Header().Set("Access-Control-Allow-Methods", strings.Join([]string{http.MethodOptions, http.MethodGet}, ", "))
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
	} else if r.Method == http.MethodGet {
		db := openDB()
		defer db.Close()
		var bluraySeries []string = []string{}
		rows, err := db.Query("SELECT DISTINCT Series FROM blurays")
		if err != nil {
			panic(err)
		}
		defer rows.Close()
		for rows.Next() {
			var series string
			err = rows.Scan(&series)
			if err != nil {
				panic(err)
			}
			bluraySeries = append(bluraySeries, series)
		}
		// Set content type to JSON
		w.Header().Set("Content-Type", "application/json")

		// Encode the users as JSON
		json.NewEncoder(w).Encode(bluraySeries)
	}
}

func getBluray(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") // TODO - Change later to the correct domain
	w.Header().Set("Access-Control-Allow-Methods", strings.Join([]string{http.MethodOptions, http.MethodGet}, ", "))
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
	} else if r.Method == http.MethodGet {
		db := openDB()
		defer db.Close()
		// TODO Check this is a valid number
		id := r.URL.Query().Get("id")
		var bluray BluRay
		rows, err := db.Query("SELECT * FROM blurays WHERE id = ?", id)
		if err != nil {
			panic(err)
		}
		defer rows.Close()
		for rows.Next() {
			bluray = getBlurayInfoFromRow(rows)
		}
		// Set content type to JSON
		w.Header().Set("Content-Type", "application/json")

		// Encode the users as JSON
		json.NewEncoder(w).Encode(bluray)
	}
}

func deleteBluray(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") // TODO - Change later to the correct domain
	w.Header().Set("Access-Control-Allow-Methods", strings.Join([]string{http.MethodOptions, http.MethodDelete}, ", "))
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
	} else if r.Method == http.MethodDelete {
		db := openDB()
		defer db.Close()
		// TODO Check this is a valid number
		id := r.URL.Query().Get("id")
		_, err := db.Exec("DELETE FROM blurays WHERE id = ?", id)
		if err != nil {
			panic(err)
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

func addBluray(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") // TODO - Change later to the correct domain
	w.Header().Set("Access-Control-Allow-Methods", strings.Join([]string{http.MethodOptions, http.MethodPost}, ", "))
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
	} else if r.Method == http.MethodPost {
		db := openDB()
		defer db.Close()

		body, err := io.ReadAll(r.Body)
		if err != nil {
			panic(err)
		}
		var bluray BluRay
		err = json.Unmarshal(body, &bluray)
		if err != nil {
			panic(err)
		}

		_, err = db.Exec("INSERT INTO blurays (Name, Series, Barcode) VALUES ($Name, $Series, $Barcode)", bluray.Name, bluray.Series, bluray.Barcode)
		if err != nil {
			panic(err)
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

func populateDB(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") // TODO - Change later to the correct domain
	w.Header().Set("Access-Control-Allow-Methods", strings.Join([]string{http.MethodOptions, http.MethodGet}, ", "))
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
	} else if r.Method == http.MethodGet {
		db := openDB()
		defer db.Close()

		var blurays []BluRay = []BluRay{
			{Name: "Pokemon Detective Pikachu", Series: "Pokemon", Barcode: "5051892221290"},
			{Name: "How To Train Your Dragon", Series: "How To Train Your Dragon", Barcode: "5051368230856"},
			{Name: "How To Train Your Dragon 2", Series: "How To Train Your Dragon", Barcode: "5039036069892"},
			{Name: "How To Train Your Dragon The Hidden World", Series: "How To Train Your Dragon", Barcode: "5053083179885"},
			{Name: "Transformers Dark of the Moon", Series: "Transformers", Barcode: "5051368227030"},
			{Name: "Transformers Age of Extinction", Series: "Transformers", Barcode: "5051368260839"},
			{Name: "Jurassic Park", Series: "Jurassic Park", Barcode: "5050582935813"},
			{Name: "Jurassic World", Series: "Jurassic Park", Barcode: "5053083048372"},
			{Name: "Alita Battle Angel", Series: "Alita", Barcode: "5039036092364"},
			{Name: "Suicide Squad", Series: "Suicide Squad", Barcode: "5051892196277"},
			{Name: "Assassin's Creed", Series: "Assassin's Creed", Barcode: "5039036079501"},
			{Name: "Avengers Assemble", Series: "Marvel Cinematic Universe", Barcode: "8717418358570"},
			{Name: "Avengers Age of Ultron", Series: "Marvel Cinematic Universe", Barcode: "8717418458973"},
			{Name: "Captain America The First Avenger", Series: "Marvel Cinematic Universe", Barcode: "5051368227139"},
			{Name: "Captain America The Winter Soldier", Series: "Marvel Cinematic Universe", Barcode: "8717418429256"},
			{Name: "Guardians of the Galaxy", Series: "Marvel Cinematic Universe", Barcode: "8717418440329"},
			{Name: "Black Panther", Series: "Marvel Cinematic Universe", Barcode: "8717418527549"},
			{Name: "Thor", Series: "Marvel Cinematic Universe", Barcode: "5051368226835"},
			{Name: "Iron Man 3", Series: "Marvel Cinematic Universe", Barcode: "8717418400514"},
		}

		stmt, err := db.Prepare("INSERT INTO blurays (Name, Series, Barcode) VALUES ($Name, $Series, $Barcode)")
		if err != nil {
			panic(err)
		}
		defer stmt.Close()

		for _, bluray := range blurays {
			_, err = stmt.Exec(bluray.Name, bluray.Series, bluray.Barcode)
			if err != nil {
				panic(err)
			}
		}

		w.WriteHeader(http.StatusNoContent)
	}
}
