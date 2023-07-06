package utils

import (
	"math"
)

// https://gosamples.dev/round-float/
func RoundFloat(value float64, precision uint) float64 {
	ratio := math.Pow(10, float64(precision))
	return math.Round(value*ratio) / ratio
}
