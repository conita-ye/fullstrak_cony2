import { useState, useEffect } from "react";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  categoria?: string;
}

interface BlogPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export const BlogPage = ({ onNavigate }: BlogPageProps) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarBlogs();
  }, []);

  const cargarBlogs = async () => {
    try {
      setLoading(true);
      const blogs = await apiService.getBlogPosts();
      setBlogPosts(blogs);
    } catch (error) {
      console.error('Error al cargar blogs:', error);
      toast.error('Error al cargar el blog');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Cargando blog...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4 text-[var(--neon-green)]">
            Blog Gamer
          </h1>
          <p className="text-gray-400 text-lg">
            Noticias, guías y todo sobre el mundo gaming
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-[#111] border border-[var(--neon-green)] rounded-lg overflow-hidden hover:scale-105 transition-all"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={post.imagenUrl || 'https://picsum.photos/800/600'}
                  alt={post.titulo}
                  className="w-full h-full object-cover"
                />
                {post.categoria && (
                  <Badge className="absolute top-4 left-4 bg-black/70 text-[var(--neon-green)] border-[var(--neon-green)]">
                    {post.categoria}
                  </Badge>
                )}
              </div>

              <div className="p-6">
                <h2 className="text-xl text-white mb-3">{post.titulo}</h2>
                <p className="text-gray-400 mb-4 line-clamp-3">
                  {post.descripcionCorta}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{post.autor}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.fechaPublicacion).toLocaleDateString("es-CL")}</span>
                  </div>
                </div>

                <Button
                  onClick={() => onNavigate("blog-detail", post)}
                  variant="outline"
                  className="w-full border-[var(--neon-green)] text-[var(--neon-green)] hover:bg-[var(--neon-green)] hover:text-black"
                >
                  Leer más
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

