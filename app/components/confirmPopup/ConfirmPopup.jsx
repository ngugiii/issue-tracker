import React from 'react';


const ConfirmPopup = ({
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 top-[-1.25rem] flex items-center justify-center bg-black bg-opacity-50">
      <div className="additional-info fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[10rem] px-3 py-1 w-[24rem] bg-gray-100 border-orangered-2px rounded-lg">
        <div className="p-2 flex flex-col justify-between">
          <div className="text mb-4">
            <h1 className='font-bold text-xl mb-2'>{title}</h1>
            <h1 className='text-lg'>{description}</h1>
          </div>
          <div className="buttons w-full flex justify-end">
            <button className='bg-blue-700 rounded text-white cursor-pointer px-2 py-1 mr-2' onClick={onCancel}>
              {cancelLabel}
            </button>
            <button className='bg-red-600 px-2 py-1 mr-3 rounded text-white cursor-pointer' onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ConfirmPopup;
