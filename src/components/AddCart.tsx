import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useApp } from '../contexts/AppContext';
import { Product } from '../data/mockData';
import { toast } from 'react-toastify';

export default function AddProducts() {
  const { products, addProduct } = useApp();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');

  const startScanner = () => {
    if (!containerRef.current) return;

    setIsScanning(true);

    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(containerRef.current.id);
    }

    scannerRef.current
      .start(
        { facingMode: 'environment' },
        { fps: 20, qrbox: { width: 300, height: 150 } },
        (decodedText) => {
          setBarcode(decodedText);
          const found = products.find((p) => p.barcode === decodedText);
          if (found) {
            setExistingProduct(found);
            toast.warn(`Товар "${found.name}" уже существует!`);
          } else {
            setExistingProduct(null);
          }
          stopScanner();
        },
        (error) => {
          // можно игнорировать ошибки сканирования
        }
      )
      .catch((err) => {
        console.error('Ошибка сканера:', err);
        toast.error('Не удалось запустить сканер');
        setIsScanning(false);
      });
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop(); // остановка сканирования
      } catch (err) {
        console.warn('Сканер не удалось остановить:', err);
      }
      try {
        await scannerRef.current.clear(); // освобождаем ресурсы
      } catch {}
      setIsScanning(false); // только после полной остановки
    }
  };

  const resetScanner = async () => {
    await stopScanner();
    setBarcode(null);
    setExistingProduct(null);
    setName('');
    setPrice('');
  };

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

  // очистка при размонтировании
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="p-4 border rounded w-full max-w-md my-4">
      <h3 className="mb-2 font-bold">Добавить товар через сканер</h3>

      {!barcode && !isScanning && (
        <button
          onClick={startScanner}
          className="bg-blue-500 text-white p-2 rounded w-full mb-2 hover:bg-blue-600"
        >
          Начать сканирование
        </button>
      )}

      <div
        ref={containerRef}
        id="html5qr-scanner-container"
        className={`${isScanning ? 'block' : 'hidden'} w-full mb-2`}
      />

      {isScanning && (
        <button
          onClick={async () => await resetScanner()}
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
