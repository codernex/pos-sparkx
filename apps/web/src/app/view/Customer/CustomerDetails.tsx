import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTypedSelector } from "../../../redux/store";
import { Table } from "antd";
import { Button } from "../../components";
import { toast } from "react-toastify";
import TextArea from "antd/lib/input/TextArea";
import { sendSmsSingle } from "../../utils/helper";

interface CustomerDetailsProps {}

const CustomerDetails: React.FC<CustomerDetailsProps> = () => {

    const {id} = useParams()
    const {customers} = useTypedSelector(state => state.customer)

    const customer = customers.find(customer => customer.id === Number(id))
    const currentDate = new Date()

    const lastMonthDate = new Date().setDate(currentDate.getDate() - 30)

    const products = customer?.purchasedProducts?.filter(product => new Date(product.updatedAt).toISOString() >= new Date(lastMonthDate).toISOString())
    const [message, setMessage] = useState('')

    return (
        <div className='mt-4 bg-white dark:bg-slate-700 dark:text-white rounded shadow-xl p-4'>

            <div>
                <table className={'customer__table '}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Lifetime Paid(tk)</th>
                    </tr>

                    </thead>
                    <tbody>
                    <tr>
                        <td>{customer?.id}</td>
                        <td>{customer?.customerName}</td>
                        <td>{customer?.customerPhone}</td>
                        <td>{customer?.customerEmail}</td>
                        <td>{customer?.paid}</td>
                    </tr>
                    </tbody>
                </table>

            </div>
            <div className={'mt-10'}>
                <h1 className={'text-xl font-semibold'}>Personal SMS</h1>
                <div className={'flex justify-center'}>
                    <div className={'min-w-[800px] bg-white mt-4 p-4 rounded space-y-2 flex flex-col items-center'}>
                        <TextArea className={'w-full'} value={message} onChange={e => setMessage(e.target.value)}
                                  placeholder={'Enter Your Message'}/>

                        <Button onClick={async () => {
                            if (customer && message) {
                               await sendSmsSingle(message,customer.customerPhone)
                            } else {
                                toast.error('Please Check if you enter message & selected customer')
                            }
                        }
                        }>Send SMS</Button>
                    </div>
                </div>
            </div>
            <div>
                <h1 className={'mb-2'}>Last 30 Day Purchase Invoice</h1>
                <Table rowKey={(obj:Product) => obj.id} dataSource={products} rowClassName={'dark:bg-slate-700 dark:text-white dark:hover:text-primaryColor-900'}>
                    <Table.Column title={'Product'} render={(_,record:Product)=>{
                    return (
                        <div>
                            <p>{record.productGroup}</p>
                            <p>{record.itemCode}</p>
                        </div>
                    )
                    }
                    }/>
                    <Table.Column title={'Price'} dataIndex={'sellPriceAfterDiscount'}/>
                    <Table.Column title={'Discount (%)'} dataIndex={'discount'}/>
                    <Table.Column title={'Shopping Time'} render={(_, record: Product) => {
                        return new Date(record.updatedAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: 'numeric',
                            year: 'numeric',
                            month: 'short'
                        })
                    }
                    }/>
                </Table>
            </div>
            <div>
                <h1 className={'mb-2'}>Returned Products</h1>
                <Table rowKey={(obj:Product) => obj.id} dataSource={customer?.returnedProducts}  rowClassName={'dark:bg-slate-700 dark:text-white dark:hover:text-primaryColor-900'}>
                    <Table.Column title={'Product'} render={(_,record:Product)=>{
                        return (
                            <div>
                                <p>{record.productGroup}</p>
                                <p>{record.itemCode}</p>
                            </div>
                        )
                    }
                    }/>
                    <Table.Column title={'Price'} dataIndex={'sellPriceAfterDiscount'}/>
                    <Table.Column title={'Discount (%)'} dataIndex={'discount'}/>
                    <Table.Column title={'Returned Time'} render={(_, record: Product) => {
                        return new Date(record.updatedAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: 'numeric',
                            year: 'numeric',
                            month: 'short'
                        })
                    }
                    }/>
                </Table>
            </div>
        </div>
    )
}

export default CustomerDetails