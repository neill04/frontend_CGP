import ComponentCard from "../../../common/ComponentCard";
import FileInput from "../../input/FileInput";

interface FileInputAcademiaProps {
  onChange: (url: string) => void;
  initialLogoUrl?: string;
}

export default function FileInputAcademia({ onChange, initialLogoUrl }: FileInputAcademiaProps) {
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
    <ComponentCard title="Logo de la academia">
      <div>
        {initialLogoUrl && (
          <div className="mb-4">
            <img src={initialLogoUrl} alt="Logo de la academia" className="max-h-40 object-contain mx-auto" />
          </div>
        )}
        <FileInput onChange={handleFileChange} className="custom-class" />

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
    </ComponentCard>
  );
}