import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import YoutubeInput from '@/components/YoutubeInput';
import VideoPlayer from '@/components/VideoPlayer';
import LyricList from '@/components/LyricList';
import { analyzeLyric } from '@/api/analyzeLyric';
import heroBg from '@/assets/hero-bg.jpg';

interface LyricLine {
  id: string;
  chinese: string;
  pinyin: string;
  vietnamese: string;
  startTime: number;
  endTime: number;
}

interface Vocabulary {
  chinese: string;
  pinyin: string;
  vietnamese: string;
  explanation: string;
}

const Index = () => {
  const [videoId, setVideoId] = useState<string>('');
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async (newVideoId: string) => {
    setIsLoading(true);
    setVideoId(newVideoId);
    
    try {
      const result = await analyzeLyric(newVideoId);
      setLyrics(result.lyrics);
      setVocabulary(result.vocabulary);
      
      toast({
        title: "Phân tích thành công!",
        description: `Đã phân tích ${result.lyrics.length} câu lyrics và ${result.vocabulary.length} từ vựng.`,
      });
    } catch (error) {
      toast({
        title: "Lỗi phân tích",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi phân tích video.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeClick = (time: number) => {
    setCurrentTime(time);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-hero text-white py-20 px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(220, 38, 127, 0.8), rgba(251, 191, 36, 0.8)), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            学唱中文歌
            <span className="block text-2xl md:text-3xl font-normal mt-2 text-white/90">
              Học hát tiếng Trung qua âm nhạc
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Khám phá cách học tiếng Trung hiệu quả nhất qua những bài hát yêu thích. 
            Phân tích lyrics, học từ vựng và cải thiện phát âm.
          </p>
          <div className="flex justify-center items-center gap-4 text-white/80">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎵</span>
              <span>Lyrics tương tác</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <span>Từ vựng chi tiết</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🗣️</span>
              <span>Pinyin chuẩn</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* YouTube Input */}
          <YoutubeInput onAnalyze={handleAnalyze} isLoading={isLoading} />

          {/* Video Player */}
          {videoId && (
            <div className="animate-fade-in">
              <VideoPlayer
                videoId={videoId}
                currentTime={currentTime}
                onTimeUpdate={setCurrentTime}
              />
            </div>
          )}

          {/* Lyrics and Vocabulary */}
          {(lyrics.length > 0 || vocabulary.length > 0) && (
            <div className="animate-fade-in">
              <LyricList
                lyrics={lyrics}
                vocabulary={vocabulary}
                onTimeClick={handleTimeClick}
                currentTime={currentTime}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted py-8 px-4 text-center text-muted-foreground">
        <div className="container mx-auto">
          <p>© 2024 Chinese Lyric Learner. Học tiếng Trung qua âm nhạc một cách thú vị và hiệu quả.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
