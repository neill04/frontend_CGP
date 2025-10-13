import FileInput from "../../input/FileInput";

interface FileInputEntrenadorProps {
  onChange: (url: string) => void;
  initialLogoUrl?: string;
}

export default function FileInputEntrenador({ onChange, initialLogoUrl }: FileInputEntrenadorProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const simulatedUrl = URL.createObjectURL(file);
      onChange(simulatedUrl);
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    onChange(url);
  };

  return (
    <div>
      {initialLogoUrl && (
        <div className="mb-4">
          <img src={initialLogoUrl} alt="Foto del entrenador" className="max-h-40 object-contain mx-auto" />
        </div>
      )}
      <FileInput onChange={handleFileChange} className="block w-full mb-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"/>
      <div className="mt-4">
        <label className="block mb-1 font-medium">O pega una URL del logo:</label>
        <input
          type="text"
          value={initialLogoUrl?.startsWith("blob:") ? "" : initialLogoUrl}
          onChange={handleUrlChange}
          placeholder="https://ejemplo.com/logo.png"
          className="border rounded px-2 py-1 w-full"
        />
      </div>
    </div>
  );
}