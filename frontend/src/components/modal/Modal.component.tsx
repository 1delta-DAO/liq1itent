/* eslint-disable max-len */
import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";

import styles from "./Modal.module.scss";

import close from "../../../public/assets/images/svg/close.svg";

interface ModalProps {
  title: string;
  onClose: (outsideClick: boolean) => void;
  options?: ModalOptions;
  children?: ReactNode | undefined;
}

export interface GenericModalProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export const ModalComponent: React.FC<ModalProps> = ({
  title,
  onClose,
  options,
  children,
}: ModalProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const [w, setWidth] = useState(0);
  const [h, setHeight] = useState(0);

  // This function calculates width and height of the list
  const getContainerSize = (): void => {
    if (contentRef.current) {
      if (contentRef.current.clientWidth) {
        const newWidth = contentRef.current.clientWidth || 0;
        setWidth(newWidth);
      }
      if (contentRef.current.clientHeight) {
        const newHeight = contentRef.current.clientHeight || 0;
        setHeight(newHeight);
      }
    }
  };

  // Get 'width' and 'height' after the initial render and every time the list changes
  useEffect(() => {
    getContainerSize();
  }, [contentRef]);

  // Update 'width' and 'height' when the window resizes
  useEffect(() => {
    window.addEventListener("resize", getContainerSize);
  }, []);

  const onDocumentClick = useCallback(
    (event: Event) => {
      if (
        contentRef.current &&
        event.target &&
        event.target instanceof Element &&
        !contentRef.current.contains(event.target) &&
        !options?.persistent
      ) {
        onClose(true);
      }
    },
    [contentRef, onClose, options]
  );

  useEffect(() => {
    setTimeout(() => {
      document.addEventListener("click", onDocumentClick);
    });

    return (): void => {
      document.removeEventListener("click", onDocumentClick);
    };
  }, [onDocumentClick, onClose]);

  useEffect((): (() => void) => {
    document.addEventListener("keydown", onKeyDown);
    return (): void => document.removeEventListener("keydown", onKeyDown);
  });

  const onKeyDown = (event: KeyboardEvent): void => {
    if (!options?.persistent) {
      event.key === "Escape" && onClose(false);
    }
  };

  const inset = 4;

  const mainFrameBackground = `M${inset} ${inset}
    H${w - inset}
    V${h - inset}
    H${inset}
    V${inset}
    Z`;

  const mainFrameCorner =
    "M57.8828 5.2634H18.3826C18.3344 5.45884 18.2713 5.64934 18.1946 5.83365C17.4376 7.76212 15.597 9.15126 13.4286 9.2564C13.3395 9.25888 13.2541 9.26259 13.1663 9.26259C13.0624 9.26259 12.9597 9.25888 12.8571 9.25269V12.8573H9.25501C9.25996 12.9612 9.26244 13.0626 9.26244 13.1665C9.26244 13.2556 9.25996 13.3409 9.25749 13.43C9.15111 15.596 7.76323 17.4354 5.83479 18.1961C5.64924 18.2716 5.45999 18.3347 5.26331 18.3829V57.8838L4.14261 59.002V16.2701C5.64306 16.1341 6.84045 14.9305 6.96538 13.43C6.97404 13.3409 6.97651 13.2556 6.97651 13.1665C6.97651 13.0589 6.97157 12.9587 6.96043 12.8573H5.5206C5.39195 12.167 4.83903 11.6191 4.14261 11.5015V10.5701H10.5712V4.14145H11.5026C11.6201 4.83911 12.1656 5.39328 12.8571 5.51945V6.96055C12.9573 6.97044 13.0599 6.97663 13.1651 6.97663C13.2541 6.97663 13.3432 6.97292 13.4286 6.96673C14.9315 6.84056 16.1338 5.64315 16.2711 4.14145H59.0023L57.8828 5.2634ZM4.14261 14.8328C4.85511 14.7128 5.41298 14.1462 5.52431 13.43H6.39143C6.26897 14.6175 5.32887 15.5675 4.14261 15.6974V14.8328ZM3.57113 6.28639V7.14362H0.57148V0.572727H7.1435V3.57243H6.28628V1.42872H1.4287V6.28639H3.57113ZM4.14261 7.14362V6.28639H6.28628V4.14145H7.1435V7.14362H4.14261ZM7.71375 7.71388V4.14145H9.99967V9.99984H4.14261V7.71388H7.71375ZM13.4286 5.52564C14.1448 5.41184 14.7113 4.85395 14.8313 4.14145H15.6972C15.566 5.32896 14.6173 6.2666 13.4286 6.3903V5.52564ZM60.3802 3.57243H51.4765V2.16226H9.12018V0H8.83444V2.44801H51.1908V3.57243H7.71375V0H0V7.71388H3.57113V51.1929H2.4492V8.83459H0V9.12033H2.16346V51.4774H3.57113V75H4.14261V59.8098L5.83479 58.1188V18.8072C8.08237 18.018 9.72011 15.9164 9.82897 13.43H13.4286V9.82913C15.9173 9.71904 18.0177 8.08126 18.8057 5.83365H58.1166L59.8088 4.14145H75V3.57243H60.3802Z";

  return ReactDOM.createPortal(
    <div className={styles["modal"]}>
      <div className={styles["modal-background"]}>
        <div className={styles["glow"]}></div>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className={styles["modal-background-layer"]}>
          <path d={mainFrameBackground} fill="#0c522abb" />
          <path d={mainFrameCorner} fill="#fff" />
          <path
            d={mainFrameCorner}
            transform={`translate(0 ${h}) rotate(-90)`}
            fill="#fff"
          />
          <path
            d={mainFrameCorner}
            transform={`translate(${w} 0) rotate(90)`}
            fill="#fff"
          />
          <path
            d={mainFrameCorner}
            transform={`translate(${w} ${h}) rotate(180)`}
            fill="#fff"
          />
        </svg>
      </div>
      <div className={styles["modal-content"]} ref={contentRef}>
        <div className={styles["modal-header"]}>
          {title}
          {!options?.persistent && (
            <button
              className={styles["modal-close"]}
              onClick={(): void => onClose(false)}>
              <img src={close} alt="Close" />
            </button>
          )}
        </div>
        <div className={styles["modal-body"]}>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export type ModalOptions = Partial<{
  persistent: boolean;
  onClose: () => void;
  onSuccess: () => void;
  disableOutsideClick: boolean;
}>;

interface ModalContextValue {
  registerModal: (
    uuid: string,
    node: React.ReactNode,
    title: string,
    options?: ModalOptions
  ) => void;
  showModal: (
    uuid: string,
    node: React.ReactNode,
    title: string,
    options?: ModalOptions
  ) => void;
  closeModal: (uuid: string) => void;
  isOpen: (uuid: string) => boolean;
}

interface ModalConfig {
  node: React.ReactNode;
  title: string;
  options?: Partial<ModalOptions>;
  isOpen?: boolean;
}

const ModalContext = React.createContext<ModalContextValue>({
  registerModal: () => {
    void 0;
  },
  closeModal: () => {
    void 0;
  },
  isOpen: () => false,
  showModal: () => {
    void 0;
  },
});

type ModalProviderProps = {
  children?: React.ReactNode | undefined;
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = (
  props: ModalProviderProps
) => {
  const [modalList, setModalList] = useState<{ [key: string]: ModalConfig }>(
    {}
  );

  const registerModal = (
    uuid: string,
    node: ReactNode,
    title: string,
    options?: ModalOptions
  ): void => {
    if (!modalList[uuid]) {
      setModalList((modals) => ({
        ...modals,
        [uuid]: { isOpen: false, node, options: options || {}, title },
      }));
    }
  };

  const showModal = (
    uuid: string,
    node: ReactNode,
    title: string,
    options?: ModalOptions
  ): void => {
    if (!modalList[uuid]) {
      setModalList((modals) => ({
        ...modals,
        [uuid]: { isOpen: false, node, options: options || {}, title },
      }));
    }

    if (!modalList[uuid]?.isOpen) {
      setModalList((modals) => ({
        ...modals,
        [uuid]: { ...modals[uuid]!, isOpen: true },
      }));
    }
  };

  const closeModal = (uuid: string, callOnClose = true): void => {
    const modal = modalList[uuid];
    if (modal) {
      setModalList((modals) => ({
        ...modals,
        [uuid]: { ...modals[uuid]!, isOpen: false },
      }));
      if (modal.options?.onClose && callOnClose) {
        modal.options.onClose();
      }
    }
  };

  const isOpen = (uuid: string): boolean => {
    return (modalList[uuid] !== undefined && modalList[uuid]?.isOpen) || false;
  };

  const onSuccess = (uuid: string): void => {
    const modal = modalList[uuid];
    closeModal(uuid, false);
    if (modal && modal.isOpen && modal.options?.onSuccess) {
      modal.options.onSuccess();
    }
  };

  return (
    <ModalContext.Provider
      value={{
        closeModal,
        isOpen,
        showModal,
        registerModal,
      }}>
      {props.children}
      {Object.keys(modalList)
        .filter((uuid) => modalList[uuid]?.isOpen)
        .map((uuid) => {
          const node = modalList[uuid]!.node;

          return (
            <ModalComponent
              key={`modal-${uuid}`}
              options={modalList[uuid]!.options}
              onClose={(outsideClick): void => {
                if (
                  modalList[uuid]?.options?.disableOutsideClick &&
                  outsideClick
                ) {
                  return;
                }
                closeModal(uuid);
              }}
              title={modalList[uuid]!.title}>
              {React.isValidElement(node) &&
                React.cloneElement(node as React.ReactElement<ModalOptions>, {
                  onClose: () => {
                    closeModal(uuid);
                  },
                  onSuccess: () => {
                    onSuccess(uuid);
                  },
                })}
            </ModalComponent>
          );
        })}
    </ModalContext.Provider>
  );
};

export interface ModalHook {
  showModal: () => void;
  closeModal: () => void;
  isOpen: boolean;
}

export const useModal = (
  title: string,
  node: ReactNode,
  options?: ModalOptions
): ModalHook => {
  const { registerModal, showModal, closeModal, isOpen } =
    useContext(ModalContext);
  const ref = useRef<ReactNode>(node);

  useEffect(() => {
    registerModal(title, node, title, options);
  }, [title, registerModal, node, options]);

  useEffect(() => {
    ref.current = node;
  }, [node]);

  const presentModal = useCallback(() => {
    showModal(title, ref.current, title, options);
  }, [title, ref, showModal, options]);

  const unpresentModal = useCallback(() => {
    closeModal(title);
  }, [closeModal, title]);

  const isModalOpen = useMemo(() => isOpen(title), [isOpen, title]);

  return {
    closeModal: unpresentModal,
    isOpen: isModalOpen,
    showModal: presentModal,
  };
};
