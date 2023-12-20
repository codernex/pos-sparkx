import { Modal, Table } from "antd";
import React, { useRef, useState } from "react";
import { useAppDispatch, useTypedSelector } from "../../../redux/store";
import {
  Button,
  CommonInput,
  Loader,
  Pagination,
  PrintAble,
} from "../../components";
import { useSettingContext } from "../../context/SettingProver";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import {
  deleteShowroom,
  updateShowroom,
} from "../../../redux/actions/showroom";
import { Form, Formik } from "formik";
import ConfirmationModal from "../../components/ConfirmationModal";
import { handleExcel, handlePrint } from "../../utils/helper";

const Showroom = () => {
  const cRef = useRef(null);

  const dispatch = useAppDispatch();
  const { showroom, isLoading } = useTypedSelector((state) => state.showroom);
  const { page, pageSize, setPage, setPageSize } = useSettingContext();
  const [editAble, setEditAble] = useState<IShowroom | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<number>(0);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <PrintAble
      title={"Showrooms"}
      handlePrint={() => {
        handlePrint(
          showroom,
          [
            { field: "showroomName", displayName: "Name" },
            { field: "showroomCode", displayName: "Code" },
            { field: "showroomMobile", displayName: "Mobile" },
            { field: "showroomAddress", displayName: "Address" },
          ],
          "Showroom"
        );
      }}
      handleExcel={() => handleExcel(showroom)}
      showPDF={false}
    >
      <ConfirmationModal
        open={confirmationModal}
        setOpen={setConfirmationModal}
        execute={async () => {
          await dispatch(deleteShowroom(itemToDelete));
        }}
      />
      <Table
        dataSource={showroom}
        id="showroomData"
        ref={cRef}
        rowKey={(obj) => obj.showroomCode}
        rowClassName={
          "dark:bg-slate-700 dark:text-white dark:hover:text-primaryColor-900"
        }
        pagination={{
          current: page,
          total: showroom.length,
          pageSize: pageSize,
          onChange: (page, size) => {
            setPage(page);
            setPageSize(size);
          },
          style: {
            display: "none",
          },
        }}
      >
        <Table.Column
          title="Showroom Code"
          dataIndex={"showroomCode"}
          key="showroomCode"
        />
        <Table.Column
          title="Showroom Name"
          dataIndex={"showroomName"}
          key="showroomName"
        />
        <Table.Column
          title="Showroom Mobile"
          dataIndex={"showroomMobile"}
          key="showroomMobile"
        />
        <Table.Column
          title="Showroom Adress"
          dataIndex={"showroomAddress"}
          key="showroomAddress"
        />

        <Table.Column
          title="Showroom Actions"
          dataIndex={"id"}
          render={(_: any, record: IShowroom) => {
            return (
              <div className={"flex gap-x-2 text-xl"}>
                <AiOutlineEdit
                  cursor={"pointer"}
                  onClick={() => {
                    setOpenModal(true);
                    setEditAble(record);
                  }}
                />
                <AiOutlineDelete
                  cursor={"pointer"}
                  onClick={() => {
                    setItemToDelete(record.id);
                    setConfirmationModal(true);
                  }}
                />
              </div>
            );
          }}
        />
      </Table>

      <Modal
        open={openModal}
        onCancel={() => {
          setEditAble(null);
          setOpenModal(false);
        }}
        footer={false}
      >
        {editAble && (
          <Formik
            initialValues={editAble}
            enableReinitialize={true}
            onSubmit={async (values) => {
              await dispatch(updateShowroom(values));
              setOpenModal(false);
              setEditAble(null);

              console.log(values);
            }}
          >
            {() => (
              <Form>
                <CommonInput label={"Showroom Code"} name={"showroomCode"} />
                <CommonInput label={"Showroom Name"} name={"showroomName"} />
                <CommonInput
                  label={"Showroom Mobile"}
                  name={"showroomMobile"}
                />
                <CommonInput
                  label={"Showroom Address"}
                  name={"showroomAddress"}
                />
                <Button type={"submit"} loading={isLoading}>
                  Update
                </Button>
              </Form>
            )}
          </Formik>
        )}
      </Modal>
      <Pagination
        currentPage={page}
        total={showroom.length}
        onChange={(page, size) => {
          setPage(page);
          setPageSize(size);
        }}
        pageSize={pageSize}
      />
    </PrintAble>
  );
};

export default Showroom;
