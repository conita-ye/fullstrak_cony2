import { useState, useEffect } from "react";
import { Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiService } from "@/services/api";
import { toast } from "sonner";

interface BlogPost {
  id: number;
  titulo: string;
  descripcionCorta: string;
  autor: string;
  fechaPublicacion: string;
  imagenUrl: string;
  contenidoUrl?: string;
  contenido?: string;
}

interface BlogDetailProps {
  post: BlogPost;
  onBack: () => void;
}

export const BlogDetail = ({ post, onBack }: BlogDetailProps) => {
  const [contenido, setContenido] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarContenido();
  }, [post.id]);

  const cargarContenido = async () => {
    try {
      setLoading(true);
      const blogCompleto = await apiService.getBlogPost(String(post.id));
      setContenido(blogCompleto.contenido || blogCompleto.descripcionCorta || '');
    } catch (error) {
      console.error('Error al cargar contenido del blog:', error);
      setContenido(post.descripcionCorta || '');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 text-white">
      <Button
        onClick={onBack}
        variant="outline"
        className="mb-6 text-[var(--neon-green)] border-[var(--neon-green)]"
      >
        ← Volver al blog
      </Button>

      <img
        src={post.imagenUrl || 'https://picsum.photos/1200/600'}
        alt={post.titulo}
        className="rounded-lg mb-6 w-full"
      />
      <h1 className="text-4xl mb-2 text-[var(--neon-green)]">{post.titulo}</h1>

      <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" /> {post.autor}
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />{" "}
          {new Date(post.fechaPublicacion).toLocaleDateString("es-CL")}
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando contenido...</p>
      ) : (
        <div className="text-gray-300 leading-relaxed whitespace-pre-line">
          {contenido}
        </div>
      )}
    </div>
  );
};

