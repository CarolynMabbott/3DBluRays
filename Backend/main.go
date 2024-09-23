package main

import (
	"database/sql"
	"fmt"
	"io"
	"strconv"
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
	http.HandleFunc("/bluray/series", getBluRaySeries)
	http.HandleFunc("/series/blurays", getBluraysInSeries)
	http.HandleFunc("/ultraHD", getUltraHD)
	http.HandleFunc("/steelbooks", getSteelbooks)
	http.HandleFunc("/series/add", addSeries)
	http.HandleFunc("/series", getSeries)
	http.HandleFunc("/bluray/edit", editBluray)

	// TODO - Used for testing, to be deleted
	http.HandleFunc("/debug/populate", populateDB)

	fmt.Println("Server listening on port 8080")
	http.ListenAndServe(":8080", nil)
}

type Series struct {
	ID   int
	Name string
}

type BluRay struct {
	ID               int
	Name             string
	Series           string
	Includes2D       bool
	Includes4K       bool
	SteelbookEdition bool
	HasSlipcover     bool
	Barcode          string
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
	_, err := db.Exec("CREATE TABLE IF NOT EXISTS series (id INTEGER PRIMARY KEY, Name TEXT)")
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS blurays (id INTEGER PRIMARY KEY, Name TEXT, Series TEXT, Includes2D BOOLEAN, Includes4K BOOLEAN, SteelbookEdition BOOLEAN, HasSlipcover BOOLEAN, Barcode TEXT, CONSTRAINT fk_series FOREIGN KEY (Series) REFERENCES series(name))")
	if err != nil {
		panic(err)
	}
}

func getBlurayInfoFromRow(row *sql.Rows) BluRay {
	var id int
	var name string
	var series string
	var includes2D bool
	var includes4K bool
	var steelbookEdition bool
	var hasSlipcover bool
	var barcode string
	err := row.Scan(&id, &name, &series, &includes2D, &includes4K, &steelbookEdition, &hasSlipcover, &barcode)
	if err != nil {
		panic(err)
	}
	return BluRay{ID: id, Name: name, Series: series, Includes2D: includes2D, Includes4K: includes4K, SteelbookEdition: steelbookEdition, HasSlipcover: hasSlipcover, Barcode: barcode}
}

