package middlewares

import (
	"zApi/src/authentication"

	"github.com/gofiber/fiber/v2"
)

func AuthenticateUser(c *fiber.Ctx) error {
	if _, err := authentication.ValidateToken(c.Get("Authorization")); err != nil {
		return c.SendStatus(fiber.StatusUnauthorized)
	}
	return c.Next()
}
