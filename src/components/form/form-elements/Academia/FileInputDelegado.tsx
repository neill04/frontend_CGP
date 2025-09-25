import ComponentCard from "../../../common/ComponentCard";
import FileInput from "../../input/FileInput";

interface FileInputDelegadoProps {
  onChange: (url: string) => void;
  initialLogoUrl?: string;
}

export default function FileInputDelegado({ onChange, initialLogoUrl }: FileInputDelegadoProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const simulatedUrl = URL.createObjectURL(file);
      onChange(simulatedUrl);
    }
  };

  return (
    <ComponentCard title="Foto del delegado">
      <div>
        {initialLogoUrl && (
          <div className="mb-4">
            <img src={initialLogoUrl} alt="Foto del delegado" className="max-h-40 object-contain mx-auto" />
          </div>
        )}
        <FileInput onChange={handleFileChange} className="custom-class"/>
      </div>
    </ComponentCard>
  );
}