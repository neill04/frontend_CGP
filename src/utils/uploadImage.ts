export const CLOUDINARY_FOLDERS = {
  LOGOS: "logos",
  ENTRENADORES: "entrenadores",
  DELEGADOS: "delegados",
  JUGADORES: "jugadores",
  EQUIPOS: "equipos",
} as const;

export const uploadToCloudinary = async (file: File, folder: string = ""): Promise<string> => {
  console.log("🚀 Iniciando uploadToCloudinary");
  console.log("📁 Archivo recibido:", file.name, file.size, file.type);
  
  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo debe ser una imagen');
  }

  const maxSize = 5 * 1024 * 1024; 
  if (file.size > maxSize) {
    throw new Error('La imagen no debe superar 5MB');
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Faltan configuraciones de Cloudinary');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  if (folder) {
    formData.append('folder', folder);
  }

  try {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error de Cloudinary:", errorData);
      throw new Error('Error al subir la imagen a Cloudinary');
    }

    const data = await response.json();

    return data.secure_url; 
  } catch (error) {
    throw new Error('No se pudo subir la imagen. Intenta nuevamente.');
  }
};