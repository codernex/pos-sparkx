import React, { useState } from 'react';
import { Input, Select, Table } from 'antd';
import { useTypedSelector } from '../../../redux/store';
import { Button } from '../../components';
import { sendSmsBulk } from '../../utils/helper';
import { toast } from 'react-toastify';
import { HiXCircle } from 'react-icons/hi2';

interface MarketingProps {}

const Marketing: React.FC<MarketingProps> = () => {
  const [message, setMessage] = useState('');
  const [customer, setCustomer] = useState<ICustomer[]>([]);
  const { TextArea } = Input;
  const { customers } = useTypedSelector(state => state.customer);
  return (
    <div className={'mt-10'}>
      <div className={'flex justify-center'}>
        <div className={'min-w-[800px] bg-white mt-4 p-4 rounded space-y-2'}>
          <h1 className={'text-xl font-semibold'}>Promotional SMS</h1>
          <TextArea
            className={'w-full'}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder={'Enter Your Message'}
          />

          <>
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder='Please select Customer Or Search Using Phone Number'
              options={customers.map(customer => ({
                value: customer.customerPhone,
                label: customer.customerName
              }))}
              showSearch
              onChange={(value: string) => {
                const isExist = customer.findIndex(c => {
                  return c.customerPhone === value;
                });

                if (isExist === -1) {
                  const customer = customers.find(
                    c => c.customerPhone === value
                  );

                  if (!customer) {
                    return;
                  }
                  setCustomer(prev => [...prev, customer]);
                } else {
                  toast.error('Customer already selected');
                }
              }}
            />

            <Table dataSource={customer}>
              <Table.Column
                title='SL'
                dataIndex={'id'}
                render={(_, _rec: ICustomer, i: number) => i + 1}
              />
              <Table.Column title='Name' dataIndex={'customerName'} />
              <Table.Column title='Phone' dataIndex={'customerPhone'} />
              <Table.Column
                title='Actions'
                dataIndex={'id'}
                render={(_, record: ICustomer) => {
                  return (
                    <HiXCircle
                      fontSize={20}
                      cursor={'pointer'}
                      onClick={() => {
                        const filterCustomer = customer.filter(
                          c => c.customerPhone !== record.customerPhone
                        );

                        setCustomer(filterCustomer);
                      }}
                    />
                  );
                }}
              />
            </Table>
          </>

          <div className='flex gap-x-4'>
            <button
              className={
                'dark:bg-white bg-slate-900 dark:text-primaryColor-900 text-white block w-[140px] py-1 rounded-md dark:border border-slate-400'
              }
              onClick={async () => {
                setCustomer(customers);
              }}
            >
              Select All
            </button>

            <button
              className={
                'dark:bg-red-500 bg-red-500 dark:text-primaryColor-900 text-white block w-[140px] py-1 rounded-md dark:border border-slate-400'
              }
              onClick={async () => {
                setCustomer([]);
              }}
            >
              Remove All
            </button>

            <Button
              onClick={async () => {
                if (customer.length && message) {
                  await sendSmsBulk(
                    message,
                    customer.map(customer => customer.customerPhone)
                  );

                  setCustomer([]);
                  setMessage('');
                } else {
                  toast.error(
                    'Please Check if you enter message & selected customer'
                  );
                }
              }}
            >
              Send SMS
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketing;
