import ComponentCard from "../../../common/ComponentCard";
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

  return (
    <ComponentCard title="Foto del entrenador">
      <div>
        {initialLogoUrl && (
          <div className="mb-4">
            <img src={initialLogoUrl} alt="Foto del entrenador" className="max-h-40 object-contain mx-auto" />
          </div>
        )}
        <FileInput onChange={handleFileChange} className="custom-class"/>
      </div>
    </ComponentCard>
  );
}