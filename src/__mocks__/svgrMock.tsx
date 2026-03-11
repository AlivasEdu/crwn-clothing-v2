// src/__mocks__/svgrMock.tsx
import React, { SVGProps } from "react";

const SvgMock = (props: SVGProps<SVGSVGElement>) => <svg {...props} />;

export default SvgMock;
export { SvgMock as ReactComponent };