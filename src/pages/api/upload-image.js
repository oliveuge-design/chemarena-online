import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

const IMAGES_ARCHIVE_PATH = path.join(process.cwd(), 'data', 'images-archive.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'images');

function readImagesArchive() {
  try {
    if (fs.existsSync(IMAGES_ARCHIVE_PATH)) {
      const data = fs.readFileSync(IMAGES_ARCHIVE_PATH, 'utf8');
      return JSON.parse(data);
    }
    return { images: [], metadata: { version: "1.0", totalImages: 0 } };
  } catch (error) {
    console.error('Errore nella lettura dell\'archivio immagini:', error);
    return { images: [], metadata: { version: "1.0", totalImages: 0 } };
  }
}

function writeImagesArchive(data) {
  try {
    const dir = path.dirname(IMAGES_ARCHIVE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(IMAGES_ARCHIVE_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Errore nella scrittura dell\'archivio immagini:', error);
    return false;
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const archive = readImagesArchive();
        return res.status(200).json(archive);
      } catch (error) {
        return res.status(500).json({ error: 'Errore del server' });
      }

    case 'POST':
      try {
        if (!fs.existsSync(UPLOAD_DIR)) {
          fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }

        const form = formidable({
          uploadDir: UPLOAD_DIR,
          keepExtensions: true,
          maxFileSize: 5 * 1024 * 1024, // 5MB
        });

        const [fields, files] = await form.parse(req);
        const uploadedFile = files.image;

        if (!uploadedFile || !uploadedFile[0]) {
          return res.status(400).json({ error: 'Nessuna immagine caricata' });
        }

        const file = uploadedFile[0];
        const filename = `img_${Date.now()}_${file.originalFilename}`;
        const newPath = path.join(UPLOAD_DIR, filename);
        
        fs.renameSync(file.filepath, newPath);

        const archive = readImagesArchive();
        const newImage = {
          id: `img_${Date.now()}`,
          filename,
          originalName: file.originalFilename,
          path: `/uploads/images/${filename}`,
          url: `/uploads/images/${filename}`,
          uploadDate: new Date().toISOString().split('T')[0],
          size: file.size,
          mimetype: file.mimetype,
          tags: fields.tags ? fields.tags[0].split(',').map(t => t.trim()) : [],
          usedInQuestions: []
        };

        archive.images.push(newImage);
        archive.metadata.totalImages = archive.images.length;
        archive.metadata.lastUpdate = new Date().toISOString().split('T')[0];

        if (writeImagesArchive(archive)) {
          return res.status(201).json(newImage);
        } else {
          return res.status(500).json({ error: 'Errore nel salvare l\'immagine nell\'archivio' });
        }

      } catch (error) {
        console.error('Errore nell\'upload:', error);
        return res.status(500).json({ error: 'Errore nell\'upload dell\'immagine' });
      }

    case 'DELETE':
      try {
        const { id } = req.query;
        
        if (!id) {
          return res.status(400).json({ error: 'ID immagine mancante' });
        }

        const archive = readImagesArchive();
        const imageIndex = archive.images.findIndex(img => img.id === id);
        
        if (imageIndex === -1) {
          return res.status(404).json({ error: 'Immagine non trovata' });
        }

        const image = archive.images[imageIndex];
        const filePath = path.join(process.cwd(), 'public', image.path);
        
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        archive.images.splice(imageIndex, 1);
        archive.metadata.totalImages = archive.images.length;
        archive.metadata.lastUpdate = new Date().toISOString().split('T')[0];

        if (writeImagesArchive(archive)) {
          return res.status(200).json({ message: 'Immagine eliminata con successo' });
        } else {
          return res.status(500).json({ error: 'Errore nell\'eliminare l\'immagine' });
        }

      } catch (error) {
        return res.status(500).json({ error: 'Errore del server' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).json({ error: `Metodo ${method} non supportato` });
  }
}