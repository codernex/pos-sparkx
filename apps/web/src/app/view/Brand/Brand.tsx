import React from "react";
import PrintAbleLayout from "../../components/PrintAbleLayout";
import { Modal, Table } from "antd";
import { useAppDispatch, useTypedSelector } from "../../../redux/store";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import ConfirmationModal from "../../components/ConfirmationModal";
import { Form, Formik } from "formik";
import { Button, CommonInput } from "../../components";
import {
  createBrand,
  deleteBrand,
  updateBrand,
} from "../../../redux/actions/brand";

interface BrandProps {
}

const Brand: React.FC<BrandProps> = () => {
    const dispatch = useAppDispatch()
    const {brands, isLoading} = useTypedSelector(state => state.brand)
    const [itemToEdit, setItemToEdit] = React.useState<IBrand | null>(null)

    const [confirmationModal, setConfirmationModal] = React.useState(false)
    const [itemToDelete, setItemToDelete] = React.useState<number | null>(null)
    const [openAddModal, setOpenAddModal] = React.useState(false)
    const [addConfirmationModal, setAddConfirmationModal] = React.useState(false)
    const [openEditModal, setOpenEditModal] = React.useState(false)
    return (
        <PrintAbleLayout title={"Brands"} btnText={'Add Brands'} handleClick={() => {
            setOpenAddModal(true)
        }}
                         showPrint={false} showExcel={false} showPDF={false}
        >
            <ConfirmationModal open={confirmationModal} setOpen={setConfirmationModal} execute={async () => {
                itemToDelete && await dispatch(deleteBrand(itemToDelete))
            }}/>
            {/*Brand Add Modal*/}
            <Modal onCancel={() => setOpenAddModal(false)} footer={false} open={openAddModal}>
                <Formik initialValues={{
                    brandName: '',
                }} onSubmit={async (values, formikHelpers) => {
                    await dispatch(createBrand(values))
                    setOpenAddModal(false)
                }}>
                    {
                        ({handleSubmit, values}) => (

                            <Form method={'POST'} onSubmit={(e) => {
                                e.preventDefault()
                                setAddConfirmationModal(true)
                            }
                            }>
                                <ConfirmationModal open={addConfirmationModal} setOpen={setAddConfirmationModal}
                                                   execute={async () => {
                                                       await handleSubmit()
                                                       setAddConfirmationModal(false)
                                                   }}/>

                                <CommonInput label={"Brand Name"} name={'brandName'}/>

                                <Button type={'submit'} loading={isLoading}>Add Brand</Button>
                            </Form>
                        )
                    }
                </Formik>
            </Modal>

            {/*Brand Edit Modal*/}
            <Modal onCancel={() => setOpenEditModal(false)} footer={false} open={openEditModal}>
                <Formik initialValues={{
                    brandName: itemToEdit?.brandName,
                }} enableReinitialize={true} onSubmit={async (values, formikHelpers) => {
                    itemToEdit && await dispatch(updateBrand(itemToEdit.id, values))
                    setOpenEditModal(false)
                }}>
                    {
                        ({handleSubmit, values}) => (

                            <Form method={'POST'} onSubmit={(e) => {
                                e.preventDefault()
                                setAddConfirmationModal(true)
                            }
                            }>
                                <ConfirmationModal open={addConfirmationModal} setOpen={setAddConfirmationModal}
                                                   execute={async () => {
                                                       await handleSubmit()
                                                       setAddConfirmationModal(false)
                                                   }}/>

                                <CommonInput label={"Brand Name"} name={'brandName'}/>

                                <Button type={'submit'} loading={isLoading}>Update Brand</Button>
                            </Form>
                        )
                    }
                </Formik>
            </Modal>

            {/*All Brands Table*/}
            <Table dataSource={brands} rowKey={obj => obj.id} rowClassName={'dark:bg-slate-700 dark:text-white dark:hover:text-primaryColor-900'}>
                <Table.Column title={'Sl'} render={(text, record, index) => index + 1}/>
                <Table.Column title={'Brand'} dataIndex={'brandName'}/>

                <Table.Column title={'Date'}
                              render={(_, expense: IExpense) => new Date(expense.createdAt).toDateString()}/>
                <Table.Column title={'Action'} render={(_, brand: IBrand) => {
                    return (
                        <div className={'flex text-xl'}>

                            <AiOutlineEdit onClick={() => {
                                setItemToEdit(brand)
                                setOpenEditModal(true)
                            }}/>
                            <AiOutlineDelete onClick={() => {
                                setItemToDelete(brand.id)
                                setConfirmationModal(true)
                            }}/>
                        </div>
                    )
                }}/>

            </Table>
        </PrintAbleLayout>
    )
}

export default Brand