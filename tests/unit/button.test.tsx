import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("rend un bouton accessible avec la variante par defaut", () => {
    render(<Button>Je m'inscris</Button>);
    const btn = screen.getByRole("button", { name: "Je m'inscris" });
    expect(btn).toHaveClass("bg-primary");
  });

  it("peut rendre un lien via asChild", () => {
    render(
      <Button asChild variant="outline">
        <a href="/inscription">S'inscrire</a>
      </Button>
    );
    expect(screen.getByRole("link", { name: "S'inscrire" })).toHaveAttribute(
      "href",
      "/inscription"
    );
  });
});
