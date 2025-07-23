import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Loader2, Youtube, AlertCircle } from 'lucide-react';

interface YoutubeInputProps {
  onAnalyze: (videoId: string) => void;
  isLoading: boolean;
}

const YoutubeInput = ({ onAnalyze, isLoading }: YoutubeInputProps) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Vui lòng nhập link YouTube');
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('Link YouTube không hợp lệ. Vui lòng kiểm tra lại.');
      return;
    }

    onAnalyze(videoId);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) setError('');
  };

  return (
    <Card className="w-full shadow-chinese">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-chinese-red">
          <Youtube className="h-6 w-6" />
          Phân tích bài hát tiếng Trung
        </CardTitle>
        <p className="text-muted-foreground">
          Nhập link YouTube để học từ vựng và phát âm qua âm nhạc
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={handleUrlChange}
                className="pl-10 pr-4 py-3 text-lg"
                disabled={isLoading}
              />
              <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <Button
            type="submit"
            className="w-full py-3 text-lg bg-gradient-primary hover:shadow-chinese transition-all"
            disabled={isLoading || !url.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Đang phân tích...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Phân tích bài hát
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-soft-blue rounded-lg">
          <h4 className="font-medium mb-2 text-chinese-red">💡 Hướng dẫn sử dụng:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Tìm bài hát tiếng Trung yêu thích trên YouTube</li>
            <li>• Copy link video và dán vào ô trên</li>
            <li>• Nhấn "Phân tích" để xem lyrics với pinyin và nghĩa tiếng Việt</li>
            <li>• Click vào từng câu lyrics để phát video tại thời điểm đó</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default YoutubeInput;