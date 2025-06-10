import { describe, it, vi, beforeEach, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ReportForm from "../../components/ReportForm";
import React from "react";

vi.mock("../../components/PlacesAutocomplete", () => ({
  default: ({ value, onChange }) => (
    <input
      data-testid="autocomplete-input"
      value={value}
      onChange={(e) =>
        onChange({ target: { name: "location", value: e.target.value } })
      }
    />
  ),
}));

vi.mock("../../apis/firebaseService", () => ({
  getAllEmergencyNames: vi.fn(() => Promise.resolve({})),
  getIndexByEmergencyName: vi.fn(() => Promise.resolve("")),
}));

describe("ReportForm Location Input", () => {
  let formData;
  let handleChange;

  beforeEach(() => {
    handleChange = vi.fn();
    formData = {
      location: "",
      time: "",
      numPeople: 0,
      emergencies: "",
      isResolved: false,
      notes: "",
      phoneNumber: "",
      email: "",
      appearance: "",
      assignedOrg: "PADS Lake County",
    };
  });

  it("updates location when user types in autocomplete", () => {
    render(
      <ReportForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={vi.fn()}
        submissionStatus={null}
      />
    );

    const autocompleteInput = screen.getByTestId("autocomplete-input");
    fireEvent.change(autocompleteInput, {
      target: { value: "123 Main St, Chicago, IL" },
    });

    expect(handleChange).toHaveBeenCalledWith({
      target: { name: "location", value: "123 Main St, Chicago, IL" },
    });
  });

  it("displays location value in the input field", () => {
    const formDataWithLocation = { ...formData, location: "Test Address" };

    render(
      <ReportForm
        formData={formDataWithLocation}
        handleChange={handleChange}
        handleSubmit={vi.fn()}
        submissionStatus={null}
      />
    );

    const autocompleteInput = screen.getByTestId("autocomplete-input");
    expect(autocompleteInput.value).toBe("Test Address");
  });
});
