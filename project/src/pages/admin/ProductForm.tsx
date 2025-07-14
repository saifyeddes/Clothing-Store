import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { mockCategories } from '../../lib/mockData';

interface ProductFormProps {
  product: Product | null;
  onSubmit: (product: Product) => void;
  onClose: () => void;
}

type FormDataType = Omit<Product, 'id' | 'category' | 'images'> & {
  category_id: string;
  images: (string | File)[];
};

const initialState: FormDataType = {
  name: '',
  description: '',
  price: 0,
  category_id: '',
  images: [],
  sizes: [''],
  colors: [''],
  gender: 'unisexe',
  stock_quantity: 0,
  is_featured: false,
  created_at: new Date().toISOString(), // Add created_at to satisfy the type
};

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<FormDataType>(initialState);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      const existingImages = product.images || [];
      setFormData({
        ...product,
        category_id: product.category?.id || '',
        images: existingImages,
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
      } catch (error) {
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
    const submissionData: Product = {
      ...formData,
      id: product?.id || `new-${Date.now()}`,
      images: imagePreviews,
      category: mockCategories.find(c => c.id === formData.category_id),
      created_at: product?.created_at || new Date().toISOString(),
    };
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom du produit</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Prix</label>
          <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Catégorie</label>
          <select name="category_id" id="category_id" value={formData.category_id} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required>
            <option value="">Sélectionner une catégorie</option>
            {mockCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Genre</label>
          <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            <option value="unisexe">Unisexe</option>
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
        <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg">
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

      {['sizes', 'colors'].map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
          {formData[field as 'sizes' | 'colors'].map((item, index) => (
            <div key={index} className="flex items-center mt-1">
              <input type="text" value={item} onChange={(e) => handleArrayChange(index, e.target.value, field as 'sizes' | 'colors')} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              <button type="button" onClick={() => removeArrayItem(index, field as 'sizes' | 'colors')} className="ml-2 text-red-600 hover:text-red-800">Supprimer</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem(field as 'sizes' | 'colors')} className="mt-2 text-sm text-indigo-600 hover:text-indigo-800">Ajouter {field}</button>
        </div>
      ))}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700">Quantité en stock</label>
          <input type="number" name="stock_quantity" id="stock_quantity" value={formData.stock_quantity} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div className="flex items-center">
          <input type="checkbox" name="is_featured" id="is_featured" checked={formData.is_featured} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
          <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">Produit vedette</label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Annuler</button>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">{product ? 'Mettre à jour' : 'Créer'}</button>
      </div>
    </form>
  );
};

export default ProductForm;
