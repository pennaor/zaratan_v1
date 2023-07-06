package ztypes

type User struct {
	Id       uint64 `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password,omitempty"`
	Token    string `json:"token,omitempty"`
}
