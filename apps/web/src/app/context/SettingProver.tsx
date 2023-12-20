import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { useAppDispatch, useTypedSelector } from "../../redux/store";
import { fetchBarcode, getDefaultBarcode } from "../../redux/actions/barcode";

const defaultContext = {
  isActive: false,
  setActive: () => {},
  setProfile: () => {},
  profile: false,
  pageSize: 50,
  setPageSize: () => {},
  page: 1,
  setPage: () => {},
  currentUser: null,
  submitForm: false,
  setSubmitForm: () => {},
  showConfirmModal: false,
  setShowConfirmModal: () => {},
  defaultBarcodeSettings: undefined,
  mode: "light",
  setMode: () => {},
} as ISettingContext;

const SettingContext = createContext<ISettingContext>(defaultContext);

export default function SettingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isActive, setActive] = useState(true);
  const [profile, setProfile] = useState(false);
  const [pageSize, setPageSize] = useState(50);
  const [page, setPage] = useState(1);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitForm, setSubmitForm] = useState(false);

  const [mode, setMode] = useState<ThemMode>("light");
  const { defaultBarcode, barcode } = useTypedSelector(
    (state) => state.barcode
  );
  const user = useAuthUser();
  const [defaultBarcodeSettings, setDefaultBarcodeSettings] = useState<
    BarcodeSetting | undefined
  >(undefined);
  const dispatch = useAppDispatch();

  useEffect(() => {
    Promise.all([dispatch(fetchBarcode()), dispatch(getDefaultBarcode())]);
  }, [dispatch]);
  useEffect(() => {
    const loggedInUser = user() as IUser;
    if (loggedInUser) {
      setCurrentUser(loggedInUser);
    }
  }, [user]);

  useEffect(() => {
    setDefaultBarcodeSettings(
      barcode.find((item) => item.id === defaultBarcode?.barcodeId)
    );
  }, [barcode, defaultBarcode]);

  return (
    <SettingContext.Provider
      value={{
        isActive,
        setActive,
        profile,
        setProfile,
        page,
        pageSize,
        setPageSize,
        setPage,
        currentUser,
        showConfirmModal,
        setShowConfirmModal,
        submitForm,
        setSubmitForm,
        defaultBarcodeSettings,
        mode,
        setMode,
      }}
    >
      {children}
    </SettingContext.Provider>
  );
}

export const useSettingContext = () => useContext(SettingContext);
