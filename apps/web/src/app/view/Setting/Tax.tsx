import React, { useState } from 'react';
import { Modal, Table, Tooltip } from 'antd';
import { useAppDispatch, useTypedSelector } from '../../../redux/store';
import { AiFillSetting, AiOutlineDelete } from 'react-icons/ai';
import { updateBusiness } from '../../../redux/actions/business';
import { toast } from 'react-toastify';
import { Form, Formik } from 'formik';
import { createTax, deleteTax, fetchTax } from '../../../redux/actions/tax';
import { Button, CommonInput } from '../../components';
import success = toast.success;

interface TaxProps {}

const Tax: React.FC<TaxProps> = () => {
  const dispatch = useAppDispatch();
  const { taxes, isLoading } = useTypedSelector(state => state.tax);
  const { business } = useTypedSelector(state => state.business);
  const [showModal, setShowModal] = useState(false);
  return (
    <div className={'mt-10'}>
      <div className={'flex justify-between'}>
        <h1 className={'text-2xl font-semibold dark:text-white'}>Taxes</h1>
        <button
          className={'w-[140px] py-1 border-slate-400 border dark:text-white'}
          onClick={() => setShowModal(true)}
        >
          Add Tax
        </button>
      </div>
      <Modal
        open={showModal}
        footer={false}
        onCancel={() => setShowModal(false)}
      >
        <Formik
          initialValues={{ tax: 0, taxName: '' }}
          onSubmit={async (values, { resetForm }) => {
            await dispatch(createTax(values));
            resetForm();
            setShowModal(false);
          }}
        >
          <Form>
            <CommonInput
              label={'Tax %'}
              name={'tax'}
              placeholder={'Tax'}
              type={'number'}
            />
            <CommonInput
              label={'Tax Name'}
              name={'taxName'}
              placeholder={'Tax Name'}
            />
            <Button type={'submit'} loading={isLoading}>
              Add Tax
            </Button>
          </Form>
        </Formik>
      </Modal>
      <Table
        className={'mt-6'}
        dataSource={taxes}
        rowKey={obj => obj.id}
        loading={isLoading}
        pagination={false}
        rowClassName={
          'dark:bg-slate-700 dark:text-white dark:hover:text-primaryColor-900'
        }
      >
        <Table.Column title='Sl' render={(text, record, index) => index + 1} />
        <Table.Column title='Tax (%)' dataIndex={'tax'} />
        <Table.Column title='Name' dataIndex={'taxName'} />
        <Table.Column
          title={'Actions'}
          render={(_, record: ITax) => {
            return (
              <div className={'text-xl flex gap-x-2'}>
                <Tooltip title={'Set As Default'}>
                  <AiFillSetting
                    cursor={'pointer'}
                    onClick={async () => {
                      if (business)
                        dispatch(
                          updateBusiness({ defaultTax: record.tax })
                        ).then(() => success('Tax set as default'));
                    }}
                  />
                </Tooltip>
                <AiOutlineDelete
                  cursor={'pointer'}
                  onClick={async () => {
                    await dispatch(deleteTax(record.id));
                  }}
                />
              </div>
            );
          }}
        />
      </Table>
    </div>
  );
};

export default Tax;
