import { useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useApp } from '../contexts/AppContext';
import { Product } from '../data/mockData';

export function AddProducts() {
  const { products, addProduct } = useApp();
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [message, setMessage] = useState('');

  const SCANNER_ID = 'html5qr-scanner';

  const startScanner = () => {
    setMessage('');
    setIsScanning(true);
    setBarcode(null);
    setExistingProduct(null);

    setTimeout(() => {
      if (!document.getElementById(SCANNER_ID)) {
        setMessage('Ошибка: сканер не найден');
        setIsScanning(false);
        return;
      }

      html5QrcodeRef.current = new Html5Qrcode(SCANNER_ID);

      html5QrcodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 20 ,
          qrbox: { width: 300, height: 150 },
        },
        (decodedText) => {
          html5QrcodeRef.current?.stop();
          setIsScanning(false);
          setBarcode(decodedText);

          const found = products.find((p) => p.barcode === decodedText);
          if (found) {
            setExistingProduct(found);
            setMessage(`Товар "${found.name}" уже существует!`);
          } else {
            setExistingProduct(null);
          }
        },
        (error) => {
          // ошибки сканирования можно игнорировать
        }
      );
    }, 0);
  };

  const handleAddProduct = () => {
    if (!barcode || !name || price === '') {
      setMessage('Введите название и цену товара');
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
    setMessage(`Товар "${name}" добавлен!`);
    resetScanner();
  };

  const resetScanner = () => {
    setIsScanning(false);
    setBarcode(null);
    setExistingProduct(null);
    setName('');
    setPrice('');
    setMessage('');
    html5QrcodeRef.current?.stop().catch(() => {});
  };

  return (
    <div className="p-4 border rounded w-full max-w-md">
      <h3 className="mb-2 font-bold">Добавить товар через сканер</h3>

      {!barcode && !isScanning && (
        <button
          onClick={startScanner}
          className="bg-blue-500 text-white p-2 rounded w-full mb-2 hover:bg-blue-600"
        >
          Начать сканирование
        </button>
      )}

      {isScanning && (
        <div>
          <div
            ref={scannerRef}
            id={SCANNER_ID}
            style={{ width: '100%', height: '300px', background: '#ccc' }}
          />
          <button
            onClick={resetScanner}
            className="mt-2 bg-gray-500 text-white p-2 rounded w-full hover:bg-gray-600"
          >
            Назад
          </button>
        </div>
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

      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
