package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGetBlurays(t *testing.T) {
	// Create a request to the server
	req, err := http.NewRequest("GET", "/blurays", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Create a response recorder for the request
	rr := httptest.NewRecorder()

	// Handle the request
	handler := http.HandlerFunc(getBlurays)
	handler.ServeHTTP(rr, req)

	// Check the status code of the response
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	// Check the response body is an array of BluRays
	var BluRays []BluRay
	json.Unmarshal(rr.Body.Bytes(), &BluRays)
}
