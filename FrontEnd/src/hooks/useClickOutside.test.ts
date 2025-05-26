import { renderHook } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { useClickOutside } from "./useClickOutside"; // adjust the import path

describe("useClickOutside", () => {
  it("should call callback when clicking outside the element", () => {
    const callback = vi.fn();
    const ref = { current: document.createElement("div") };

    // Render the hook
    renderHook(() => useClickOutside(ref, callback));

    // Simulate click outside
    fireEvent.mouseDown(document.body);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not call callback when clicking inside the element", () => {
    const callback = vi.fn();
    const ref = { current: document.createElement("div") };

    renderHook(() => useClickOutside(ref, callback));

    // Simulate click inside
    fireEvent.mouseDown(ref.current);

    expect(callback).not.toHaveBeenCalled();
  });

  it("should clean up event listener on unmount", () => {
    const callback = vi.fn();
    const ref = { current: document.createElement("div") };
    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

    const { unmount } = renderHook(() => useClickOutside(ref, callback));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("mousedown", expect.any(Function));
  });
});
