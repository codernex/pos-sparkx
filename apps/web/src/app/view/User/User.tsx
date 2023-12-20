import React, { useEffect, useState } from "react";
import { Button as AntButton, Modal, Table } from "antd";
import { useAppDispatch, useTypedSelector } from "../../../redux/store";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Form, Formik } from "formik";
import { Button, CommonInput, Loader, SelectInput } from "../../components";
import { UserRole } from "../../../types";
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "../../../redux/actions/user";
import ConfirmationModal from "../../components/ConfirmationModal";
import * as bcrypt from "bcryptjs";

interface UserProps {}

const User: React.FC<UserProps> = () => {
  const { user, isLoading } = useTypedSelector((state) => state.user);
  const { showroom } = useTypedSelector((state) => state.showroom);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const [showModal, setShowModal] = useState(false);

  const [userToEdit, setUserToEdit] = useState<IUser | null>(null);

  const [confirmationModal, setConfirmationModal] = useState(false);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [userDelete, setUserDelete] = useState<number | null>(null);
  if (isLoading) return <Loader />;

  console.log(userToEdit);

  return (
    <div className={"mt-10"}>
      <Modal
        footer={false}
        open={showModal}
        onCancel={() => {
          setShowModal(false);
          setUserToEdit(null);
        }}
      >
        <Formik
          initialValues={
            userToEdit
              ? {
                  name: userToEdit.name,
                  email: userToEdit.email,
                  username: userToEdit.username,
                  role: userToEdit.role,
                  assignedShowroom: userToEdit.assignedShowroom,
                  password: "",
                }
              : {
                  name: "",
                  email: "",
                  username: "",
                  role: "",
                  assignedShowroom: "",
                  password: "",
                }
          }
          enableReinitialize={true}
          onSubmit={async (values) => {
            if (userToEdit) {
              await dispatch(updateUser(userToEdit.id, values));
            } else {
              await dispatch(createUser(values));
            }
            setShowModal(false);
          }}
        >
          {({ handleSubmit }) => (
            <Form
              method={"POST"}
              onSubmit={(e) => {
                e.preventDefault();
                setConfirmationModal(true);
              }}
              className={"flex flex-col space-y-3"}
            >
              <Modal
                open={confirmationModal}
                footer={false}
                onCancel={() => setConfirmationModal(false)}
              >
                <h1 className="confirm__modal--heading">
                  Are you sure! you want to Continue?
                </h1>
                <div className={"flex gap-x-5"}>
                  <button
                    className={"confirm__modal--btn cancel"}
                    type={"button"}
                    onClick={() => setConfirmationModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type={"button"}
                    className={"confirm__modal--btn continue"}
                    onClick={() => {
                      handleSubmit();
                      setConfirmationModal(false);
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </Modal>
              <CommonInput label={"Name"} name={"name"} placeholder={"Name"} />
              <CommonInput
                label={"Email"}
                name={"email"}
                placeholder={"Email"}
              />
              <CommonInput
                label={"Username"}
                name={"username"}
                placeholder={"Username"}
              />
              <CommonInput
                label={"Password"}
                name={"password"}
                placeholder={"Password"}
              />
              {userToEdit && userToEdit.role === UserRole[0] ? null : (
                <SelectInput label={"Role"} name={"role"}>
                  {UserRole.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </SelectInput>
              )}

              {userToEdit && userToEdit.role === UserRole[0] ? null : (
                <SelectInput
                  label={"Assign Showroom"}
                  name={"assignedShowroom"}
                >
                  <option value={"All"}>All</option>
                  {showroom.map((showroom) => (
                    <option key={showroom.id} value={showroom.showroomCode}>
                      {showroom.showroomName}
                    </option>
                  ))}
                </SelectInput>
              )}
              <Button type={"submit"}>{userToEdit ? "Update" : "Save"}</Button>
            </Form>
          )}
        </Formik>
      </Modal>
      <div className={"flex justify-between items-center mb-10"}>
        <h1 className={"text-2xl font-semibold dark:text-white"}>
          Manage Users
        </h1>
        <Button onClick={() => setShowModal(true)}>Add User</Button>
      </div>
      <Table
        dataSource={user}
        loading={isLoading}
        rowKey={(obj: IUser, index) => obj.username + index}
        rowClassName={
          "dark:bg-slate-700 dark:text-white dark:hover:text-primaryColor-900"
        }
      >
        <Table.Column title={"#"} render={(text, record, index) => index + 1} />
        <Table.Column title={"Name"} dataIndex={"name"} />
        <Table.Column title={"Role"} dataIndex={"role"} />
        <Table.Column
          title={"Showroom Assigned"}
          dataIndex={`assignedShowroom`}
          render={(_, record: IUser) => {
            return record.assignedShowroom;
          }}
        />
        <Table.Column
          title={"Actions"}
          render={(_, record: IUser) => {
            return (
              <div>
                <ConfirmationModal
                  open={deleteConfirmationModal}
                  setOpen={setDeleteConfirmationModal}
                  execute={async () => {
                    userDelete && (await dispatch(deleteUser(userDelete)));
                  }}
                />
                <AntButton
                  onClick={() => {
                    setUserToEdit(record);
                    setShowModal(true);
                  }}
                >
                  <AiOutlineEdit />
                </AntButton>
                <AntButton
                  onClick={async () => {
                    setDeleteConfirmationModal(true);
                    setUserDelete(record.id);
                  }}
                >
                  <AiOutlineDelete />
                </AntButton>
              </div>
            );
          }}
        />
      </Table>
    </div>
  );
};

export default User;
