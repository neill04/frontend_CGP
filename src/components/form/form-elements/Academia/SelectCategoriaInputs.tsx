import ComponentCard from "../../../common/ComponentCard";
import Label from "../../Label";
import Select from "../../Select";

interface SelectCategoriaInputsProps {
  value: string;
  onChange: (categoria: string) => void;
}

export default function SelectCategoriaInputs({
  value,
  onChange,
}: SelectCategoriaInputsProps) {
  const categoria = [
    "sub5",
    "sub6",
    "sub7",
    "sub8",
    "sub9",
    "sub10",
    "sub11",
    "sub12",
    "sub13",
    "sub14",
    "sub15",
    "sub16",
  ];

  const options = categoria.map((c) => ({
    value: c,
    label: c.toUpperCase(),
  }));

  const handleCategoriaChange = (selectedValue: string) => {
    onChange(selectedValue);
  };

  return (
    <ComponentCard title="Categoria del Equipo">
      <div className="space-y-6">
        <div>
          <Select
            options={options}
            placeholder="Seleccione una categoría"
            onChange={handleCategoriaChange}
            value={value}
            className="dark:bg-dark-900"
          />
        </div>
      </div>
    </ComponentCard>
  );
}