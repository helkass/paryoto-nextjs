// hooks/useSelectTwo.ts
import { useState, useEffect, useCallback } from "react";
import type {
  SelectOption,
  UseSelectTwoReturn,
} from "@/components/form/selects/select";

interface UseSelectTwoOptions {
  initialValue?: (string | number)[];
  fetchMainOptions?: () => Promise<SelectOption[]>;
  fetchSubOptions?: (parentId: string | number) => Promise<SelectOption[]>;
  initialMainOptions?: SelectOption[];
  onChange?: (value: (string | number)[]) => void;
}

export const useSelectTwo = ({
  initialValue,
  fetchMainOptions,
  fetchSubOptions,
  initialMainOptions = [],
  onChange,
}: UseSelectTwoOptions): UseSelectTwoReturn => {
  const [mainOptions, setMainOptions] =
    useState<SelectOption[]>(initialMainOptions);
  const [subOptions, setSubOptions] = useState<SelectOption[]>([]);
  const [selectedMain, setSelectedMain] = useState<SelectOption | null>(null);
  const [selectedSub, setSelectedSub] = useState<SelectOption | null>(null);
  const [isLoadingMain, setIsLoadingMain] = useState(false);
  const [isLoadingSub, setIsLoadingSub] = useState(false);
  const [errorMain, setErrorMain] = useState<string | null>(null);
  const [errorSub, setErrorSub] = useState<string | null>(null);

  const fetchMain = useCallback(async () => {
    if (!fetchMainOptions) return;

    setIsLoadingMain(true);
    setErrorMain(null);

    try {
      const options = await fetchMainOptions();
      setMainOptions(options);

      if (initialValue && initialValue[0]) {
        const matchedMain = options.find(
          (opt) => opt.id === initialValue[0] || opt.value === initialValue[0]
        );
        if (matchedMain) {
          setSelectedMain(matchedMain);
          if (initialValue[1]) {
            await fetchSub(matchedMain.id);
          }
        }
      }
    } catch (error) {
      setErrorMain(
        error instanceof Error ? error.message : "Failed to load options"
      );
    } finally {
      setIsLoadingMain(false);
    }
  }, [fetchMainOptions, initialValue]);

  const fetchSub = useCallback(
    async (parentId: string | number) => {
      if (!fetchSubOptions) return;

      setIsLoadingSub(true);
      setErrorSub(null);

      try {
        const options = await fetchSubOptions(parentId);
        setSubOptions(options);

        if (initialValue && initialValue[1]) {
          const matchedSub = options.find(
            (opt) => opt.id === initialValue[1] || opt.value === initialValue[1]
          );
          if (matchedSub) {
            setSelectedSub(matchedSub);
          }
        }
      } catch (error) {
        setErrorSub(
          error instanceof Error ? error.message : "Failed to load sub options"
        );
        setSubOptions([]);
      } finally {
        setIsLoadingSub(false);
      }
    },
    [fetchSubOptions, initialValue]
  );

  const handleMainChange = useCallback(
    (option: SelectOption) => {
      setSelectedMain(option);
      setSelectedSub(null);

      if (fetchSubOptions) {
        fetchSub(option.id);
      }

      onChange?.([option.id, ""]);
    },
    [fetchSubOptions, onChange, fetchSub]
  );

  const handleSubChange = useCallback(
    (option: SelectOption) => {
      setSelectedSub(option);

      if (selectedMain) {
        onChange?.([selectedMain.id, option.id]);
      }
    },
    [selectedMain, onChange]
  );

  const clearSelection = useCallback(() => {
    setSelectedMain(null);
    setSelectedSub(null);
    setSubOptions([]);
    onChange?.([0, 0]);
  }, [onChange]);

  const resetSubOptions = useCallback(() => {
    setSubOptions([]);
    setSelectedSub(null);
  }, []);

  const setSelectedMainById = useCallback(
    (id: string | number) => {
      const option = mainOptions.find(
        (opt) => opt.id === id || opt.value === id
      );
      if (option) {
        handleMainChange(option);
      }
    },
    [mainOptions, handleMainChange]
  );

  const setSelectedSubById = useCallback(
    (id: string | number) => {
      const option = subOptions.find(
        (opt) => opt.id === id || opt.value === id
      );
      if (option) {
        handleSubChange(option);
      }
    },
    [subOptions, handleSubChange]
  );

  const refetchMain = useCallback(async () => {
    await fetchMain();
  }, [fetchMain]);

  const refetchSub = useCallback(
    async (parentId: string | number) => {
      await fetchSub(parentId);
    },
    [fetchSub]
  );

  useEffect(() => {
    if (fetchMainOptions && initialMainOptions.length === 0) {
      fetchMain();
    }
  }, [fetchMainOptions, fetchMain, initialMainOptions]);

  return {
    mainOptions,
    subOptions,
    selectedMain,
    selectedSub,
    isLoadingMain,
    isLoadingSub,
    errorMain,
    errorSub,
    handleMainChange,
    handleSubChange,
    clearSelection,
    resetSubOptions,
    setSelectedMainById,
    setSelectedSubById,
    refetchMain,
    refetchSub,
  };
};
