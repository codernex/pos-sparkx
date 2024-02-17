import {Spin} from 'antd';
import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({children, loading, className, ...props}) => {
    return (
        <button
            disabled={loading}
            {...props}
            className={'px-4 py-1 min-w-[140px] bg-primary-color text-white border border-slate-800 rounded'}
        >
            {loading ? <Spin/> : children}
        </button>
    );
};

export default Button;
