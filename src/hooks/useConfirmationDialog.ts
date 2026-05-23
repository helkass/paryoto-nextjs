// hooks/useConfirmationDialog.ts
"use client";

import * as React from "react";
import {
  ConfirmationDialogConfig,
  ConfirmationDialogState,
} from "@/types/confirmation-dialog.types";

export function useConfirmationDialog() {
  const [state, setState] = React.useState<ConfirmationDialogState>({
    isOpen: false,
    config: {
      title: "",
      description: "",
      onConfirm: () => {},
    },
  });

  const confirm = (config: ConfirmationDialogConfig) => {
    setState({
      isOpen: true,
      config,
    });
  };

  const close = () => {
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  const confirmDialog = {
    ...state.config,
    isOpen: state.isOpen,
    onClose: close,
    onConfirm: async () => {
      await state.config.onConfirm();
      close();
    },
    onCancel: async () => {
      if (state.config.onCancel) {
        await state.config.onCancel();
      }
      close();
    },
  };

  return {
    confirm,
    close,
    confirmDialog,
  };
}
