import { node as propNode } from "prop-types";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface ScrollTopProps {
  children?: React.ReactNode;
}

/**
 * ScrollTop — scrolls the window to top when the route pathname changes.
 */
export default function ScrollTop({
  children,
}: ScrollTopProps): React.ReactNode | null {
  const { pathname } = useLocation();

  useEffect(() => {
    // simple and fast scroll-to-top; if you prefer smooth behavior,
    // change to: window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    window.scrollTo(0, 0);
  }, [pathname]);

  return (children ?? null) as React.ReactNode;
}

ScrollTop.propTypes = {
  children: propNode,
};
