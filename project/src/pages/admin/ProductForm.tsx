import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { X as XIcon } from 'lucide-react';

interface ProductFormProps {
  product: Product | null;
  onSubmit: (formData: FormData) => void;
  onClose: () => void;
}

type FormDataType = {
  name: string;
  description: string;
  price: number;
  images: (string | File)[];
  sizes: string[];
  colors: string[];
  stock_quantity: number;
  created_at: string;
};

const initialState: FormDataType = {
  name: '',
  description: '',
  price: 0,
  images: [],
  sizes: [''],
  colors: [''],
  stock_quantity: 0,
  created_at: new Date().toISOString(), // Add created_at to satisfy the type
};

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<FormDataType>(initialState);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      const existingImages = product.images || [];
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        images: existingImages,
        sizes: product.sizes || [''],
        colors: product.colors || [''],
        stock_quantity: product.stock_quantity || 0,
        created_at: product.created_at || new Date().toISOString(),
      });
      setImagePreviews(existingImages);
    } else {
      setFormData(initialState);
      setImagePreviews([]);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const isNumber = type === 'number';

    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : isNumber ? parseFloat(value) || 0 : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImageUrls: string[] = [];
      const newImageFiles: File[] = [];

      files.forEach(file => {
        newImageUrls.push(URL.createObjectURL(file));
        newImageFiles.push(file);
      });

      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImageFiles] }));
      setImagePreviews(prev => [...prev, ...newImageUrls]);
    }
  };

  const removeImage = (index: number) => {
    const imageUrlToRemove = imagePreviews[index];
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newImages = formData.images.filter(image => {
      if (typeof image === 'string') {
        return image !== imageUrlToRemove;
      }
      // This check is for newly added File objects
      try {
        return URL.createObjectURL(image) !== imageUrlToRemove;
      } catch {
        return true; // Keep if it's not a blob URL
      }
    });

    setFormData(prev => ({ ...prev, images: newImages }));
    setImagePreviews(newPreviews);
    URL.revokeObjectURL(imageUrlToRemove); // Clean up memory
  };

  const handleArrayChange = (index: number, value: string, field: 'sizes' | 'colors') => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: 'sizes' | 'colors') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (index: number, field: 'sizes' | 'colors') => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Build multipart FormData matching backend API
    const data = new FormData();
    data.append('name', formData.name.trim());
    data.append('description', formData.description.trim());
    const price = isNaN(Number(formData.price)) ? 0 : Number(formData.price);
    data.append('price', String(price));
    // Category removed (optional)
    // colors as array of objects, convert from strings
    const colorsArr = (formData.colors || []).filter(Boolean).map((c) => ({ name: c, code: c }));
    data.append('colors', JSON.stringify(colorsArr));
    // sizes as array of strings
    const allowedSizes = ['XS','S','M','L','XL','XXL'];
    const sizesClean = (formData.sizes || []).filter((s) => !!s && allowedSizes.includes(s));
    data.append('sizes', JSON.stringify(sizesClean));
    const stock = Number.isFinite(Number(formData.stock_quantity)) ? parseInt(String(formData.stock_quantity), 10) : 0;
    data.append('stock', String(stock));
    data.append('is_new', 'true');
    // Append image files only (ignore existing URLs)
    (formData.images || []).forEach((img) => {
      if (img instanceof File) {
        data.append('images', img);
      }
    });
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Infos principales */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom du produit</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm py-2.5 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Prix</label>
            <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm py-2.5 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm py-2.5 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>
      </div>

      {/* Catégorie et Genre supprimés selon la demande */}

      {/* Médias */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 sm:p-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
        <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-xl">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img src={preview} alt={`Aperçu ${index + 1}`} className="h-24 w-24 object-cover rounded-md shadow-md" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Variantes */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 sm:p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Variantes</h3>
        <label className="block text-sm font-medium text-gray-700">Tailles</label>
        {formData.sizes.map((size, index) => (
          <div key={index} className="flex items-center mt-1">
            <select
              value={size}
              onChange={(e) => handleArrayChange(index, e.target.value, 'sizes')}
              className="block w-full border border-gray-300 rounded-xl shadow-sm py-2.5 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Sélectionner une taille</option>
              {['XS','S','M','L','XL','XXL'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <button type="button" onClick={() => removeArrayItem(index, 'sizes')} className="ml-2 text-red-600 hover:text-red-800" aria-label="Supprimer">
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem('sizes')} className="mt-2 text-sm text-indigo-600 hover:text-indigo-800">Ajouter taille</button>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Couleurs</label>
          {formData.colors.map((color, index) => (
            <div key={index} className="flex items-center mt-1">
              <input
                type="color"
                value={/^#/.test(color) ? color : '#000000'}
                onChange={(e) => handleArrayChange(index, e.target.value, 'colors')}
                className="h-10 w-12 p-0 border border-gray-300 rounded-md bg-white"
                title="Choisir une couleur"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => handleArrayChange(index, e.target.value, 'colors')}
                className="ml-2 block w-full border border-gray-300 rounded-xl shadow-sm py-2.5 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="#000000 ou nom"
              />
              <button type="button" onClick={() => removeArrayItem(index, 'colors')} className="ml-2 text-red-600 hover:text-red-800" aria-label="Supprimer">
                <XIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('colors')} className="mt-2 text-sm text-indigo-600 hover:text-indigo-800">Ajouter couleur</button>
        </div>
      </div>

      {/* Stock */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 sm:p-6">
        <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700">Quantité en stock</label>
        <input type="number" name="stock_quantity" id="stock_quantity" value={formData.stock_quantity} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm py-2.5 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
      </div>

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onClose} className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-200 ring-1 ring-gray-200">Annuler</button>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 shadow-sm">{product ? 'Mettre à jour' : 'Créer'}</button>
      </div>
    </form>
  );
};

export default ProductForm;
