package services

type HttpError struct {
	Code       int
	UserReport interface{}
	Err        error
}

func (httpError *HttpError) Error() string {
	return httpError.Err.Error()
}
