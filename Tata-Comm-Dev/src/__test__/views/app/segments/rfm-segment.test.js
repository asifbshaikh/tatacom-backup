import { render } from "@testing-library/react";
import { describe, expect, it } from "@jest/globals";
import RFMSegment from "views/app/segments/rfm-segment";

describe("RFMSegment component", () => {
    it("render without crashing", () => {
      const { asFragment } = render(<RFMSegment />);
      expect(asFragment()).toMatchSnapshot();
    });
  });