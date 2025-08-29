import ComponentCard from "../../../common/ComponentCard";
import FileInput from "../../input/FileInput";
import { useState, useEffect } from "react";

interface FileInputAcademiaProps {
  onChange: (url: string) => void;
  initialLogoUrl?: string;
}

export default function FileInputAcademia({ onChange, initialLogoUrl }: FileInputAcademiaProps) {
  const [currentUrl, setCurrentUrl] = useState(initialLogoUrl);

  useEffect(() => {
    setCurrentUrl(initialLogoUrl);
  }, [initialLogoUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const simulatedUrl = URL.createObjectURL(file);
      setCurrentUrl(simulatedUrl);
      onChange(simulatedUrl);
    }
  };

  return (
    <ComponentCard title="Logo de la academia">
      <div>
        {currentUrl && (
          <div className="mb-4">
            <img src={currentUrl} alt="Logo de la academia" className="max-h-40 object-contain mx-auto" />
          </div>
        )}
        <FileInput onChange={handleFileChange} className="custom-class" />
      </div>
    </ComponentCard>
  );
}
