import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useApp } from '../contexts/AppContext';
import { Product } from '../data/mockData';
import { toast } from 'react-toastify';

export function AddProducts() {
  const { products, addProduct } = useApp();
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');

  const SCANNER_ID = 'html5qr-scanner';

  // useEffect для запуска сканера
  useEffect(() => {
    if (isScanning && scannerRef.current) {
      html5QrcodeRef.current = new Html5Qrcode(SCANNER_ID);

      html5QrcodeRef.current
        .start(
          { facingMode: 'environment' },
          { fps: 20, qrbox: { width: 300, height: 150 } },
          (decodedText) => {
            html5QrcodeRef.current?.stop();
            setIsScanning(false);
            setBarcode(decodedText);

            const found = products.find((p) => p.barcode === decodedText);
            if (found) {
              setExistingProduct(found);
              toast.warn(`Товар "${found.name}" уже существует!`);
            } else {
              setExistingProduct(null);
            }
          },
          (error) => {
            // игнорируем ошибки сканирования
          }
        )
        .catch(() => {
          toast.error('Не удалось запустить сканер');
          setIsScanning(false);
        });
    }

    return () => {
      html5QrcodeRef.current?.stop().catch(() => {});
    };
  }, [isScanning, products]);

  const handleAddProduct = () => {
    if (!barcode || !name || price === '') {
      toast.error('Введите название и цену товара');
      return;
    }

    const newProduct: Omit<Product, 'id'> = {
      pointId: '1',
      name,
      price: Number(price),
      category: 'Без категории',
      isFastProduct: false,
      imageUrl: '',
      barcode,
    };

    addProduct(newProduct);
    toast.success(`Товар "${name}" добавлен!`);
    resetScanner();
  };

  const resetScanner = () => {
    setIsScanning(false);
    setBarcode(null);
    setExistingProduct(null);
    setName('');
    setPrice('');
    html5QrcodeRef.current?.stop().catch(() => {});
  };

  return (
    <div className="p-4 border rounded w-full max-w-md my-4">
      <h3 className="mb-2 font-bold">Добавить товар через сканер</h3>

      {!barcode && !isScanning && (
        <button
          onClick={() => setIsScanning(true)}
          className="bg-blue-500 text-white p-2 rounded w-full mb-2 hover:bg-blue-600"
        >
          Начать сканирование
        </button>
      )}

      <div
        ref={scannerRef}
        id={SCANNER_ID}
        className={`${isScanning ? 'block' : 'hidden'} w-full  mb-2`}
      />

      {isScanning && (
        <button
          onClick={resetScanner}
          className="bg-gray-500 text-white p-2 rounded w-full hover:bg-gray-600 mb-2"
        >
          Назад
        </button>
      )}

      {barcode && existingProduct && (
        <div className="mt-2 p-2 border rounded bg-yellow-50">
          <p>
            Штрихкод: <b>{existingProduct.barcode}</b>
          </p>
          <p>Товар уже существует:</p>
          <p>
            <b>{existingProduct.name}</b> — {existingProduct.price} сом
          </p>
          <button
            onClick={resetScanner}
            className="mt-2 bg-gray-500 text-white p-2 rounded w-full hover:bg-gray-600"
          >
            Назад
          </button>
        </div>
      )}

      {barcode && !existingProduct && (
        <div className="mt-2 p-2 border rounded bg-gray-50">
          <p>
            Штрихкод: <b>{barcode}</b>
          </p>
          <input
            type="text"
            placeholder="Название товара"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-2 p-1 border rounded"
          />
          <input
            type="number"
            placeholder="Цена"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full mb-2 p-1 border rounded"
          />
          <button
            onClick={handleAddProduct}
            className="bg-green-500 text-white p-2 rounded w-full hover:bg-green-600"
          >
            Добавить товар
          </button>
          <button
            onClick={resetScanner}
            className="mt-2 bg-gray-500 text-white p-2 rounded w-full hover:bg-gray-600"
          >
            Назад
          </button>
        </div>
      )}
    </div>
  );
}
