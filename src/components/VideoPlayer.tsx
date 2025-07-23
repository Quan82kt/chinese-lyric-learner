import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';

interface VideoPlayerProps {
  videoId?: string;
  currentTime?: number;
  onTimeUpdate?: (time: number) => void;
}

const VideoPlayer = ({ videoId, currentTime, onTimeUpdate }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (currentTime !== undefined && iframeRef.current) {
      // Sync with external time updates
      const message = {
        event: 'command',
        func: 'seekTo',
        args: [currentTime, true]
      };
      iframeRef.current.contentWindow?.postMessage(JSON.stringify(message), '*');
    }
  }, [currentTime]);

  const togglePlay = () => {
    if (iframeRef.current) {
      const message = {
        event: 'command',
        func: isPlaying ? 'pauseVideo' : 'playVideo',
        args: []
      };
      iframeRef.current.contentWindow?.postMessage(JSON.stringify(message), '*');
      setIsPlaying(!isPlaying);
    }
  };

  if (!videoId) {
    return (
      <Card className="w-full aspect-video bg-gradient-hero flex items-center justify-center">
        <CardContent className="text-center">
          <div className="text-white/80 text-lg mb-4">
            Nhập link YouTube để bắt đầu học hát tiếng Trung
          </div>
          <div className="text-white/60">
            🎵 Khám phá cách phát âm chuẩn qua âm nhạc
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden shadow-chinese">
      <CardContent className="p-0">
        <div className="relative aspect-video">
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video player"
          />
          
          {/* Custom controls overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex items-center gap-4">
              <Button
                size="sm"
                variant="secondary"
                onClick={togglePlay}
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <div className="flex items-center gap-2 flex-1">
                <Volume2 className="h-4 w-4 text-white" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-white/20 rounded-lg appearance-none slider"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;