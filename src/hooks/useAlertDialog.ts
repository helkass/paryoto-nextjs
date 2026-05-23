// hooks/useAlertDialog.ts
"use client";

import { useState, useCallback } from "react";
import {
  AlertDialogConfig,
  AlertDialogState,
} from "@/types/alert-dialog.types";

const initialState: AlertDialogState = {
  isOpen: false,
  config: {
    title: "",
    description: "",
    action: { label: "", onClick: async () => {} },
  },
};

export function useAlertDialog() {
  const [state, setState] = useState<AlertDialogState>(initialState);

  const alert = useCallback((config: AlertDialogConfig) => {
    setState({ isOpen: true, config });
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const alertDialog = {
    open: state.isOpen,
    onOpenChange: close,
    title: state.config.title,
    description: state.config.description,
    icon: state.config.icon,
    action: {
      ...state.config.action,
      onClick: async () => {
        await state.config.action.onClick();
        close();
      },
    },
    cancel: state.config.cancel && {
      ...state.config.cancel,
      onClick: async () => {
        if (state.config.cancel?.onClick) {
          await state.config.cancel.onClick();
        }
        close();
      },
    },
  };

  return { alert, close, alertDialog };
}
