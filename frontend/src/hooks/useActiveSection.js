import { useEffect, useState } from "react";

export default function useActiveSection(sectionIds) {
    const [active, setActive] = useState("home");

    useEffect(() => {
        const handleScroll = () => {
            const scrollPos = window.scrollY + 120;

            for (let i = sectionIds.length - 1; i >= 0; i--) {
                const section = document.getElementById(sectionIds[i]);
                if (section && section.offsetTop <= scrollPos) {
                    setActive(sectionIds[i]);
                    break;
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [sectionIds]);

    return active;
}
