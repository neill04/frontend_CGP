import { useState } from "react";
import FileInput from "../../input/FileInput";

interface FileInputAcademiaProps {
  onChange: (file: File | null) => void;
  initialLogoUrl?: string;
  error?: string;
}

export default function FileInputAcademia({ 
  onChange, 
  initialLogoUrl,
  error
}: FileInputAcademiaProps) {
  const [preview, setPreview] = useState<string | undefined>(initialLogoUrl);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        alert('Por favor selecciona una imagen válida (JPG, PNG, WEBP, SVG)');
        event.target.value = '';
        return;
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('La imagen no debe superar los 5MB');
        event.target.value = '';
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      onChange(file);
    }
  };

  return (
    <div className="space-y-4">
      {preview && (
        <div className="flex justify-center">
          <img 
            src={preview} 
            alt="Logo de la academia" 
            className="max-h-40 w-auto object-contain rounded-lg shadow-md border border-gray-200 bg-white p-4" 
          />
        </div>
      )}

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Logo de la academia <span className="text-gray-400 text-xs">(Opcional)</span>
        </label>
        <FileInput 
          onChange={handleFileChange}
          className={`block w-full text-sm text-gray-900 border rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${
            error ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
          }`}
        />
        {error && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Formatos aceptados: JPG, PNG, WEBP, SVG (máx. 5MB)
        </p>
      </div>
    </div>
  );
}