import { describe, test, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Button, buttonVariants } from "./button"

describe("Button component", () => {
    test("renders with default variant and size", () => {
        render(<Button>Click me</Button>)
        const button = screen.getByRole("button", { name: /click me/i })
        expect(button).toBeInTheDocument()
        expect(button.tagName).toBe("BUTTON")
    })

    test("renders with custom className", () => {
        render(<Button className="custom-class">Test</Button>)
        const button = screen.getByRole("button")
        expect(button.className).toContain("custom-class")
    })

    test("renders as child element when asChild is true", () => {
        render(
            <Button asChild>
                <a href="/test">Link Button</a>
            </Button>
        )
        const link = screen.getByRole("link", { name: /link button/i })
        expect(link).toBeInTheDocument()
        expect(link.tagName).toBe("A")
    })

    test("applies variant classes correctly", () => {
        const { rerender } = render(<Button variant="destructive">Delete</Button>)
        let button = screen.getByRole("button")
        expect(button.className).toContain("bg-destructive")

        rerender(<Button variant="outline">Outline</Button>)
        button = screen.getByRole("button")
        expect(button.className).toContain("border")

        rerender(<Button variant="ghost">Ghost</Button>)
        button = screen.getByRole("button")
        expect(button.className).toContain("hover:bg-accent")
    })

    test("applies size classes correctly", () => {
        const { rerender } = render(<Button size="sm">Small</Button>)
        let button = screen.getByRole("button")
        expect(button.className).toContain("h-9")

        rerender(<Button size="lg">Large</Button>)
        button = screen.getByRole("button")
        expect(button.className).toContain("h-11")

        rerender(<Button size="icon">Icon</Button>)
        button = screen.getByRole("button")
        expect(button.className).toContain("h-10")
        expect(button.className).toContain("w-10")
    })

    test("passes HTML button attributes", () => {
        render(<Button disabled type="submit">Submit</Button>)
        const button = screen.getByRole("button")
        expect(button).toBeDisabled()
        expect(button).toHaveAttribute("type", "submit")
    })

    test("forwards ref correctly", () => {
        const ref = { current: null } as React.RefObject<HTMLButtonElement>
        render(<Button ref={ref}>Ref Button</Button>)
        expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })
})

describe("buttonVariants", () => {
    test("generates default variant classes", () => {
        const classes = buttonVariants()
        expect(classes).toContain("bg-primary")
        expect(classes).toContain("h-10")
    })

    test("generates specified variant classes", () => {
        const classes = buttonVariants({ variant: "link", size: "lg" })
        expect(classes).toContain("underline-offset-4")
        expect(classes).toContain("h-11")
    })
})
