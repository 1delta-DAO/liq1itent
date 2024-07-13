import React, { useContext, useEffect, useState } from "react";
import { TabKeys } from "../../data/tabs";
import styles from "./Menu.module.scss";

interface MenuValue {
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
  selectedTab: TabKeys;
  onTabSelected: (tab: TabKeys) => void;
  dropDownOpenTitle: string;
  onDropDownToggled: (title: string) => void;
  isHamburgerOpen: boolean;
  onHamburgerToggled: () => void;
}

const MenuContext = React.createContext<MenuValue>({
  isMobile: false,
  setIsMobile: () => {
    void 0;
  },
  selectedTab: TabKeys.Swap,
  onTabSelected: () => {
    void 0;
  },
  dropDownOpenTitle: "",
  onDropDownToggled: () => {
    void 0;
  },
  isHamburgerOpen: false,
  onHamburgerToggled: () => {
    void 0;
  },
});

export const useMenu = (): MenuValue => useContext(MenuContext);

type MenuProviderProps = {
  children: React.ReactNode;
};

export const MenuProvider: React.FC<MenuProviderProps> = (
  props: MenuProviderProps
) => {
  const [selectedTab, setSelectedTab] = useState<TabKeys>(TabKeys.Swap);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [dropDownOpenTitle, setDropDownOpenTitle] = useState<string>("");
  const [isHamburgerOpen, setIsHamburgerOpen] = useState<boolean>(false);

  const onDropDownToggled = (id: string): void => {
    setDropDownOpenTitle(id);
  };

  const onHamburgerToggled = (): void => {
    setIsHamburgerOpen(!isHamburgerOpen);
  };

  const onTabSelected = (tab: TabKeys): void => {
    setIsHamburgerOpen(false);
    if (dropDownOpenTitle !== "") {
      setDropDownOpenTitle("");
    } else {
      setIsHamburgerOpen(false);
    }
    setSelectedTab(tab);
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      const size = Number(styles["mobile"]!.replace("px", ""));
      if (window.innerWidth <= size) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    });
    resizeObserver.observe(document.querySelector("body") as Element);
  }, [setIsMobile]);

  return (
    <MenuContext.Provider
      value={{
        isMobile,
        setIsMobile,
        selectedTab,
        onTabSelected,
        dropDownOpenTitle,
        onDropDownToggled,
        isHamburgerOpen,
        onHamburgerToggled,
      }}>
      {props.children}
    </MenuContext.Provider>
  );
};
