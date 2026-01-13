import { AspectRatio } from "@/components/ui/aspect-ratio";

interface VimeoPlayerProps {
  vimeoId: string;
  title: string;
}

export function VimeoPlayer({ vimeoId, title }: VimeoPlayerProps) {
  return (
    <div className="rounded-lg overflow-hidden border bg-black" data-testid="container-video-player">
      <AspectRatio ratio={16 / 9}>
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=0&title=0&byline=0&portrait=0&dnt=1`}
          className="w-full h-full"
          allow="fullscreen; picture-in-picture"
          allowFullScreen
          title={title}
          data-testid="iframe-vimeo"
        />
      </AspectRatio>
    </div>
  );
}
