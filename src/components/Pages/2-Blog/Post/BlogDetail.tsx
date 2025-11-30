import { Calendar, User } from "lucide-react";
import { Button } from "../../../ui/button";
import type { BlogPost } from "../Interface/blog";

interface BlogDetailProps {
  post: BlogPost;
  onBack: () => void;
}

export const BlogDetail = ({ post, onBack }: BlogDetailProps) => {
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
        src={post.imagen}
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
          {new Date(post.fecha).toLocaleDateString("es-CL")}
        </div>
      </div>

      <p className="text-gray-300 leading-relaxed">{post.contenido}</p>
    </div>
  );
};

