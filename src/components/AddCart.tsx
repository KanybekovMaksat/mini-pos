import { useState, useRef } from 'react';
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
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null); // Ссылка на div

  const startScanner = () => {
    if (!containerRef.current) {
      setMessage('Ошибка: контейнер для сканера не найден');
      return;
    }

    setMessage('');
    setIsScanning(true);

    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(containerRef.current.id);
    }

    scannerRef.current
      .start(
        { facingMode: 'environment' },
        { fps: 20, qrbox: { width: 300, height: 150 } },
        (decodedText) => {
          const product = products.find((p) => p.barcode === decodedText);
          if (product) {
            onAddToCart(product.id);
            setMessage(`Товар "${product.name}" добавлен в чек`);
          } else {
            setMessage(`Товар с штрихкодом "${decodedText}" не найден`);
          }
          stopScanner();
        },
        (error) => {
          // ошибки сканирования можно игнорировать
        }
      )
      .catch((err) => {
        console.error('Ошибка сканера:', err);
        setMessage('Не удалось запустить сканер');
        setIsScanning(false);
      });
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().finally(() => setIsScanning(false));
    }
  };

  return (
    <div className="mb-4 relative">
      {!isScanning && (
        <button
          onClick={startScanner}
          className="flex items-center gap-2 bg-[#008de4] text-white px-4 py-2 font-medium transition rounded-lg hover:bg-green-600"
        >
          <Barcode className="w-5 h-5" />
          Сканировать товар
        </button>
      )}

      {/* Контейнер сканера */}
      <div
        ref={containerRef}
        id="barcode-scanner-container"
        className={`w-full h-64 rounded-xl mt-2 ${
          isScanning ? 'block' : 'hidden'
        }`}
      />

      {/* Кнопка Назад */}
      {isScanning && (
        <button
          onClick={stopScanner}
          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg"
        >
          Назад
        </button>
      )}

      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
