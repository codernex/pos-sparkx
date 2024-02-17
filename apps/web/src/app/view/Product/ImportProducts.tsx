import { Tooltip, Upload } from "antd";
import { DraggerProps } from "antd/es/upload";
import { AiFillInfoCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import { baseURL } from "../../../api";

const ImportProducts = () => {
    const {Dragger} = Upload;

    const uploaderProps: DraggerProps = {
        name: 'file',
        multiple: false,
        action: `${baseURL}/product/import`,
        onChange(info: any) {
            const {status, response} = info.file;
            if (status === 'done') {
                toast.success(`Data Importing On Background, Please Reload After Some Time`);
            } else if (status === 'error') {
                toast.error(`${info.file.name} ${response?.message}`);
            }
        },
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
        withCredentials: true,
        accept: '.xlsx'
        // iconRender: (file, _listType) => {
        //   return <FaFileExcel className='text-green-600' />;
        // }
    };
    return (
        <div className='w-full h-[50vh] justify-center rounded-md'>
            <Tooltip
                title={
                    <ul className='required__excel'>
                        Required Fields Marks With *
                        <li>itemCode *</li>
                        <li>productCode *</li>
                        <li>productGroup *</li>
                        <li>supplierName *</li>
                        <li>whName *</li>
                        <li>unitCost *</li>
                        <li>transportationCost</li>
                        <li>sellPrice *</li>
                        <li>showroomName *</li>
                        <li>invoiceDate (DD/MM/YYYY)</li>
                        <li>invoiceNumber</li>
                        <li>deliveryDate</li>
                        <li>challanNumber</li>
                        <li>size</li>
                        <li>purchaseName</li>
                        <li>lotNumber *</li>
                    </ul>
                }
            >
                <h1 className='text-red-600'>
                    Caution: Not Every Host Will Be Able To Handle This Feature & If you
                    Have Big Amount OF Data Then Change Your Server First
                </h1>
                <h2 className='text-2xl dark:text-white'>
                    Excel Sheet Should Be Like <AiFillInfoCircle cursor={'pointer'}/>
                </h2>
            </Tooltip>
            <Dragger {...uploaderProps}>
                <p className='text-lg font-semibold dark:text-white'>
                    Click or drag file to this area to upload
                </p>
            </Dragger>
        </div>
    );
};

export default ImportProducts;
