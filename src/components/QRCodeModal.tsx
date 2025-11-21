import { X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeModalProps {
  amount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export default function QRCodeModal({
  amount,
  onClose,
  onConfirm,
}: QRCodeModalProps) {
const qrData = `https://eldikkassa.ustaz.tech/payment?amount=${amount}&currency=KGS`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">ELQR-оплата</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="text-center mb-6">
          <div className="relative bg-gradient-to-br  rounded-2xl mb-4 flex items-center justify-center">
            <QRCodeSVG
              value={qrData}
              size={250}            
              includeMargin={false}
              imageSettings={{
                src: 'https://eldikkassa.ustaz.tech//elqr.png',
                height: 40,
                width: 40,
                excavate: true,
                opacity: 0.8,
              }}
            />
          </div>

          <p className="text-3xl font-bold text-gray-900 mb-2">
            {amount.toFixed(2)} сом
          </p>
        </div>

        <div className="space-y-2">
          <button
            onClick={onConfirm}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Подтвердить оплату
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
