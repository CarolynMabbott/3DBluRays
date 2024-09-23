package main

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

func MakeRequest(t *testing.T, handlerFunc http.HandlerFunc, method string, path string, body io.Reader, expectedStatusCode int) *httptest.ResponseRecorder {
	// Create a request
	req, err := http.NewRequest(method, path, body)
	if err != nil {
		t.Fatal(err)
	}

	// Create a response recorder for the request
	rr := httptest.NewRecorder()

	// Handle the request
	handler := http.HandlerFunc(handlerFunc)
	handler.ServeHTTP(rr, req)

	// Check the status code of the response
	if status := rr.Code; status != expectedStatusCode {
		t.Errorf("wrong status code: got %v wanted %v",
			status, expectedStatusCode)
	}
	return rr
}

func TestGetBlurays(t *testing.T) {
	rr := MakeRequest(t, getBlurays, "GET", "/blurays", nil, http.StatusOK)
	// Check the response body is an array of BluRays
	var BluRays []BluRay
	json.Unmarshal(rr.Body.Bytes(), &BluRays)
	//TODO - Check BluRays get back blurays correctly
}

func TestInvalidIDWithLettersForGettingBluray(t *testing.T) {
	rr := MakeRequest(t, getBluray, "GET", "/bluray?id=abc", nil, http.StatusBadRequest)

	expected := "Invalid ID"
	if rr.Body.String() != expected {
		t.Errorf(" wrong response: got %v want %v",
			rr.Body.String(), expected)
	}

}

func TestInvalidIDWithNegativeNumberForGettingBluray(t *testing.T) {
	rr := MakeRequest(t, getBluray, "GET", "/bluray?id=-1", nil, http.StatusBadRequest)

	expected := "Invalid ID"
	if rr.Body.String() != expected {
		t.Errorf(" wrong response: got %v want %v",
			rr.Body.String(), expected)
	}

}

func TestInvalidIDWithLettersForDeletingBluray(t *testing.T) {
	rr := MakeRequest(t, deleteBluray, "DELETE", "/bluray/delete?id=abc", nil, http.StatusBadRequest)

	expected := "Invalid ID"
	if rr.Body.String() != expected {
		t.Errorf(" wrong response: got %v want %v",
			rr.Body.String(), expected)
	}

}

func TestInvalidIDWithNegativeNumberForDeletingBluray(t *testing.T) {
	rr := MakeRequest(t, deleteBluray, "DELETE", "/bluray/delete?id=-1", nil, http.StatusBadRequest)

	expected := "Invalid ID"
	if rr.Body.String() != expected {
		t.Errorf(" wrong response: got %v want %v",
			rr.Body.String(), expected)
	}

}

//TODO add more tests
