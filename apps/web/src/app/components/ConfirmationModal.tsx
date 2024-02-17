import React from 'react'
import {Modal} from "antd";

interface ConfirmationModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    execute: () => Promise<void>
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({open, setOpen, execute}) => {
    return (
        <Modal open={open} footer={false}
               onCancel={() => setOpen(false)}>
            <h1 className="confirm__modal--heading">Are you sure! you want to Continue?</h1>
            <div className={'flex gap-x-5'}>
                <button className={'confirm__modal--btn cancel'} type={'button'}
                        onClick={() => setOpen(false)}>Cancel
                </button>
                <button type={'button'} className={'confirm__modal--btn continue'}
                        onClick={() => {
                            execute().then(() => setOpen(false))
                        }
                        }>Confirm
                </button>
            </div>
        </Modal>
    )
}

export default ConfirmationModal