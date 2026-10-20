import { fireEvent, screen, within } from "@testing-library/react";

import { t } from "../i18n";
import { Excalidraw } from "../index";

import { render, unmountComponent } from "./test-utils";

unmountComponent();

describe("help dialog shortcut search", () => {
  beforeEach(async () => {
    await render(
      <Excalidraw
        initialData={{ appState: { openDialog: { name: "help" } } }}
      />,
    );
  });

  const search = (value: string) => {
    fireEvent.change(screen.getByRole("searchbox"), { target: { value } });
    return within(screen.getByRole("dialog"));
  };

  it("filters labels ignoring case and surrounding whitespace", () => {
    const dialog = search(`  ${t("toolBar.rectangle").toUpperCase()}  `);
    expect(dialog.getByText(t("toolBar.rectangle"))).toBeInTheDocument();
    expect(dialog.queryByText(t("toolBar.ellipse"))).not.toBeInTheDocument();
  });

  it("matches shortcut keys", () => {
    const dialog = search("1");
    expect(dialog.getByText(t("toolBar.selection"))).toBeInTheDocument();
    expect(dialog.queryByText(t("toolBar.rectangle"))).not.toBeInTheDocument();
  });

  it("hides empty groups and restores all shortcuts when cleared", () => {
    const dialog = search("no-shortcut-matches-this-query");
    expect(dialog.getByRole("status")).toHaveTextContent(t("search.noMatch"));
    expect(dialog.queryByText(t("helpDialog.tools"))).not.toBeInTheDocument();
    search("");
    expect(dialog.queryByRole("status")).not.toBeInTheDocument();
    expect(dialog.getByText(t("toolBar.rectangle"))).toBeInTheDocument();
    expect(dialog.getByText(t("toolBar.ellipse"))).toBeInTheDocument();
  });
});
