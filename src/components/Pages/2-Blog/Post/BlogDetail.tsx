import { useState, useEffect } from "react";
import { Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiService } from "@/services/api";
import { toast } from "sonner";

// Función simple para renderizar markdown básico a HTML
const renderizarMarkdown = (markdown: string): string => {
  if (!markdown) return '';
  
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold text-[var(--neon-green)] mt-6 mb-3">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold text-[var(--neon-green)] mt-8 mb-4">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold text-[var(--neon-green)] mt-10 mb-5">$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong class="text-white font-semibold">$1</strong>');
  
  // Procesar listas
  const lines = html.split('\n');
  let inList = false;
  let processedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('- ') || trimmedLine.match(/^\d+\.\s/)) {
      if (!inList) {
        processedLines.push('<ul class="list-disc ml-6 mb-4 space-y-2">');
        inList = true;
      }
      const listContent = trimmedLine.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '');
      processedLines.push(`<li class="mb-2">${listContent}</li>`);
    } else {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      if (trimmedLine === '') {
        processedLines.push('<br/>');
      } else if (!trimmedLine.startsWith('<h') && !trimmedLine.startsWith('<ul') && !trimmedLine.startsWith('</ul')) {
        processedLines.push(`<p class="mb-4">${line}</p>`);
      } else {
        processedLines.push(line);
      }
    }
  }
  
  if (inList) {
    processedLines.push('</ul>');
  }
  
  html = processedLines.join('\n');
  
  // Escapar HTML malicioso (básico)
  html = html.replace(/<script[^>]*>.*?<\/script>/gim, '');
  
  return html;
};

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
      
      // Intentar obtener el contenido directamente desde S3
      if (post.contenidoUrl) {
        try {
          const response = await fetch(post.contenidoUrl);
          if (response.ok) {
            const contenidoMarkdown = await response.text();
            setContenido(contenidoMarkdown || post.descripcionCorta || '');
            return;
          }
        } catch (s3Error) {
          console.warn('Error al cargar desde S3, intentando endpoint alternativo:', s3Error);
        }
      }
      
      // Si no hay contenidoUrl o falla, intentar construir la URL de S3 basada en el ID
      const s3Url = `https://levelupgamer-assets.s3.us-east-1.amazonaws.com/blogs/${post.id}/blog.md`;
      try {
        const response = await fetch(s3Url);
        if (response.ok) {
          const contenidoMarkdown = await response.text();
          setContenido(contenidoMarkdown || post.descripcionCorta || '');
          return;
        }
      } catch (s3Error) {
        console.warn('Error al cargar desde S3 construido, intentando endpoint API:', s3Error);
      }
      
      // Si falla S3, intentar con el endpoint de la API
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/v1'}/blog-posts/${post.id}/content`);
        if (response.ok) {
          const contenidoMarkdown = await response.text();
          setContenido(contenidoMarkdown || post.descripcionCorta || '');
          return;
        }
      } catch (apiError) {
        console.warn('Error al cargar desde API, usando método normal:', apiError);
      }
      
      // Último recurso: usar el método normal de la API
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
        <div 
          className="text-gray-300 leading-relaxed prose prose-invert prose-headings:text-[var(--neon-green)] prose-a:text-[var(--neon-purple)] prose-strong:text-white max-w-none"
          dangerouslySetInnerHTML={{ __html: renderizarMarkdown(contenido) }}
        />
      )}
    </div>
  );
};

