package main

import (
	"fmt"
	"strings"
)

func main() {
	str := `199
			200
			208
			210
			200
			207
			240
			269
			260
			263`
	increased := 0
	arr := strings.Fields(str)
	for idx, word := range arr {
		if idx == 0 {
			continue
		}
		if word > arr[idx - 1] {
			increased++
		}
	}
	fmt.Println("Increased:", increased)
}