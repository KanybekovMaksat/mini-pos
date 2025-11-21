import { useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Barcode } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface BarcodeScannerAddToCartProps {
  onAddToCart: (productId: string) => void;
}

export default function AddCart({ onAddToCart }: BarcodeScannerAddToCartProps) {
  const { products } = useApp();
  const [isScanning, setIsScanning] = useState(false);
  const [message, setMessage] = useState('');
  const SCANNER_ID = 'barcode-scanner-container';

  const startScanner = () => {
    setMessage('');
    setIsScanning(true);

    setTimeout(() => {
      const scanner = new Html5Qrcode(SCANNER_ID);

      scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          const product = products.find(p => p.barcode === decodedText);
          if (product) {
            onAddToCart(product.id);
            setMessage(`Товар "${product.name}" добавлен в чек`);
          } else {
            setMessage(`Товар с штрихкодом "${decodedText}" не найден`);
          }
          scanner.stop().then(() => setIsScanning(false));
        },
        (error) => {
          // ошибки сканирования можно игнорировать
        }
      ).catch(err => {
        console.error('Ошибка сканера:', err);
        setMessage('Не удалось запустить сканер');
        setIsScanning(false);
      });
    }, 0);
  };

  const stopScanner = () => {
    const scanner = new Html5Qrcode(SCANNER_ID);
    scanner.stop().then(() => setIsScanning(false)).catch(() => {});
  };

  return (
    <div className="mb-4">
      {!isScanning && (
        <button
          onClick={startScanner}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          <Barcode className="w-5 h-5" />
          Сканировать товар
        </button>
      )}

      {isScanning && (
        <div className="relative">
          <div
            id={SCANNER_ID}
            className="w-full h-64 bg-gray-200 rounded-xl mt-2"
          />
          <button
            onClick={stopScanner}
            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg"
          >
            Назад
          </button>
        </div>
      )}

      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