func getSeriesInfoFromRow(row *sql.Rows) Series {
	var id int
	var name string
	err := row.Scan(&id, &name)
	if err != nil {
		panic(err)
	}
	return Series{ID: id, Name: name}
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

func getSeries(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") // TODO - Change later to the correct domain
	w.Header().Set("Access-Control-Allow-Methods", strings.Join([]string{http.MethodOptions, http.MethodGet}, ", "))
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
	} else if r.Method == http.MethodGet {
		db := openDB()
		defer db.Close()
		var series []Series = []Series{}
		rows, err := db.Query("SELECT * FROM series")
		if err != nil {
			panic(err)
		}
		defer rows.Close()
		for rows.Next() {
			series = append(series, getSeriesInfoFromRow(rows))
		}
		// Set content type to JSON
		w.Header().Set("Content-Type", "application/json")

		// Encode the users as JSON
		json.NewEncoder(w).Encode(series)
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

func getUltraHD(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") // TODO - Change later to the correct domain
	w.Header().Set("Access-Control-Allow-Methods", strings.Join([]string{http.MethodOptions, http.MethodGet}, ", "))
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
	} else if r.Method == http.MethodGet {
		db := openDB()
		defer db.Close()
		var blurays []BluRay = []BluRay{}
		rows, err := db.Query("SELECT * FROM blurays WHERE includes4K = true")
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

func getSteelbooks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") // TODO - Change later to the correct domain
	w.Header().Set("Access-Control-Allow-Methods", strings.Join([]string{http.MethodOptions, http.MethodGet}, ", "))
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
	} else if r.Method == http.MethodGet {
		db := openDB()
		defer db.Close()
		var blurays []BluRay = []BluRay{}
		rows, err := db.Query("SELECT * FROM blurays WHERE SteelbookEdition = true")
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
		idNumber, err := strconv.Atoi(id)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("Invalid ID"))
			return
		}
		// check number is positive
		if idNumber < 1 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("Invalid ID"))
			return
		}
		var bluray BluRay
		rows, err := db.Query("SELECT * FROM blurays WHERE id = ?", idNumber)
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
		idNumber, err := strconv.Atoi(id)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("Invalid ID"))
			return
		}
		// check number is positive
		if idNumber < 1 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("Invalid ID"))
			return
		}
		_, err = db.Exec("DELETE FROM blurays WHERE id = ?", id)
		if err != nil {
			panic(err)
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

func editBluray(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") // TODO - Change later to the correct domain
	w.Header().Set("Access-Control-Allow-Methods", strings.Join([]string{http.MethodOptions, http.MethodPatch}, ", "))
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
	} else if r.Method == http.MethodPatch {
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

		_, err = db.Exec("UPDATE blurays SET Name = $Name, Series = $Series, Includes2D = $Includes2D, Includes4K = $Includes4K, SteelbookEdition = $SteelbookEdition, HasSlipcover = $HasSlipcover, Barcode = $Barcode WHERE id = $ID", bluray.Name, bluray.Series, bluray.Includes2D, bluray.Includes4K, bluray.SteelbookEdition, bluray.HasSlipcover, bluray.Barcode, bluray.ID)
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

		_, err = db.Exec("INSERT INTO blurays (Name, Series, Includes2D, Includes4K, SteelbookEdition, HasSlipcover, Barcode) VALUES ($Name, $Series, $Includes2D, $Includes4K, $SteelbookEdition, $HasSlipcover, $Barcode)", bluray.Name, bluray.Series, bluray.Includes2D, bluray.Includes4K, bluray.SteelbookEdition, bluray.HasSlipcover, bluray.Barcode)
		if err != nil {
			panic(err)
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

func addSeries(w http.ResponseWriter, r *http.Request) {
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
		var series Series
		err = json.Unmarshal(body, &series)
		if err != nil {
			panic(err)
		}

		_, err = db.Exec("INSERT INTO series (Name) VALUES ($Name)", series.Name)
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

		var series []Series = []Series{
			{Name: "Pokemon"},
			{Name: "How To Train Your Dragon"},
			{Name: "Transformers"},
			{Name: "Jurassic Park"},
			{Name: "Alita"},
			{Name: "Suicide Squad"},
			{Name: "Assassin's Creed"},
			{Name: "Avengers"},
			{Name: "Captain America"},
			{Name: "Guardians of the Galaxy"},
			{Name: "Black Panther"},
			{Name: "Thor"},
			{Name: "Iron Man"},
		}

		var blurays []BluRay = []BluRay{
			{Name: "Pokemon Detective Pikachu", Series: "Pokemon", Includes2D: true, Includes4K: false, SteelbookEdition: false, HasSlipcover: true, Barcode: "5051892221290"},
			{Name: "How To Train Your Dragon", Series: "How To Train Your Dragon", Includes2D: true, Includes4K: false, SteelbookEdition: false, HasSlipcover: false, Barcode: "5051368230856"},
			{Name: "How To Train Your Dragon 2", Series: "How To Train Your Dragon", Includes2D: true, Includes4K: false, SteelbookEdition: false, HasSlipcover: true, Barcode: "5039036069892"},
			{Name: "How To Train Your Dragon The Hidden World", Series: "How To Train Your Dragon", Includes2D: true, Includes4K: false, SteelbookEdition: false, HasSlipcover: true, Barcode: "5053083179885"},
			{Name: "Transformers Dark of the Moon", Series: "Transformers", Includes2D: true, Includes4K: false, SteelbookEdition: false, HasSlipcover: true, Barcode: "5051368227030"},
			{Name: "Transformers Age of Extinction", Series: "Transformers", Includes2D: true, Includes4K: false, SteelbookEdition: false, HasSlipcover: false, Barcode: "5051368260839"},
			{Name: "Jurassic Park", Series: "Jurassic Park", Includes2D: true, Includes4K: false, SteelbookEdition: false, HasSlipcover: false, Barcode: "5050582935813"},
			{Name: "Jurassic World", Series: "Jurassic Park", Includes2D: false, Includes4K: false, SteelbookEdition: false, HasSlipcover: true, Barcode: "5053083048372"},
			{Name: "Alita Battle Angel", Series: "Alita", Includes2D: true, Includes4K: true, SteelbookEdition: false, HasSlipcover: true, Barcode: "5039036092364"},
			{Name: "Suicide Squad", Series: "Suicide Squad", Includes2D: true, Includes4K: false, SteelbookEdition: false, HasSlipcover: false, Barcode: "5051892196277"},
			{Name: "Assassin's Creed", Series: "Assassin's Creed", Includes2D: true, Includes4K: false, SteelbookEdition: false, HasSlipcover: false, Barcode: "5039036079501"},
			{Name: "Avengers Assemble", Series: "Avengers", Includes2D: true, Includes4K: false, SteelbookEdition: false, HasSlipcover: true, Barcode: "8717418358570"},
			{Name: "Avengers Age of Ultron", Series: "Avengers", Includes2D: true, Includes4K: false, SteelbookEdition: false, HasSlipcover: true, Barcode: "8717418458973"},
			{Name: "Captain America The First Avenger", Series: "Captain America", Includes2D: true, Includes4K: false, SteelbookEdition: false, HasSlipcover: false, Barcode: "5051368227139"},
			{Name: "Captain America The Winter Soldier", Series: "Captain America", Includes2D: true, Includes4K: false, SteelbookEdition: false, HasSlipcover: true, Barcode: "8717418429256"},
			{Name: "Guardians of the Galaxy", Series: "Guardians of the Galaxy", Includes2D: false, Includes4K: false, SteelbookEdition: false, HasSlipcover: false, Barcode: "8717418440329"},
			{Name: "Black Panther", Series: "Black Panther", Includes2D: true, Includes4K: false, SteelbookEdition: false, HasSlipcover: false, Barcode: "8717418527549"},
			{Name: "Thor", Series: "Thor", Includes2D: true, Includes4K: false, SteelbookEdition: false, HasSlipcover: false, Barcode: "5051368226835"},
			{Name: "Iron Man 3", Series: "Iron Man", Includes2D: true, Includes4K: false, SteelbookEdition: false, HasSlipcover: true, Barcode: "8717418400514"},
		}

		stmt, err := db.Prepare("INSERT INTO series (Name) VALUES ($Name)")
		if err != nil {
			panic(err)
		}
		defer stmt.Close()

		for _, series := range series {
			_, err = stmt.Exec(series.Name)
			if err != nil {
				panic(err)
			}
		}
		stmt, err = db.Prepare("INSERT INTO blurays (Name, Series, Includes2D, Includes4K, SteelbookEdition, HasSlipcover, Barcode) VALUES ($Name, $Series, $Includes2D, $Includes4K, $SteelbookEdition, $HasSlipcover, $Barcode)")
		if err != nil {
			panic(err)
		}
		defer stmt.Close()

		for _, bluray := range blurays {
			_, err = stmt.Exec(bluray.Name, bluray.Series, bluray.Includes2D, bluray.Includes4K, bluray.SteelbookEdition, bluray.HasSlipcover, bluray.Barcode)
			if err != nil {
				panic(err)
			}
		}

		w.WriteHeader(http.StatusNoContent)
	}
}
