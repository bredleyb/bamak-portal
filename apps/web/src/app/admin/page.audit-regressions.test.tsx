import type { ComponentProps } from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import AdminPage from "./page";

const replace = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    onClick,
    ...props
  }: ComponentProps<"a">) => (
    <a
      {...props}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
    >
      {children}
    </a>
  ),
}));

describe("ADM-02 — regressões da auditoria", () => {
  const base = "http://localhost:3001/api";
  const initialWidth = window.innerWidth;

  beforeEach(() => {
    replace.mockReset();
    vi.stubEnv("NEXT_PUBLIC_API_URL", base);
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: initialWidth,
    });

    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  function setViewportWidth(width: number) {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: width,
    });

    fireEvent(window, new Event("resize"));
  }

  function authenticate(
    role: "ADMINISTRATOR" | "OPERATOR",
  ) {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          userId: "00000000-0000-4000-8000-000000000001",
          role,
        }),
      }),
    );
  }

  async function openDrawer() {
    const user = userEvent.setup();

    await screen.findByRole("heading", {
      name: "Visão geral",
    });

    await user.click(
      screen.getByRole("button", {
        name: "Abrir menu administrativo",
      }),
    );

    const drawer = screen.getByRole("dialog", {
      name: "Menu administrativo",
    });

    return { user, drawer };
  }

  it("fecha a gaveta ao passar de mobile para tablet", async () => {
    setViewportWidth(390);
    authenticate("ADMINISTRATOR");

    const previousOverflow = document.body.style.overflow;

    render(<AdminPage />);

    await openDrawer();

    expect(
      screen.getByRole("dialog", {
        name: "Menu administrativo",
      }),
    ).toBeInTheDocument();

    setViewportWidth(1024);

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", {
          name: "Menu administrativo",
        }),
      ).not.toBeInTheDocument();

      expect(document.body.style.overflow).toBe(
        previousOverflow,
      );
    });
  });

  it("fecha a gaveta quando o usuario seleciona Painel", async () => {
    setViewportWidth(390);
    authenticate("ADMINISTRATOR");

    render(<AdminPage />);

    const { user, drawer } = await openDrawer();

    const navigation = within(drawer).getByRole(
      "navigation",
      { name: "Navegação do menu administrativo" },
    );

    await user.click(
      within(navigation).getByRole("link", {
        name: "Painel",
      }),
    );

    expect(
      screen.queryByRole("dialog", {
        name: "Menu administrativo",
      }),
    ).not.toBeInTheDocument();
  });

  it("nao apresenta acao de Comunicacao ao Operador", async () => {
    authenticate("OPERATOR");

    render(<AdminPage />);

    expect(
      await screen.findByRole("heading", {
        name: "Visão geral",
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: "Gerenciar comunicação",
      }),
    ).not.toBeInTheDocument();

    const navigation = screen.getByRole("navigation", {
      name: "Navegação administrativa",
    });

    expect(
      within(navigation).queryByText("Comunicação"),
    ).not.toBeInTheDocument();
  });
});