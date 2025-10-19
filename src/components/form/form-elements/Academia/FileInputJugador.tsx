import ComponentCard from "../../../common/ComponentCard";
import FileInput from "../../input/FileInput";

interface FileInputJugadorProps {
  onChange: (url: string) => void;
  initialLogoUrl?: string;
}

export default function FileInputJugador({ onChange, initialLogoUrl }: FileInputJugadorProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const simulatedUrl = URL.createObjectURL(file);
      onChange(simulatedUrl);
    }
  };

  return (
    <ComponentCard title="Foto del jugador">
      <div>
        {initialLogoUrl && (
          <div className="mb-4">
            <img src={initialLogoUrl} alt="Foto del jugador" className="max-h-40 object-contain mx-auto" />
          </div>
        )}
        <FileInput onChange={handleFileChange} className="custom-class"/>
      </div>
    </ComponentCard>
  );
}