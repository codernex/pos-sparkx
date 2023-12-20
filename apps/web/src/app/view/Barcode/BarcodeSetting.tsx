import { Modal, Table, Tooltip } from "antd";
import PrintAbleLayout from "../../components/PrintAbleLayout";
import { useAppDispatch, useTypedSelector } from "../../../redux/store";
import { AiFillDelete, AiFillSetting, AiOutlineEdit } from "react-icons/ai";
import { useState } from "react";
import { Field, Form, Formik } from "formik";
import {
  createBarcodeSetting,
  deleteBarcodeSetting,
  setDefaultBarcode,
  updateBarcodeSetting,
} from "../../../redux/actions/barcode";
import ConfirmationModal from "../../components/ConfirmationModal";
import { Button, CommonInput } from "../../components";
import { useSettingContext } from "../../context/SettingProver";

const BarcodeSetting = () => {
  const dispatch = useAppDispatch();
  const { barcode, isLoading } = useTypedSelector((state) => state.barcode);
  const [openAddModal, setAddModal] = useState(false);
  const [addConfirmationModal, setAddConfirmationModal] = useState(false);
  const [itemToDefault, setItemToDefault] = useState<number | null>(null);
  const [defaultConfirmationModal, setDefaultConfirmationModal] =
    useState(false);
  const { defaultBarcodeSettings } = useSettingContext();
  const [editAble, setEditAble] = useState<BarcodeSetting | null>(null);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  return (
    <PrintAbleLayout
      title={"Barcode Settings"}
      showPrint={false}
      showExcel={false}
      showPDF={false}
      btnText={"Add New"}
      handleClick={() => setAddModal(true)}
    >
      {/*Add Barcode Modal*/}
      <Modal
        onCancel={() => {
          setAddModal(false);
          setEditAble(null);
        }}
        open={openAddModal}
        footer={false}
      >
        <Formik
          initialValues={
            editAble
              ? {
                  name: editAble.name,
                  description: editAble.description,
                  paperHeight: editAble.paperHeight,
                  paperWidth: editAble.paperWidth,
                  stickerHeight: editAble.stickerHeight,
                  stickerWidth: editAble.stickerWidth,
                  stickerInRow: editAble.stickerInRow,
                  rowGap: editAble.rowGap,
                  columnGap: editAble.columnGap,
                }
              : {
                  name: "",
                  description: "",
                  paperWidth: 0,
                  paperHeight: 0,
                  stickerWidth: 0,
                  stickerHeight: 0,
                  rowGap: 0,
                  columnGap: 0,
                  stickerInRow: 1,
                }
          }
          enableReinitialize={true}
          onSubmit={async (values, { resetForm }) => {
            if (editAble) {
              await dispatch(updateBarcodeSetting(editAble.id, values));

              setEditAble(null);
            } else {
              await dispatch(createBarcodeSetting(values));
            }
            resetForm();
            setAddModal(false);
          }}
        >
          {({ handleSubmit }) => (
            <Form
              method={"POST"}
              onSubmit={(e) => {
                e.preventDefault();
                setAddConfirmationModal(true);
              }}
            >
              <ConfirmationModal
                open={addConfirmationModal}
                setOpen={setAddConfirmationModal}
                execute={async () => {
                  await handleSubmit();
                }}
              />
              <CommonInput
                label={"Barcode Name"}
                name={"name"}
                placeholder={"Barcode Settings Name"}
              />
              <div className={"flex flex-col"}>
                <label htmlFor={"description"}>Description</label>
                <Field
                  className={"border border-slate-300"}
                  as={"textarea"}
                  name={"description"}
                  id={"description"}
                />
              </div>
              <CommonInput
                label={"Paper Width in inch"}
                name={"paperWidth"}
                placeholder={"Ex: 1"}
                type={"number"}
              />
              <CommonInput
                label={"Paper Height in inch"}
                name={"paperHeight"}
                placeholder={"Ex: 1"}
                type={"number"}
              />
              <CommonInput
                label={"Sticker Width in inch"}
                name={"stickerWidth"}
                placeholder={"Ex: 1"}
                type={"number"}
              />
              <CommonInput
                label={"Sticker Height in inch"}
                name={"stickerHeight"}
                placeholder={"Ex: 1"}
                type={"number"}
              />
              <CommonInput
                label={"Row Gap"}
                name={"rowGap"}
                placeholder={"Ex: 0.1"}
                type={"number"}
              />
              <CommonInput
                label={"Column Gap"}
                name={"columnGap"}
                placeholder={"Ex: 0.1"}
                type={"number"}
              />
              <CommonInput
                label={"Sticker In Row"}
                name={"stickerInRow"}
                placeholder={"Ex: 1"}
                type={"number"}
              />
              <Button loading={isLoading}>
                {editAble?.id ? "Update" : "Add"} Settings
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>
      <div className={"my-4"}>
        <h2>
          <span className={"text-xl font-semibold dark:text-white"}>
            Current Default Settings:
          </span>{" "}
          {defaultBarcodeSettings?.name}({defaultBarcodeSettings?.description})
        </h2>
      </div>
      <Table
        dataSource={barcode}
        rowKey={(obj) => obj.id}
        rowClassName={
          "dark:bg-slate-700 dark:text-white dark:hover:text-primaryColor-900"
        }
      >
        <Table.Column title="Barcode" dataIndex="name" key="name" />
        <Table.Column
          title="Description"
          dataIndex="description"
          key="description"
        />
        <Table.Column title={"PW. in"} dataIndex={"paperWidth"} />
        <Table.Column title={"PH. in"} dataIndex={"paperHeight"} />
        <Table.Column title={"SW. in"} dataIndex={"stickerWidth"} />
        <Table.Column title={"SH. in"} dataIndex={"stickerHeight"} />
        <Table.Column title={"RG. in"} dataIndex={"rowGap"} />
        <Table.Column title={"CG. in"} dataIndex={"columnGap"} />
        <Table.Column title={"SR. in"} dataIndex={"stickerInRow"} />
        <Table.Column
          title="Actions"
          render={(_, record: BarcodeSetting) => {
            return (
              <div className={"flex text-xl space-x-2"}>
                <ConfirmationModal
                  open={defaultConfirmationModal}
                  setOpen={setDefaultConfirmationModal}
                  execute={async () => {
                    itemToDefault &&
                      (await dispatch(setDefaultBarcode(itemToDefault)));
                  }}
                />
                <ConfirmationModal
                  open={deleteConfirmationModal}
                  setOpen={setDeleteConfirmationModal}
                  execute={async () => {
                    itemToDelete &&
                      (await dispatch(deleteBarcodeSetting(itemToDelete)));
                  }}
                />
                <Tooltip title={"Set As Default"}>
                  <AiFillSetting
                    cursor={"pointer"}
                    onClick={() => {
                      setItemToDefault(record.id);
                      setDefaultConfirmationModal(true);
                    }}
                  />
                </Tooltip>
                <AiOutlineEdit
                  cursor={"pointer"}
                  onClick={() => {
                    setEditAble(record);
                    setAddModal(true);
                  }}
                />
                <AiFillDelete
                  cursor={"pointer"}
                  onClick={() => {
                    setItemToDelete(record.id);
                    setDeleteConfirmationModal(true);
                  }}
                />
              </div>
            );
          }}
        />
      </Table>
    </PrintAbleLayout>
  );
};

export default BarcodeSetting;
