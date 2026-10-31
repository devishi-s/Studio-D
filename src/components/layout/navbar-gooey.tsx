"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { NAV_LINKS } from "@/lib/constants";
import { GooeyNav } from "@/components/ui/gooey-nav";

function activeIndexFromPath(pathname: string) {
  const index = NAV_LINKS.findIndex((link) =>
    link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
  );
  return index >= 0 ? index : 0;
}

export function NavbarGooey() {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(() =>
    activeIndexFromPath(pathname)
  );

  useEffect(() => {
    setActiveIndex(activeIndexFromPath(pathname));
  }, [pathname]);

  return (
    <div className="hidden md:flex">
      <GooeyNav
        items={NAV_LINKS}
        activeIndex={activeIndex}
        onChange={(index) => setActiveIndex(index)}
        theme="light"
        color="#E8B0BA"
        activeTextColor="#6B3A2A"
        colors={["#E8B0BA", "#F3C8D0", "#D9A0AC", "#F6D4DA"]}
        size="sm"
        frame={false}
        particleCount={5}
        spread={18}
        animationTime={680}
        gooeyness={0.32}
        wobble={0.22}
        look="threads"
        className="gooey-nav--navbar font-ui"
      />
    </div>
  );
}
