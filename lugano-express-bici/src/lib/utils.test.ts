import { describe, test, expect } from "vitest"
import { cn } from "./utils"

describe("cn utility", () => {
    test("merges class names", () => {
        expect(cn("foo", "bar")).toBe("foo bar")
    })

    test("handles conditional classes with clsx syntax", () => {
        expect(cn("base", false && "hidden", "visible")).toBe("base visible")
    })

    test("handles undefined and null values", () => {
        expect(cn("base", undefined, null, "end")).toBe("base end")
    })

    test("handles empty string", () => {
        expect(cn("")).toBe("")
    })

    test("handles no arguments", () => {
        expect(cn()).toBe("")
    })

    test("merges tailwind classes correctly - last wins for conflicts", () => {
        expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4")
    })

    test("merges tailwind responsive classes", () => {
        expect(cn("text-sm md:text-base", "text-lg")).toBe("md:text-base text-lg")
    })

    test("handles array inputs", () => {
        expect(cn(["foo", "bar"])).toBe("foo bar")
    })

    test("handles object inputs (clsx style)", () => {
        expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz")
    })

    test("complex tailwind merge - background colors", () => {
        expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500")
    })

    test("complex tailwind merge - padding", () => {
        expect(cn("p-4", "px-2")).toBe("p-4 px-2")
    })

    test("preserves non-conflicting tailwind classes", () => {
        expect(cn("rounded-lg shadow-md", "bg-white p-4")).toBe(
            "rounded-lg shadow-md bg-white p-4"
        )
    })

    test("handles mixed inputs (strings, arrays, objects)", () => {
        const result = cn("base", ["extra"], { conditional: true })
        expect(result).toBe("base extra conditional")
    })
})
